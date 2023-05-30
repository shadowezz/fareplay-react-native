import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import "./assets/i18n/i18n";

import { SnackbarContext } from "./components/Snackbar";
import CustomSnackbar from "./components/Snackbar";
import { AuthContext, VerifyAuth } from "./services/AuthService";
import Login from "./screens/Login";
import HomeTabs from "./components/HomeTabs";
import EditProfile from "./screens/EditProfile";
import LoadingPlaceholder from "./screens/LoadingPlaceholder";

const API_BASE_URL = Constants.expoConfig.extra.PRODUCTION_API_URL;
const Stack = createStackNavigator();

const App = () => {
	const [cookies, setCookies] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoadedDevice, setIsLoadedDevice] = useState(false);
	const [snackbarInfo, setSnackbarInfo] = useState({visible: false, message: ""});

	// handles language translations
	const { t, i18n } = useTranslation();

	useEffect(() => {
		loadLanguage();
		setIsLoadedDevice(true);
	}, []);

	/**
	 * Loads last known language on start.
	 */
	const loadLanguage = async () => {
		let language = await AsyncStorage.getItem("language");
		if (language == null || language == undefined) {
            language = "en-US";
        }
		i18n.changeLanguage(language);
	}

	const showSnackbar = (params) => {
		params.visible = true;
		setSnackbarInfo(params);
	}

	const hideSnackbar = (params) => {
		setSnackbarInfo({...params, visible: false});
	}

	const handleSetCookies = async (cookies) => {
		if (cookies == null || undefined) {
			setIsLoggedIn(false);
			await AsyncStorage.removeItem(API_BASE_URL);
		} else {
			setIsLoggedIn(true);
			await AsyncStorage.setItem(API_BASE_URL, cookies);
		}
	}

	return (
		<AuthContext.Provider value={{ cookies, handleSetCookies }}>
		<PaperProvider>
		<SnackbarContext.Provider value={{snackbarInfo, hide: hideSnackbar, show: showSnackbar}}>
			<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
			{(() => {
				if (!isLoadedDevice) {
					return (
						<Stack.Screen name="HomeTabs" component={LoadingPlaceholder} />
					)
				} else if (isLoggedIn) {
					return (
						<>
						<Stack.Screen name="HomeTabs" component={HomeTabs} />
						<Stack.Screen name={t("header.edit_profile")} component={EditProfile} options={{
							title: t("header.edit_profile"), //Set Header Title
							headerStyle: {
								backgroundColor: '#f4511e', //Set Header color
							},
							headerTintColor: '#fff', //Set Header text color
							headerTitleStyle: {
								fontWeight: 'bold', //Set Header text style
							},
						}}/>
						</>
					)
				} else {
					return (
						<Stack.Screen name="Login" component={Login} />
					)
				}
			})()}
			</Stack.Navigator>
			</NavigationContainer>
			<CustomSnackbar/>
		</SnackbarContext.Provider>
	    </PaperProvider>
	    </AuthContext.Provider>
    );
}


export default App;