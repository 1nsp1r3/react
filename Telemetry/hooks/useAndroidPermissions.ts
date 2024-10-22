/**
 * Author: https://gist.github.com/ivanstnsk/4ff5bd5f1fd3c7294ebe5c365fdf48a4
 * Usage
 * const [waitingPerm, grantedPerm] = useAndroidPermissions()
 */
import {useEffect, useState} from "react"
import {PermissionsAndroid}  from "react-native"

type THook=[boolean, boolean]

interface PermissionsAndroidResponse{
  [key: string]: string
}

const PERMISSIONS_REQUEST=[
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, //A priori sans cette permission, le scan GAP plante
]

const isAllGranted=(res: PermissionsAndroidResponse)=>{
  return PERMISSIONS_REQUEST.every((permission)=>{
    return res[permission] === PermissionsAndroid.RESULTS.GRANTED
  })
}

export const useAndroidPermissions=():THook=>{
  console.log("useAndroidPermissions()")
  const [granted, setGranted] = useState(false)
  const [waiting, setWaiting] = useState(true)

  const doRequest = async () => {
    console.log("doRequest()")

    let granted = false
    try{
      const res = await PermissionsAndroid.requestMultiple(PERMISSIONS_REQUEST)
      granted = isAllGranted(res)
    }catch(err){
      console.warn(err)
    }
    setWaiting(false)
    setGranted(granted)
  }

  useEffect(()=>{
    doRequest()
  }, [])

  return [waiting, granted]
}
