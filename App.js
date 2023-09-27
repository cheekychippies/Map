import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API_KEY } from '@env';

export default function App() {
  const [text, setText] = useState('');
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 60.200692, // Initial latitude
    longitude: 24.934302, // Initial longitude
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 60.200692, // Initial latitude
    longitude: 24.934302, // Initial longitude
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  const [address, setAddress] = useState('');

  const buttonPressed = () => {
    getMuunnos();
  };

  const getMuunnos = () => {
    const apiUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${text}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.results.length > 0) {
          const firstResult = responseJson.results[0];
          const latitude = firstResult.locations[0].latLng.lat;
          const longitude = firstResult.locations[0].latLng.lng;
          const street = firstResult.locations[0].street;

          setAddress({
            street
          });

          setMarkerPosition({
            latitude,
            longitude,
          });

          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          });
        } else {
          Alert.alert('Error', 'Conversion failed');
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        region={mapRegion}
      >
        {markerPosition && (
          <Marker
            coordinate={markerPosition}
            title={address.street}
          />
        )}
      </MapView>
      <TextInput style={styles.input} onChangeText={text => setText(text)} value={text} />
      <Button onPress={buttonPressed} title="Show" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  input: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
