import { StatusBar } from "expo-status-bar";
import React, { useState, useContext, useRef } from "react";
import { Linking, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

import { SnackbarContext } from "../components/Snackbar";
import { checkIsLoggedIn, getSingpassAuthorizationUrl } from "../services/ApiService";
import { useAuth } from "../services/AuthService";
import { parseCookies } from "../utils";

const REDIRECTION_URL = Constants.expoConfig.extra.REDIRECTION_URL;

const App = () => {
	// context for authentication
    const { handleSetCookies } = useAuth();

	// handles singpass webview
	const webRef = useRef(null);

	// shows snackbar messages
    const { show } = useContext(SnackbarContext);

	// handles language translations
	const { t } = useTranslation();

	// handles logging in
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [authorizationUrl, setAuthorizationUrl] = useState(null);
	const [cookieString, setCookieString] = useState("");
	const injectedCookie = `document.cookie = ${cookieString};`;

	/**
	 * Polls server to check login status periodically (naive implementation, can be improved).
	 * 
	 * @param {string} cookie cookie used to check.
	 */
	const doLoginCheck = (cookie) => {
	    let intervalId;

		// check login every 3 seconds
	    intervalId = setInterval(async () => {
	        const result = await checkIsLoggedIn(cookie);
	        if (result.status == 200) {
	            await handleSetCookies(JSON.stringify(cookie));
	            clearInterval(intervalId)
	        }
	    }, 3000);

	    // timeout 2 minutes (120 seconds)
	    setTimeout(() => {
	      clearInterval(intervalId);
	    }, 120000);
	}

	/**
	 * Handles logic for logging in.
	 */
	const handleLogin = async () => {
		setIsLoggingIn(true);
		const result = await getSingpassAuthorizationUrl();
		if (result.status == 200) {
			const cookieString = result.headers["set-cookie"][0];
			setCookieString(cookieString);
			setAuthorizationUrl(result.data.url);
			const cookie = parseCookies(cookieString);
			doLoginCheck(cookie);
		} else if (result.status == 404) {
            show({message: t("error.login")});
        } else {
            show({message: t("error.server_down")});
        }
	}

	return (
		<>
		{!isLoggingIn
		?
		<View style={styles.container}>
		    <Image style={styles.image} source={require("../assets/FarePlayLogo.png")} />
		    <StatusBar style="auto" />
			<TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
				{isLoggingIn
				?
					<View>
						<ActivityIndicator color="white"/>
					</View>
				:
					<Text style={styles.loginText}>{t("action.login")}</Text>
				}
			</TouchableOpacity>
		</View>
		:
		<WebView
			ref={webRef}
			source={{ uri: authorizationUrl }}
			injectedJavaScript={injectedCookie}
			javaScriptEnabled={true}
			originWhitelist={['http://', 'https://', 'intent:*']}
			onShouldStartLoadWithRequest={(event) => {
				if (event.url != authorizationUrl && event.url != REDIRECTION_URL) {
					if (event.url.startsWith("intent://link.id.gov.sg/")) {
						try {
							const fallbackUrl = event.url.split("browser_fallback_url=")[1].slice(0, -4);
							webRef.current.stopLoading();
							Linking.openURL(fallbackUrl);
						} catch (err) {
							webRef.current.stopLoading();
						}
						return false;
					}
					return true;
				}
				return true;
			}}
        />
        }
        </>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		marginBottom: 40,
		width: 200,
		height: 200,
	},
	loginText: {
		color: "#fff",
	},
	loginBtn: {
		width: "70%",
		borderRadius: 25,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3498FF",
	},
});

export default App;
