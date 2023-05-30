import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

import RidesModal from "../components/RidesModal";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;

/**
 * Main page for users to choose locations.
 */
const Home = () => {
	// handles map locations
	const mapRef = useRef(null);
	const [startLocation, setStartLocation] = useState(null);
	const [endLocation, setEndLocation] = useState(null);
	const [routeCoordinates, setRouteCoordinates] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);

	// handles showing of rides
	const [showRides, setShowRides] = useState(false);
	const handleOpenShowRides = () => setShowRides(true);
	const handleCloseShowRides = () => setShowRides(false);

	// handles language translations
	const { t } = useTranslation();

	// sets initial location based on user
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.error('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setCurrentRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA,
			});
		})();
	}, []);

	// handles opening and closing of ride details based on locations
	useEffect(() => {
			if (mapRef.current && startLocation && endLocation) {
				const bounds = [
					startLocation.coordinate,
					endLocation.coordinate,
				];
				mapRef.current.fitToCoordinates(bounds, {
					edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
				});
				handleOpenShowRides();
			} else {
				handleCloseShowRides();
			}
		}, [startLocation, endLocation]);

	// handles selecting of start location
	const handleStartLocationSelect = (data, details) => {
		const { geometry } = details;
		const { location } = geometry;
		setStartLocation({
			name: data.description,
			coordinate: {
				latitude: location.lat,
				longitude: location.lng,
			},
		});
		setRouteCoordinates([]);
	};

	// handles selecting of end location
	const handleEndLocationSelect = (data, details) => {
		const { geometry } = details;
		const { location } = geometry;
		setEndLocation({
			name: data.description,
			coordinate: {
				latitude: location.lat,
				longitude: location.lng,
			},
		});

		if (startLocation) {
			const start = `${startLocation.coordinate.latitude},${startLocation.coordinate.longitude}`;
			const end = `${location.lat},${location.lng}`;

			fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=driving&key=${GOOGLE_API_KEY}`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data.status === 'OK') {
						const points = data.routes[0].overview_polyline.points;
						const decodedPoints = decodePolyline(points);
						setRouteCoordinates(decodedPoints);
					}
				})
				.catch((error) => {
					console.error('Error fetching directions:', error);
				});
		}
	};

	// handles drawing of map lines
	const decodePolyline = (encoded) => {
		const polyline = require('@mapbox/polyline');
		const decoded = polyline.decode(encoded);
		return decoded.map((arr) => ({
			latitude: arr[0],
			longitude: arr[1],
		}));
	};

	// handles showing of markers
	const renderMarkers = () => {
		const markers = [];

		if (startLocation) {
			markers.push(
				<Marker
					key="start"
					coordinate={startLocation.coordinate}
					title={startLocation.name}
					pinColor="green"
				/>
			);
		}

		if (endLocation) {
			markers.push(
				<Marker
					key="end"
					coordinate={endLocation.coordinate}
					title={endLocation.name}
					pinColor="red"
				/>
			);
		}

		return markers;
	};

	return (
		<SafeAreaView style={styles.container}>
			<GooglePlacesAutocomplete
				placeholder={t("field.start_location")}
				onPress={handleStartLocationSelect}
				styles={autocompleteStyles}
				fetchDetails={true}
				textInputProps={{
					onChangeText: (text) => {
						if (text == "") {
								setStartLocation(null);
						}
					}
				}}
				query={{
					key: GOOGLE_API_KEY,
					language: 'en',
				}}
			/>

			<GooglePlacesAutocomplete
				placeholder={t("field.end_location")}
				onPress={handleEndLocationSelect}
				styles={autocompleteStyles}
				fetchDetails={true}
				textInputProps={{
					onChangeText: (text) => {
						if (text == "") {
								setEndLocation(null);
						}
					}
				}}
				query={{
					key: GOOGLE_API_KEY,
					language: 'en',
				}}
			/>
			{currentRegion && (
				<MapView
						ref={mapRef}
					style={styles.map}
					initialRegion={currentRegion}
				>
					{renderMarkers()}
					{routeCoordinates.length > 0 && (
						<Polyline
							coordinates={routeCoordinates}
							strokeColor="#FF0000"
							strokeWidth={3}
						/>
					)}
				</MapView>
			)}

			<RidesModal open={showRides} close={handleCloseShowRides} startLocation={startLocation}
				endLocation={endLocation}/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	map: {
		width: '100%',
		height: '100%',
	},
});

const autocompleteStyles = StyleSheet.create({
	container: {
		flex: 0,
		zIndex: 1,
		width: '100%',
	},
	textInputContainer: {
		width: '100%',
	},
	textInput: {
		height: 40,
		backgroundColor: '#FFFFFF',
		borderRadius: 5,
		paddingLeft: 10,
	},
});

export default Home;