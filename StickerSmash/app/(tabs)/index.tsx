import { Text, View, StyleSheet, Platform } from "react-native"
import { useState, useRef } from "react"
import { Link } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as MediaLibrary from "expo-media-library"
import { captureRef } from "react-native-view-shot"
import domtoimage from "dom-to-image"
import { StatusBar } from "expo-status-bar" //Only for Android dark mode?

import ImageViewer from "@/components/ImageViewer"
import Button from "@/components/Button"
import CircleButton from "@/components/CircleButton"
import IconButton from "@/components/IconButton"
import EmojiPicker from "@/components/EmojiPicker"
import EmojiList from "@/components/EmojiList"
import EmojiSticker from "@/components/EmojiSticker"

const PlaceholderImage = require("@/assets/images/background-image.png")

/**
 *
 */
export default function Index() {
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [pickedEmoji, setPickedEmoji] = useState<string | undefined>(undefined)
  const imageRef = useRef()

  if (status === null) requestPermission()

  /**
  *
  */
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (result.canceled) {
      alert("You did not select any image.")
    } else {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
      console.log(result)
    }
  }

  const onReset = () => {
    setShowAppOptions(false)
    setPickedEmoji(undefined)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  const androidSave = async()=>{
    const localUri = await captureRef(imageRef, {
      height: 440,
      quality: 1,
    })

    if (Platform.OS == "web"){
      await domtoimage.toJpeg(localUri)
    }else{
      await MediaLibrary.saveToLibraryAsync(localUri)
    }
    if (localUri) alert("Saved!")
  }

  const webSave = async()=>{
    const dataUrl = await domtoimage.toJpeg(imageRef.current, {
      quality: 0.95,
      width: 320,
      height: 440,
    })

    let link = document.createElement("a")
    link.download = "sticker-smash.jpeg"
    link.href = dataUrl
    link.click()
  }

  const onSaveImageAsync = async () => {
    try {
      if (Platform.OS == "web"){
        await webSave()
      }else{
        await androidSave()
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
          <View style={styles.imageContainer}>
            <View ref={imageRef} collapsable={false}>
              <ImageViewer src={PlaceholderImage} selectedImage={selectedImage} />
              {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
            </View>
          </View>
          { showAppOptions ? (
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton icon="refresh" label="Reset" onPress={onReset} />
                <CircleButton onPress={onAddSticker}/>
                <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
              </View>
            </View>
          ) : (
            <View style={styles.footerContainer}>
              <Button theme="primary" onPress={pickImageAsync} label="Choose a photo" />
              <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
            </View>
          )}
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
          </EmojiPicker>
      </GestureHandlerRootView>
      <StatusBar style="light" />
    </>
  )
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: "#25292E",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  mainText: {
    color: "yellow",
  },
  aboutButton: {
    fontSize: 20,
    color: "white",
    textDecorationLine: "underline",
  },
})
