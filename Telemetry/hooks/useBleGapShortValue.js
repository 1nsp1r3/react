/**
 *
 */
const fromBase64toUint8Array = (base64) => {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m) => m.codePointAt(0))
}

/**
 *
 */
const fromUint8ArrayToShort = (uint8Array) => {
  const dataView = new DataView(uint8Array.buffer, 0)
  return dataView.getInt16(0, 1) //littleEndian=true to swap 2 bytes
}

/**
 * main
 */
export const useBleGapShortValue = (device, uuid) => {
  const base64Value = device.serviceData[uuid]

  return fromUint8ArrayToShort(
    fromBase64toUint8Array(base64Value)
  )
}
