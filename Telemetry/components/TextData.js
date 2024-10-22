import {View, StyleSheet, Text} from "react-native"
import FontAwesome              from "@expo/vector-icons/FontAwesome5"

export default function TextData({ icon, value, unit }) {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} style={styles.text} />
      <Text style={styles.text}>{value} {unit}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 10,
    color: "#F0F0F0",
    fontSize: 30,
  },
})
