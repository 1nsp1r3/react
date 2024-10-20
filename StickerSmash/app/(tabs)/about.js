import { Text, View, StyleSheet } from "react-native"

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>About</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: "#25292E",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    fontSize: 20,
    color: "white",
  }
})
