import {View, StyleSheet} from "react-native"

export default function ProgressBar({value}){
  return (
    <View style={styles.container}>
      <View style={[styles.unit, value > 0 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 1 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 2 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 3 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 4 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 5 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 6 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 7 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 8 ? styles.visible : styles.hidden]} />
      <View style={[styles.unit, value > 9 ? styles.visible : styles.hidden]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 5,
    backgroundColor: "blue",
  },
  unit: {
    flex: 1,
    borderWidth: 1,
  },
  visible: {
    backgroundColor: "#505050",
  },
  hidden: {
    backgroundColor: 'black',
  },
})
