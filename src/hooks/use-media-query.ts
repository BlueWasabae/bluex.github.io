import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function check() {
      setValue(window.matchMedia(query).matches)
    }

    check()
    window.matchMedia(query).addEventListener("change", check)
    return () => {
      window.matchMedia(query).removeEventListener("change", check)
    }
  }, [query])

  return value
}
