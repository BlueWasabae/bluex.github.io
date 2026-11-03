# ==============================================================================
# BLUEX QUANTITATIVE EXECUTION BRIDGE - FASTAPI WEBHOOK SERVER
# Microsecond TradingView -> MT5/MT4 Automation Middleware
# ==============================================================================

import time
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Security, status, Request
from fastapi.security import APIKeyHeader
import uvicorn

from config import SystemConfig, AlertPayload
from mt5_engine import MT5ExecutionEngine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("BlueX.Server")

config = SystemConfig()
app = FastAPI(
    title="BlueX Institutional TradingView Bridge",
    description="Microsecond Webhook Execution Gateway for XAU/USD (Gold) on MT5/MT4",
    version="2.0.0"
)

# MT5 Engine Instance
mt5_engine = MT5ExecutionEngine(config)

# In-Memory Queue for MT4 Polling EA
mt4_order_queue: List[Dict[str, Any]] = []

api_key_header = APIKeyHeader(name="X-BLUEX-AUTH", auto_error=False)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing BlueX Institutional Gateway...")
    connected = mt5_engine.initialize()
    if not connected:
        logger.warning("[WARNING] MT5 not connected at startup. Will re-attempt upon alert arrival.")
    else:
        logger.info("[READY] MT5 IPC Bridge active.")

@app.on_event("shutdown")
async def shutdown_event():
    mt5_engine.shutdown()
    logger.info("BlueX Institutional Gateway safely terminated.")

@app.get("/health")
async def health_check():
    """System heartbeat and connection diagnostic."""
    return {
        "status": "operational",
        "mt5_initialized": mt5_engine.initialized,
        "mt4_queue_pending": len(mt4_order_queue),
        "timestamp": time.time()
    }

@app.post("/webhook")
async def handle_tradingview_webhook(payload: AlertPayload, request: Request):
    """
    Primary endpoint for TradingView Webhook Alerts.
    Validates token, processes institutional risk matrix, dispatches execution.
    """
    t_start = time.perf_counter()

    # Secret Validation (Payload secret or HTTP header)
    header_key = request.headers.get("X-BLUEX-AUTH")
    if payload.secret != config.WEBHOOK_SECRET_KEY and header_key != config.WEBHOOK_SECRET_KEY:
        logger.error("Unauthorized webhook rejected: Invalid secret token.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Institutional Bridge Authentication Failed"
        )

    logger.info(
        f"[ALERT RECEIVED] Action: {payload.action} | Symbol: {payload.symbol} | "
        f"Entry: {payload.entry} | SL: {payload.sl} | TP1: {payload.tp1} | Risk: {payload.risk_pct}%"
    )

    # 1. Execute on MT5 via direct native IPC
    mt5_result = mt5_engine.execute_alert(payload)

    # 2. Enqueue for MT4 if enabled
    if config.MT4_ENABLED:
        mt4_payload = payload.dict()
        mt4_payload["id"] = int(time.time() * 1000)
        mt4_order_queue.append(mt4_payload)
        # Keep queue capped
        if len(mt4_order_queue) > 50:
            mt4_order_queue.pop(0)

    elapsed_ms = (time.perf_counter() - t_start) * 1000.0
    logger.info(f"[EXECUTION FINISHED] Latency: {elapsed_ms:.2f}ms | Result: {mt5_result.get('status')}")

    return {
        "execution_latency_ms": round(elapsed_ms, 2),
        "mt5_response": mt5_result,
        "mt4_queued": config.MT4_ENABLED
    }

# ==============================================================================
# MT4 POLLING ENDPOINTS (For MQL4 EA Integration)
# ==============================================================================

@app.get("/mt4/poll")
async def mt4_poll(secret: str):
    """Allows MT4 EA to consume pending orders with minimal network overhead."""
    if secret != config.WEBHOOK_SECRET_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if not mt4_order_queue:
        return {"orders": []}

    pending_orders = list(mt4_order_queue)
    mt4_order_queue.clear()
    return {"orders": pending_orders}

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host=config.HOST,
        port=config.PORT,
        reload=False,
        log_level="info"
    )
