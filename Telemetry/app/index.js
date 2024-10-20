import {Text, View, StyleSheet} from "react-native"

export default function Index(){
  const temperature = 0
  const pressure = 0
  return(
    <View style={styles.mainView}>
      <Text style={styles.text}>Temperature: {temperature} °C</Text>
      <Text style={styles.text}>Pressure: {pressure} bars</Text>
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
  text: {
    color: "#F0F0F0",
    fontSize: 40,
  }
})
