import { useState, useEffect } from "react";
import { Linking, StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from "react-native-paper";
import Constants from 'expo-constants';
import FadeView, { Bearing } from 'react-native-fadeview-wrapper';
import { useTranslation } from "react-i18next";

import { getRidePrices } from "../services/ApiService";

const grabLogo = require("../assets/rides/Grab.png");
const gojekLogo = require("../assets/rides/Gojek.png");
const comfortDelgroLogo = require("../assets/rides/Comfort_Delgro.png");

const API_BASE_URL = Constants.expoConfig.extra.PRODUCTION_API_URL;

// logos to use for supported services
const serviceLogos = {
	"Grab": grabLogo,
	"Gojek": gojekLogo,
	"Comfort Delgro": comfortDelgroLogo
}

// package name to open store for supported services
const androidServiceLinks = {
	"Grab": "com.grabtaxi.passenger",
	"Gojek": "com.gojek.app",
	"Comfort Delgro": "com.codigo.comfort"
}

/**
 * Handles popup showing of ride prices.
 */
const RidesModal = (props) => {
	// shows snackbar messages
	const [snackbar, setSnackbar] = useState({visible: false, message: ""});

	// handles language translations
	const { t } = useTranslation();

	// handles ride details
	const [details, setDetails] = useState([
	   {"service": "Grab", "current_price": " - Unavailable", "is_cheapest": false},
	   {"service": "Gojek", "current_price": " - Unavailable", "is_cheapest": false},
	   {"service": "Comfort Delgro", "current_price": " - Unavailable", "is_cheapest": false}
	]);

	// handles retrieving of ride prices on open
	useEffect(() => {
		if (props.open) {
			retrieveDetails();
		}
	}, [props.open]);

	/**
	 * Retrieves ride details.
	 */
	const retrieveDetails = async () => {
		let cookie = await AsyncStorage.getItem(API_BASE_URL);
        if (cookie == null || cookie == undefined) {
            cookie = {};
        }
		const result = await getRidePrices(JSON.parse(cookie), props.startLocation, props.endLocation);
		if (result.status == 200) {
			setDetails(result.data);
		}
	}

	/**
	 * Opens store of ride service.
	 * 
	 * @param {string} service to open store for
	 */
	const openStore = (service) => {
		try {
			Linking.openURL("market://details?id=" + androidServiceLinks[service])
		} catch (err) {
			// do nothing for now
		}
	}

	/**
	 * Renders the view for support rides.
	 * 
	 * @param {string} ride ride to render view for
	 */
	const renderRides = (ride) => {
		return (
			<TouchableOpacity key={ride.service} style={styles.modalRow} onPress={() => openStore(ride.service)}>
				<View style={styles.modalLeftColumn}>
					<Image style={styles.image} source={serviceLogos[ride.service]} />
					<Text style={styles.serviceText}>{ride.service}</Text>
				</View>
				<View style={styles.modalRightColumn}>
					<Text style={styles.priceText}>${ride.current_price}</Text>
					<View style={styles.modalStatus}>
					{ride.is_cheapest && <Text>✅</Text>}
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<FadeView
			  visible={props.open}
			  style={styles.modal}
			  bearingMoveDistance={20}
			  leaveBearing={Bearing.Top}
			  entranceBearing={Bearing.Bottom}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical={false}
				keyboardShouldPersistTaps='always'
			>
				<View>
					<Text style={styles.modalTitle}>{t("title.available_rides")}</Text>
					{details.map(renderRides)}
				</View>
			</ScrollView>
			<Snackbar style={{bottom: 50, zIndex: 1000}} duration={3000} onDismiss={() => setSnackbar({visible: false, message: ""})} visible={snackbar.visible}>
				{snackbar.message}
			</Snackbar>
		</FadeView>
	)
}

const styles = StyleSheet.create({
	modal: {
		position: "absolute",
		bottom: 10,
		height: "25%",
		backgroundColor: "white",
		marginRight: 8,
		marginLeft: 8,
		borderRadius: 25,
		borderRadius: 5,
		hasBackdrop: false
	},
	modalTitle: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 24,
		paddingBottom: 15,
		paddingTop: 15
	},
	modalRow: {
		display: "flex",
		flexDirection: "row",
		paddingBottom: 10
	},
	modalLeftColumn: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		width: "50%",
		paddingLeft: 30,
	},
	modalRightColumn: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		width: "50%",
		paddingLeft: 80
	},
	modalStatus: {
		marginLeft: "auto",
		paddingRight: 30
	},
	image: {
		width: 40,
		height: 40
	},
	serviceText: {
		fontWeight: "bold",
		fontSize: 16,
		paddingLeft: 15
	},
	priceText: {
		fontWeight: "bold",
		fontSize: 16
	}
});

export default RidesModal;