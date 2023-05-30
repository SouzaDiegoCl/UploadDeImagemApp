import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import Constants from "expo-constants";

import * as Permissions from "expo-permissions";

import * as ImagePicker from "expo-image-picker";
import * as ImageCameraCall from "expo-image-picker";

export default function Upload() {
  const [avatar, setAvatar] = useState();

  async function imagePickerCall() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert("Nós precisamos dessa permissão.");
        return;
      }
    }

    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
    });

    if (data.canceled) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
  } async function imageCameraCall() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status !== "granted") {
        alert("Nós precisamos dessa permissão.");
        return;
      }
    }

    const data = await ImageCameraCall.launchCameraAsync({
      mediaTypes: ImageCameraCall.MediaTypeOptions.All
    });

    if (data.canceled) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
  } async function uploadImage() {
    var data = new FormData();
    data.append("photo", {
      name: avatar.uri,
      type: 'image/png',
      uri: avatar.uri
    }, "image.png");

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "http://10.68.36.112/denunciaPasta/imagem/upload.php");

    xhr.send(data);
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: '900', color: '#f00' }}>Insira a imagem do Animal Abandonado!</Text>
      <View style={{borderWidth:5, borderColor:'#f0f'}}>
        <Image 
          source={{
            uri: avatar
              ? avatar.uri
              : ""
          }}
          style={styles.avatar}
        ></Image>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={imagePickerCall}
      >
        <Text style={styles.buttonText}>Escolher Imagem </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={imageCameraCall}
      >
        <Text style={styles.buttonText}>Tirar Foto </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={uploadImage}
      >
        <Text style={styles.buttonText}>Enviar Imagem </Text>
      </TouchableOpacity>

    </View>

  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#912271',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#00f199',/* 123ab4 */
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  avatar: {
    width: 230,
    height: 230,
    borderRadius: 20,
    borderWidth: 20,
  },
});
