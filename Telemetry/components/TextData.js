import {StyleSheet, Text} from "react-native"

type Props = {
  label: string,
  value: string,
  unit: string,
}

export default function TextData({ label, value, unit }: Props) {
  return (
    <Text style={styles.text}>{label}: {value} {unit}</Text>
  )
}

const styles = StyleSheet.create({
  text: {
    color: "#F0F0F0",
    fontSize: 30,
  },
})
