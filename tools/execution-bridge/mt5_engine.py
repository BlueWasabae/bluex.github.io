# ==============================================================================
# BLUEX QUANTITATIVE EXECUTION BRIDGE - METATRADER 5 NATIVE ENGINE
# High-speed Windows IPC execution engine via official MetaTrader 5 API
# Strict Non-Repainting Institutional Execution Protocol
# ==============================================================================

import logging
import math
from typing import Dict, Any, Tuple, Optional
import MetaTrader5 as mt5
from config import SystemConfig, AlertPayload

logger = logging.getLogger("BlueX.MT5Engine")

class MT5ExecutionEngine:
    def __init__(self, config: SystemConfig):
        self.config = config
        self.initialized = False

    def initialize(self) -> bool:
        """Establishes high-performance IPC connection to MetaTrader 5 terminal."""
        init_kwargs: Dict[str, Any] = {"path": self.config.MT5_PATH}
        if self.config.MT5_LOGIN > 0 and self.config.MT5_PASSWORD and self.config.MT5_SERVER:
            init_kwargs["login"] = self.config.MT5_LOGIN
            init_kwargs["password"] = self.config.MT5_PASSWORD
            init_kwargs["server"] = self.config.MT5_SERVER

        if not mt5.initialize(**init_kwargs):
            logger.error(f"[MT5] Initialization failed: {mt5.last_error()}")
            return False

        account_info = mt5.account_info()
        if account_info is None:
            logger.error("[MT5] Failed to fetch account information.")
            return False

        self.initialized = True
        logger.info(
            f"[MT5] Connected successfully. Account: {account_info.login} | "
            f"Broker: {account_info.company} | Currency: {account_info.currency} | "
            f"Balance: {account_info.balance:.2f} | Equity: {account_info.equity:.2f}"
        )
        return True

    def shutdown(self):
        """Terminates IPC connection to MetaTrader 5."""
        if self.initialized:
            mt5.shutdown()
            self.initialized = False
            logger.info("[MT5] Terminal connection terminated.")

    def resolve_symbol(self, requested_symbol: str) -> Optional[str]:
        """Resolves broker-specific symbol naming conventions (e.g. XAUUSD, GOLD, XAUUSDm)."""
        all_symbols = mt5.symbols_get()
        if not all_symbols:
            return None

        candidates = [
            requested_symbol.upper(),
            "XAUUSD",
            "GOLD",
            f"{requested_symbol.upper()}m",
            f"{requested_symbol.upper()}.a",
            f"{requested_symbol.upper()}+",
            f"{requested_symbol.upper()}pro"
        ]

        for s in all_symbols:
            if s.name in candidates or requested_symbol.upper() in s.name:
                mt5.symbol_select(s.name, True)
                return s.name

        return None

    def calculate_lot_size(
        self,
        symbol: str,
        entry_price: float,
        sl_price: float,
        risk_pct: float
    ) -> Tuple[float, float]:
        """
        Calculates exact fractional risk lot size for institutional execution.
        Formulation:
            CashRisk = Equity * (RiskPct / 100)
            PriceDelta = |Entry - SL|
            PointRisk = PriceDelta / TickSize
            LotSize = CashRisk / (PointRisk * TickValue)
        """
        account_info = mt5.account_info()
        symbol_info = mt5.symbol_info(symbol)

        if account_info is None or symbol_info is None:
            raise ValueError(f"Unable to query market parameters for {symbol}")

        equity = account_info.equity
        cash_risk = equity * (min(risk_pct, self.config.MAX_RISK_PCT) / 100.0)
        price_delta = abs(entry_price - sl_price)

        if price_delta <= 0:
            raise ValueError("Entry price and Stop Loss cannot be identical.")

        tick_size = symbol_info.trade_tick_size if symbol_info.trade_tick_size > 0 else 0.01
        tick_value = symbol_info.trade_tick_value if symbol_info.trade_tick_value > 0 else 1.0
        contract_size = symbol_info.trade_contract_size if symbol_info.trade_contract_size > 0 else 100.0

        # Exact financial formula for XAU/USD
        # 1 lot of XAU/USD = 100 oz. A $1.00 move per lot = $100.00 profit/loss.
        points_at_risk = price_delta / tick_size
        cost_per_lot_risk = points_at_risk * tick_value

        if cost_per_lot_risk <= 0:
            raw_lots = (cash_risk / (price_delta * contract_size))
        else:
            raw_lots = cash_risk / cost_per_lot_risk

        # Clamp against broker specifications
        lot_step = symbol_info.volume_step if symbol_info.volume_step > 0 else 0.01
        min_lot = symbol_info.volume_min if symbol_info.volume_min > 0 else 0.01
        max_lot = symbol_info.volume_max if symbol_info.volume_max > 0 else 100.0

        steps = math.floor(raw_lots / lot_step)
        calculated_lot = steps * lot_step
        final_lot = max(min_lot, min(max_lot, calculated_lot))
        final_lot = round(final_lot, 2)

        return final_lot, cash_risk

    def execute_alert(self, payload: AlertPayload) -> Dict[str, Any]:
        """Dispatches mechanical institutional order to MetaTrader 5."""
        if not self.initialized:
            if not self.initialize():
                return {"status": "error", "message": "MT5 terminal offline"}

        symbol = self.resolve_symbol(payload.symbol)
        if not symbol:
            return {"status": "error", "message": f"Symbol {payload.symbol} could not be resolved on broker"}

        tick = mt5.symbol_info_tick(symbol)
        if not tick:
            return {"status": "error", "message": f"Cannot acquire live tick for {symbol}"}

        # Spread Filter Verification
        symbol_info = mt5.symbol_info(symbol)
        spread_points = (tick.ask - tick.bid) / symbol_info.point
        if spread_points > self.config.MAX_SPREAD_POINTS:
            return {
                "status": "rejected",
                "message": f"Spread {spread_points:.1f} points exceeds institutional threshold of {self.config.MAX_SPREAD_POINTS}"
            }

        action_upper = payload.action.upper()

        # Handle Order Cancellation on Invalidation Sweeps
        if action_upper in ["CANCEL", "CANCEL_ALL"]:
            return self._cancel_pending_orders(symbol, payload.magic)

        # Handle Close Orders
        if action_upper in ["CLOSE_ALL", "CLOSE_PARTIAL"]:
            return self._close_positions(symbol, payload.magic, partial=(action_upper == "CLOSE_PARTIAL"))

        # Determine Execution Prices
        entry = payload.entry if payload.entry is not None else (tick.ask if "BUY" in action_upper else tick.bid)
        sl = payload.sl
        tp = payload.tp1

        # Enforce Minimum 1:3 RR Risk Matrix
        risk_dist = abs(entry - sl)
        reward_dist = abs(tp - entry)
        if risk_dist > 0:
            rr_ratio = reward_dist / risk_dist
            if rr_ratio < self.config.MIN_RR_RATIO - 0.05:
                logger.warning(f"Calculated RR {rr_ratio:.2f} is below target 1:3 baseline.")

        # Position Sizing
        lot_size, cash_risk = self.calculate_lot_size(
            symbol=symbol,
            entry_price=entry,
            sl_price=sl,
            risk_pct=payload.risk_pct or self.config.DEFAULT_RISK_PCT
        )

        # Build MT5 Order Request
        request: Dict[str, Any] = {
            "symbol": symbol,
            "volume": lot_size,
            "sl": float(sl),
            "tp": float(tp),
            "deviation": self.config.MAX_SLIPPAGE_POINTS,
            "magic": payload.magic or self.config.MAGIC_NUMBER_BASE,
            "comment": payload.comment[:31] if payload.comment else "BlueX S&D Execution",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC
        }

        # Select Order Type
        if action_upper == "BUY":
            request["action"] = mt5.TRADE_ACTION_DEAL
            request["type"] = mt5.ORDER_TYPE_BUY
            request["price"] = tick.ask
        elif action_upper == "SELL":
            request["action"] = mt5.TRADE_ACTION_DEAL
            request["type"] = mt5.ORDER_TYPE_SELL
            request["price"] = tick.bid
        elif action_upper == "BUY_LIMIT":
            request["action"] = mt5.TRADE_ACTION_PENDING
            request["type"] = mt5.ORDER_TYPE_BUY_LIMIT
            request["price"] = float(entry)
            request["type_filling"] = mt5.ORDER_FILLING_RETURN
        elif action_upper == "SELL_LIMIT":
            request["action"] = mt5.TRADE_ACTION_PENDING
            request["type"] = mt5.ORDER_TYPE_SELL_LIMIT
            request["price"] = float(entry)
            request["type_filling"] = mt5.ORDER_FILLING_RETURN
        else:
            return {"status": "error", "message": f"Unsupported action type: {action_upper}"}

        # Dispatch Order
        result = mt5.order_send(request)
        if result is None:
            return {"status": "error", "message": f"Execution failed: {mt5.last_error()}"}

        if result.retcode != mt5.TRADE_RETCODE_DONE:
            return {
                "status": "failed",
                "retcode": result.retcode,
                "comment": result.comment,
                "message": f"Broker returned code {result.retcode}: {result.comment}"
            }

        return {
            "status": "success",
            "order_ticket": result.order,
            "deal_ticket": result.deal,
            "symbol": symbol,
            "action": action_upper,
            "volume": lot_size,
            "entry_price": entry,
            "sl": sl,
            "tp": tp,
            "risk_cash": round(cash_risk, 2)
        }

    def _cancel_pending_orders(self, symbol: str, magic: Optional[int]) -> Dict[str, Any]:
        """Cancels active limit orders upon structure invalidation."""
        orders = mt5.orders_get(symbol=symbol)
        if not orders:
            return {"status": "success", "canceled_count": 0, "message": "No active pending orders to cancel"}

        canceled = 0
        for ord in orders:
            if magic and ord.magic != magic:
                continue
            req = {
                "action": mt5.TRADE_ACTION_REMOVE,
                "order": ord.ticket
            }
            res = mt5.order_send(req)
            if res and res.retcode == mt5.TRADE_RETCODE_DONE:
                canceled += 1

        return {"status": "success", "canceled_count": canceled}

    def _close_positions(self, symbol: str, magic: Optional[int], partial: bool = False) -> Dict[str, Any]:
        """Closes open positions or executes 50% partial take-profit."""
        positions = mt5.positions_get(symbol=symbol)
        if not positions:
            return {"status": "success", "closed_count": 0, "message": "No open positions found"}

        closed = 0
        for pos in positions:
            if magic and pos.magic != magic:
                continue

            symbol_info = mt5.symbol_info(symbol)
            close_vol = pos.volume
            if partial:
                close_vol = round(max(symbol_info.volume_min, pos.volume * 0.5), 2)

            tick = mt5.symbol_info_tick(symbol)
            order_type = mt5.ORDER_TYPE_SELL if pos.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY
            price = tick.bid if pos.type == mt5.POSITION_TYPE_BUY else tick.ask

            req = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": close_vol,
                "type": order_type,
                "position": pos.ticket,
                "price": price,
                "deviation": self.config.MAX_SLIPPAGE_POINTS,
                "magic": pos.magic,
                "comment": "BlueX Partial TP" if partial else "BlueX Invalidation Close"
            }
            res = mt5.order_send(req)
            if res and res.retcode == mt5.TRADE_RETCODE_DONE:
                closed += 1

        return {"status": "success", "closed_count": closed}
