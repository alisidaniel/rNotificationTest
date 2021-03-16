/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyARRqg-uBKLYXx1ftOb8mTnR3xpphbO9mU';

const App: () => React$Node = () => {

  const mapView = useRef();

  const [coordinates, setCoordinates] = useState([
    {
      latitude: 0, // Origin
      longitude: 0,
    },
    {
      latitude: 0, // Destination
      longitude: 0,
    },
  ]);

  useEffect(() => {
    Geolocation.getCurrentPosition((info) => console.log(info));
    Geolocation.watchPosition((position) => {
      const {latitude, longitude} = position.coords;
      console.log('go here', latitude, longitude);
      setCoordinates([    
      {
        latitude: latitude, // Origin
        longitude: longitude,
      },
      {
        latitude: 4.80370799, // Destination
        longitude: 6.9904214,
      },]);
      console.log("new coordinates", coordinates);
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <MapView style={{flex: 1, width: '100%'}} ref={mapView}>
          {coordinates.map((coordinate, index) => (
            <MapView.Marker
              key={`coordinate_${index}`}
              coordinate={coordinate}
            />
          ))}
          <MapViewDirections
            apikey={GOOGLE_MAPS_APIKEY}
            origin={coordinates[0]}
            waypoints={coordinates}
            destination={coordinates[coordinates.length - 1]}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints
            onStart={(params) => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={(result) => {
              console.log(`routing complete, distance is: ${result.distance}`);
              mapView.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={(errorMessage) => {
              console.log(`GOT AN ERROR: ${errorMessage}`);
            }}
          />
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});

export default App;
