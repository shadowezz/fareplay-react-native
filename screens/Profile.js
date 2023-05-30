import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Avatar, Title, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import Constants from 'expo-constants';
import { useTranslation } from "react-i18next";

import { postLogout, getUserInfo } from "../services/ApiService";
import { useAuth } from "../services/AuthService";
import { SnackbarContext } from "../components/Snackbar";

const API_BASE_URL = Constants.expoConfig.extra.PRODUCTION_API_URL;

const Profile = () => {
	// context for authentication
    const { handleSetCookies } = useAuth();

	// shows snackbar messages
    const { show } = useContext(SnackbarContext);

	// handles language translations
	const { t } = useTranslation();
	const languageKey = {"en-US": "English", "zh-CN": "中文", "ta": "தமிழ்", "ms": "melayu"};

	// handles floating button menu
	const [openMenu, setOpenMenu] = useState(false);

	// navigates between screens
	const navigation = useNavigation();

	// handles form values
	const [formValue, setFormValue] = useState({});

	// runs code when screen is focused
	const isFocused = useIsFocused();

	// gets profile on initial load
	useEffect(() => {
        fetchProfile();
		fetchLanguage();
	}, []);
	
	// checks language on page visit
	useEffect(() => {
		if (isFocused) { 
            fetchLanguage();
        }
	}, [isFocused]);

	/**
	 * Fetches user profile from singpass.
	 */
	const fetchProfile = async () => {
		let cookie = await AsyncStorage.getItem(API_BASE_URL);
        if (cookie == null || cookie == undefined) {
            cookie = {};
        }
        let language = await AsyncStorage.getItem("language");
        if (language == null || language == undefined) {
            language = "en-US";
        }
		const result = await getUserInfo(JSON.parse(cookie));
		if (result.status == 200) {
			setFormValue({
				name: result.data.data["myinfo.name"],
				email: t("field.unavailable"),
				contact_number: t("field.unavailable"),
				profileImage: require('../assets/avatar.png'),
				language: languageKey[language]
			});
		}
	}

	/**
	 * Fetches user language choice from storage.
	 */
	const fetchLanguage = async () => {
		let language = await AsyncStorage.getItem("language");
		if (language == null || language == undefined) {
			language = "en-US";
		}
		setFormValue({...formValue, language: languageKey[language]});
	}

	/**
	 * Handles logging out of user.
	 */
	const handleLogout = async () => {
		let cookie = await AsyncStorage.getItem(API_BASE_URL);
		if (cookie == null || cookie == undefined) {
			cookie = {};
		}
		await postLogout(JSON.parse(cookie));
		show({message: t("success.logout")});
		handleSetCookies(null);
	}

	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.userInfoSection}>
				<View style={{ marginTop: 30, alignItems: "center" }}>
					<Avatar.Image
						source={formValue.profileImage}
						size={120}
					/>
					<View>
						<Title style={[styles.title, {
							marginTop: 20,
							marginBottom: 5,
						}]}>{formValue.name}</Title>
					</View>
				</View>
			</View>

			<View style={styles.userInfoSection}>
				<View style={styles.row}>
					<Icon name="email" color="#777777" size={24} />
					<Text style={{ fontSize: 16, color: "#777777", marginLeft: 20, marginBottom: 5 }}>{formValue.email}</Text>
				</View>
				<View style={styles.row}>
					<Icon name="phone" color="#777777" size={24} />
					<Text style={{ fontSize: 16, color: "#777777", marginLeft: 20, marginBottom: 5 }}>{formValue.contact_number}</Text>
				</View>
				<View style={styles.row}>
					<Icon name="comment-account" color="#777777" size={24} />
					<Text style={{ fontSize: 16, color: "#777777", marginLeft: 20, marginBottom: 5 }}>{formValue.language}</Text>
				</View>
			</View>
			<FAB.Group
                color="white"
                fabStyle={styles.fab}
                open={openMenu}
                icon={openMenu ? 'minus' : 'plus'}
                actions={[
                    {
                    style: {backgroundColor: "#3498FF"},
                    color: "white",
                    icon: 'account-edit',
                    label: t("action.edit_profile"),
                    onPress: () => {
						show({message: t("info.opening_page_to_edit_profile")});
						navigation.navigate(t("header.edit_profile"), formValue)
                    }},
                    {
                    style: {backgroundColor: "#3498FF"},
                    color: "white",
                    icon: 'logout',
                    label: t("action.logout"),
                    onPress: () => handleLogout()
                    },
                ]}
                onStateChange={() => setOpenMenu(e => !e)}
            />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	userInfoSection: {
		paddingHorizontal: 30,
		marginBottom: 25,
	},
	fab: {
        backgroundColor: "#3498FF"
    },
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	row: {
		flexDirection: 'row',
		marginBottom: 10,
	}
});

export default Profile;