/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import haversine from 'haversine';
import Geolocation from '@react-native-community/geolocation';

const App: () => React$Node = () => {
  const LATITUDE_DELTA = 0.009;
  const LONGITUDE_DELTA = 0.009;
  const LATITUDE = 37.78825;
  const LONGITUDE = -122.4324;

  const [routeCoordinates, setRouteCoordinates] = React.useState([]);
  const [distanceTravelled, setDistanceTravelled] = React.useState(0);
  const [prevLatLng, setPrevLatLng] = React.useState({});
  const [latitudeTop, setLatitudeTop] = React.useState(LATITUDE);
  const [longitudeTop, setLongitudeTop] = React.useState(LONGITUDE);
  const [marker, setMarker] = React.useState();

  const [coordinate, setCoordinate] = React.useState(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  );

  useEffect(() => {
    const calcDistance = (newLatLng) => {
      return haversine(prevLatLng, newLatLng) || 0;
    };

    const watchID = Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };

        if (Platform.OS === 'android') {
          if (marker) {
            marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        setLongitudeTop(longitude);
        setLatitudeTop(latitude);
        setRouteCoordinates(routeCoordinates.concat([newCoordinate]));
        setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate));
        setPrevLatLng(newCoordinate);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
    Geolocation.clearWatch(watchID);
  });

  const getMapRegion = () => ({
    latitude: latitudeTop,
    longitude: longitudeTop,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Text>Hello</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            showUserLocation
            followUserLocation
            loadingEnabled
            region={getMapRegion()}>
            <Polyline coordinates={routeCoordinates} strokeWidth={5} />
            <Marker.Animated
              ref={(marker) => {
                setMarker(marker);
              }}
              coordinate={coordinate}
            />
          </MapView>
          <View>
            <TouchableOpacity>
              <Text>{parseFloat(distanceTravelled).toFixed(2)} km</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
  },
});

export default App;
