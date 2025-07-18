import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const savePhoto = () => {
    // Here you would typically upload the photo to your backend
    // For now, we'll just pass it back as a parameter
    router.back({
      params: { photoUri: photo }
    });
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Take Photo',
          headerRight: () => (
            <IconButton
              icon="close"
              onPress={() => router.back()}
            />
          ),
        }}
      />

      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.previewActions}>
            <Button 
              mode="contained" 
              onPress={() => setPhoto(null)} 
              style={styles.retakeButton}
            >
              Retake
            </Button>
            <Button 
              mode="contained" 
              onPress={savePhoto} 
              style={styles.useButton}
            >
              Use Photo
            </Button>
          </View>
        </View>
      ) : (
        <>
          <Camera 
            style={styles.camera} 
            type={type}
            ref={cameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
                <Text style={styles.flipText}>Flip</Text>
              </TouchableOpacity>
            </View>
          </Camera>
          
          <View style={styles.controls}>
            <Button 
              mode="contained" 
              onPress={pickImage} 
              style={styles.galleryButton}
              icon="image"
            >
              Gallery
            </Button>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    position: 'relative',
  },
  cameraControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  flipText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  galleryButton: {
    backgroundColor: '#a085e9',
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    borderRadius: 10,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  retakeButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#E53935',
  },
  useButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#43A047',
  },
});
