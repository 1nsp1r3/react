import {useState, useEffect} from "react"

/**
 * main
 */
export const useInterval = (delay, cb)=>{
  const [enable, setEnable] = useState(0)

  useEffect(()=>{
    if (!enable){
      setInterval(cb, delay)
      setEnable(1)
    }
  })
}
