import {StyleSheet, View, Button, PermissionsAndroid} from "react-native"
import {useState}                                     from "react"
import {BleManager, State}                            from "react-native-ble-plx"

import TextData                from "@/components/TextData"
import AndroidPermissions      from "@/components/AndroidPermissions"
import ProgressBar             from "@/components/ProgressBar"
import {useAndroidPermissions} from "@/hooks/useAndroidPermissions"
import {useBleGapShortValue}   from "@/hooks/useBleGapShortValue"
import {usePsiToBar}           from "@/hooks/usePsiToBar"
import {useInterval}           from "@/hooks/useInterval"

export default function Index(){
  const [waitingPerm, grantedPerm]                            = useAndroidPermissions()
  const [temperature, setTemperature]                         = useState(0)
  const [pressure, setPressure]                               = useState(0)
  const [secondsWithoutReception, setSecondsWithoutReception] = useState(0)

  let lastReception = 0
  let manager       = null

  const extractValues = (Device) => {
    setTemperature(
      Math.round(
        useBleGapShortValue(Device, "00001809-0000-1000-8000-00805f9b34fb") / 100 //7599 -> 75.99 °C
      ) //75.99 °C -> 76 °C
    )
    setPressure(
      Math.round(
        usePsiToBar(
          useBleGapShortValue(Device, "00002a6d-0000-1000-8000-00805f9b34fb") / 100 //7599 -> 75.99 psi
        ) //75.99 psi -> 5.24 bars
      ) //5.24 bars -> 5 bars
    )
  }

  /**
   *
   */
  const getManager = () => {
    if (manager == null){
      console.log("start manager...")
      manager = new BleManager() //1 seule instance autorisée, attention à ne pas recréer à chaque render
    }
    return manager
  }

  /**
   *
   */
  const scan = async () => {
    lastReception = new Date().getTime()
    setInterval(() => {
      const now = new Date().getTime()
      setSecondsWithoutReception(Math.round((now-lastReception)/1000))
    }, 1000)

    const state = await getManager().state()
    if (state != State.PoweredOn){
      console.log("state", state)
      console.log("start manager... KO")
      return
    }

    console.log("start scan()")
    const UUIDS = ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"]
    manager.startDeviceScan(UUIDS, null, (error, device) => {
      if (error){
        console.error("[ERROR]", error)
        return
      }
      console.log(`${device.id} | ${device.localName} | ${device.name}`)
      if (device.localName == "MX5"){
        //console.log(device)
        lastReception = new Date().getTime()
        console.log("new data!", lastReception)
        extractValues(device)
      }
    })
  }

  const stopScan = () => {
    console.log("stopScan()...")
    getManager().stopDeviceScan()
    console.log("stopScan()... OK")
  }

/*
  useInterval(1000, () => {
    const now = new Date().getTime()
    console.log(now-lastReception.value)
  })*/

  return(
    <View style={{flex: 1}}>
      <View style={[styles.box, styles.first]}>
        <TextData icon="thermometer-half" value={temperature} unit="°C" />
        <Button title="scan()" onPress={scan} />
      </View>
      <View style={[styles.box, styles.second]}>
        <TextData icon="oil-can" value={pressure} unit="bars" />
        <Button title="stopScan()" onPress={stopScan} />
      </View>
      <ProgressBar value={secondsWithoutReception} />
      <View style={[styles.box, styles.footer]}>
        <AndroidPermissions status={grantedPerm} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    backgroundColor: "#000000",
    justifyContent: "center",
  },
  first: {
    flex: 1,
    alignItems: "center",
  },
  second: {
    flex: 1,
    alignItems: "center",
  },
  footer: {
    height: 50,
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    color: "yellow",
    fontSize: 20,
  },
})
