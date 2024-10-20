import {StyleSheet, Text, View, Button, PermissionsAndroid} from "react-native"
import { useState } from "react"
import {BleManager, State} from "react-native-ble-plx"
import TextData from "@/components/TextData"

export default function Index(){
  const [temperature, setTemperature] = useState(0)
  const [pressure, setPressure] = useState(0)
  let isLocationOn = false
  let manager = null

  const requestAccessFineLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Telemetry requests ACCESS_FINE_LOCATION permission",
          message: "Telemetry requests ACCESS_FINE_LOCATION permission",
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("ACCESS_FINE_LOCATION granted")
      } else {
        console.log("ACCESS_FINE_LOCATION denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const requestAccessCoarseLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Telemetry requests ACCESS_COARSE_LOCATION permission",
          message: "Telemetry requests ACCESS_COARSE_LOCATION permission",
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("ACCESS_COARSE_LOCATION granted")
      } else {
        console.log("ACCESS_COARSE_LOCATION denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  /**
   * A returner true !
   */
  const checkBleScanPermission = async () => {
    console.log("requestBleScanPermission...")
    try {
      console.log("avant")
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
      console.log("apres", granted)
      if (granted) {
        console.log("BLUETOOTH_SCAN granted")
      } else {
        console.log("BLUETOOTH_SCAN denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }


  const fromBase64toUint8Array = (b64) => {
    const binString = atob(b64)
    return Uint8Array.from(binString, (m) => m.codePointAt(0))
  }

  const fromUint8ArrayToShort = (uint8Array) => {
    const dataView = new DataView(uint8Array.buffer, 0)
    return dataView.getInt16(0, 1) //littleEndian=true to swap 2 bytes
  }

  /*
   * "serviceData": {
   *   "00001809-0000-1000-8000-00805f9b34fb": "AQk=",
   *   "00002a6d-0000-1000-8000-00805f9b34fb": "6hs="
   * }
   * temperature (short value) Eg. 7599 -> 75.99°C
   * pressure (short value) Eg. 7599 -> 75.99PSI
   */
  const extractValues = (Device) => {
    const temperatureBase64 = Device.serviceData["00001809-0000-1000-8000-00805f9b34fb"]
    const pressureBase64 = Device.serviceData["00002a6d-0000-1000-8000-00805f9b34fb"]

    setTemperature(
      fromUint8ArrayToShort(
        fromBase64toUint8Array(temperatureBase64)
      ) / 100
    )
    setPressure(
      fromUint8ArrayToShort(
        fromBase64toUint8Array(pressureBase64)
      ) / 100
    )
  }

  const scan = async () => {
    console.log("start manager...")
    manager = new BleManager() //1 seule instance autorisée, attention à ne pas recréer à chaque render
    const state = await manager.state()
    if (state != State.PoweredOn){
      console.log("state", state)
      console.log("start manager... KO")
      return
    }

    console.log("start scan()")
    const UUIDS = ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"]
    manager.startDeviceScan(UUIDS, null, (error, device) => {
      if (error) return
      console.log(`${device.id} | ${device.localName} | ${device.name}`)
      if (device.localName == "MX5"){
        //console.log(device)
        console.log("new data!")
        extractValues(device)
      }
    })
  }

  const stopScan = () => {
    console.log("stopScan()...")
    manager.stopDeviceScan()
    console.log("stopScan()... OK")
  }

  return(
    <View style={styles.mainView}>
      <TextData label="Temperature" value={temperature} unit="°C" />
      <TextData label="Pressure" value={pressure} unit="PSI" />

      <Button title="requestAccessFineLocationPermission()" onPress={requestAccessFineLocationPermission} />
      <Button title="requestAccessCoarseLocationPermission()" onPress={requestAccessCoarseLocationPermission} />
      <Button title="checkBleScanPermission()" onPress={checkBleScanPermission} />
      <Button title="scan()" onPress={scan} />
      <Button title="stopScan()" onPress={stopScan} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
