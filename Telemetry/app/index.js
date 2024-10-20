import {StyleSheet, Text, View, Button, PermissionsAndroid} from "react-native"
import {BleManager} from "react-native-ble-plx"
import TextData from "@/components/TextData"

export default function Index(){
  const temperature = 0
  const pressure = 0
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

  const addLocationListener = async () => {
    try {
      const subscription = await SystemSetting.addLocationListener(data => {
        console.log("Location:", data)
      })
    } catch (error) {
      console.error("Error adding location listener:", error)
    }
  }

  const scan = () => {
    console.log("scan()...")
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) return
      console.log(`${device.id} | ${device.localName} | ${device.name}`)
    })
  }

  const startManager = () => {
    console.log("startManager()...")
    manager = new BleManager() //1 seule instance autorisée, attention à ne pas recréer à chaque render
    const stateChangeListener = manager.onStateChange(state => {
      console.log("onStateChange:", state)
      //if (state === State.PoweredOn) scan()
    })
  }

  return(
    <View style={styles.mainView}>
      <TextData label="Temperature" value="19" unit="°C" />
      <TextData label="Pressure" value="4.5" unit="bars" />

      <Button title="requestAccessFineLocationPermission()" onPress={requestAccessFineLocationPermission} />
      <Button title="requestAccessCoarseLocationPermission()" onPress={requestAccessCoarseLocationPermission} />
      <Button title="checkBleScanPermission()" onPress={checkBleScanPermission} />
      <Button title="addLocationListener()" onPress={addLocationListener} />
      <Button title="startManager()" onPress={startManager} />
      <Button title="scan()" onPress={scan} />
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
