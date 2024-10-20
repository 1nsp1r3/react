# BLE with react native
- [[https://expo.dev/blog/how-to-build-a-bluetooth-low-energy-powered-expo-app]]
  - Cet article explique comment faire fonctionner le bluetooth avec expo

## Solution A
- [[https://github.com/dotintent/react-native-ble-plx]]
- [[https://medium.com/@akashpoovaragavan/connect-ble-devices-with-react-native-ble-plx-89f0dc907d8a]]

```
npx expo install react-native-ble-plx
```

Ajouter les droits dans AndroidManifest.xml (?)

```xml
<!-- Bluetooth -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!-- Pas besoin ? -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
```

Hook for location ready
```js
import { useEffect } from "react"

useEffect(() => {
   let locationSubscription: EmitterSubscription | null = null

   const addLocationListener = async () => {
      try {
         const subscription = await SystemSetting.addLocationListener(data => {
            console.log("Location: ", data)
            setIsLocationOn(data)
         })
         locationSubscription = subscription
      } catch (error) {
         console.error("Error adding location listener:", error)
      }
   }
   addLocationListener()

   const stopLocationListener = () => {
      if (locationSubscription) {
         console.log("Listener stopped")
         locationSubscription.remove()
         locationSubscription = null
      }
   }

   return () => {
      stopLocationListener()
   }
}, [isLocationOn])
```

Hook for BLE ready
```js
import { useEffect } from "react"
import { BleManager } from "react-native-ble-plx"

export const manager = new BleManager() //1 seule instance autorisée, attention à ne pas recréer à chaque render

useEffect(() => {
   const stateChangeListener = manager.onStateChange(state => {
      console.log("onStateChange: ", state)

      if (state === State.PoweredOn) scan()
   })

   return () => {
      stateChangeListener?.remove()
   }
}, [manager])
```

```js
function scan() {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) return

    // Check if it is a device, you are looking for based on advertisement data
    // or other criteria.
    if (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag") {
      connect()
      manager.stopDeviceScan()
    }
  })
}
```

```json
{
  "_manager": {
    "_activePromises": {},
    "_activeSubscriptions": {
      "1": [Object]
    },
    "_eventEmitter": {
      "_nativeModule": [Object]
    },
    "_scanEventSubscription": {
      "remove": [Function remove]
    },
    "_uniqueId": 2
  },
  "id": "CE:C1:6A:8F:3B:E8",
  "isConnectable": true,
  "localName": "RaceBox Mini S 2231800501",
  "manufacturerData": null,
  "mtu": 23,
  "name": "RaceBox Mini S 2231800501",
  "overflowServiceUUIDs": null,
  "rawScanRecord": "AgEGGglSYWNlQm94IE1pbmkgUyAyMjMxODAwNTAxEQeeytwkDuWp4JPzo7UBAEBuAAAAAAAAAAAAAAAAAAA=",
  "rssi": -73,
  "serviceData": null,
  "serviceUUIDs": ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"],
  "solicitedServiceUUIDs": null,
  "txPowerLevel": null
}
```

## Solution B
- [[https://github.com/innoveit/react-native-ble-manager]]
- [[https://medium.com/@varunkukade999/part-1-bluetooth-low-energy-ble-in-react-native-694758908dc2]]
  - react-native-android-location-enabler
  - react-native-permissions
