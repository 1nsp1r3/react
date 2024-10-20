import { StyleSheet } from "react-native"
import { Image } from "expo-image"

type Props = {
  src: string,
  selectedImage?: string,
}

export default function ImageViewer({ src, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : src;
  return <Image source={imageSource} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
})
