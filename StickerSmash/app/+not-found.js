import { View, StyleSheet } from "react-native"
import { Link } from "expo-router"

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Link href="/" style={styles.backButton}>Go back to home screen!</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    color: "white",
    fontSize: 20,
    textDecorationLine: "underline",
  },
})