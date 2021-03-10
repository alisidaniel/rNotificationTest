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

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import haversine from 'haversine';

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

  const {coordinate} = React.useState(
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

    const watchID = navigator.geolocation.watchPosition(
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
    navigator.geolocation.clearWatch(watchID);
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
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.container}>
            <MapView
              style={styles.map}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.bubble, styles.button]}>
                <Text style={styles.bottomBarContent}>
                  {parseFloat(distanceTravelled).toFixed(2)} km
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default App;
