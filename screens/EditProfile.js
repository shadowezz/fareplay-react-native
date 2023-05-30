import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, View, TextInput, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, ActivityIndicator } from 'react-native-paper';
import Ionic from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { isEqual, cloneDeep } from "lodash";
import { useTranslation } from 'react-i18next';

import { SnackbarContext } from "../components/Snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Handles editing of user details.
 */
const EditProfile = ({route}) => {
	// shows snackbar messages
	const { show } = useContext(SnackbarContext);

	// handles language translations
	const { t, i18n } = useTranslation();
	const languageKey = {"English": "en-US", "中文": "zh-CN", "தமிழ்": "ta", "melayu": "ms"};

	// navigates between screens
	const navigation = useNavigation();

	// handles form values
	const [formValue, setFormValue] = useState({});
	const [originalForm, setOriginalForm] = useState({});

	// tracks submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

	// sets fields on the edit profile page from the profile page
	useEffect(() => {
		const formValue = {
			id: route.params.id,
			name: route.params.name,
			email: route.params.email,
			contact_number: route.params.contact_number,
			language: route.params.language,
			profileImage: route.params.profileImage
		}
		setFormValue(formValue);
		setOriginalForm(cloneDeep(formValue));
		navigation.setOptions({ tabBarStyle: { display: 'none' } });
		return () => navigation.getParent()?.setOptions({
			tabBarStyle: undefined
		});
	}, [navigation]);

	/**
	 * Handles saving of user details.
	 */
	const handleUpdate = async () => {
		setIsSubmitting(true);
		if (isEqual(formValue, originalForm)) {
			show({message: t("error.no_fields_changed")});
			setIsSubmitting(false);
			return;
		}

		const languageId = languageKey[formValue.language];
		i18n.changeLanguage(languageId);
		AsyncStorage.setItem("language", languageId);
		show({message: t("success.edit_profile")});
		navigation.navigate("HomeTabs");
		setIsSubmitting(false);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
		<View
			style={{
			width: '100%',
			height: '100%',
			backgroundColor: 'white',
			}}>
			<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: 10,
			}}>
			<TouchableOpacity disabled={isSubmitting} onPress={() => navigation.goBack()}>
				<Ionic name="close-outline" style={{ fontSize: 35 }} />
			</TouchableOpacity>
			<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t("header.edit_profile")}</Text>
			<TouchableOpacity
				disabled={isSubmitting}
				onPress={handleUpdate}>
				{isSubmitting
				?
					<ActivityIndicator size="small" />
				:
					<Ionic name="checkmark" style={{ fontSize: 35, color: '#3493D9' }} />
				}
			</TouchableOpacity>
			</View>
			<View style={{ padding: 20, alignItems: 'center' }}>
			<Avatar.Image
				source={formValue.profileImage}
				size={80}
			/>
			</View>
			<View style={{ padding: 10 }}>
			<View style={{ paddingVertical: 10 }}>
				<Text
				style={{
					opacity: 0.5,
				}}>
				{t("field.name")}
				</Text>
				<TextInput
				placeholder="name"
				defaultValue={formValue.name}
				onChangeText={(name) => setFormValue({...formValue, name: name})}
				style={{
					fontSize: 16,
					borderBottomWidth: 1,
					borderColor: '#CDCDCD',
				}}
				/>
			</View>
			<View style={{ paddingVertical: 10 }}>
				<Text
				style={{
					opacity: 0.5,
				}}>
				{t("field.email")}
				</Text>
				<TextInput
				placeholder="email"
				defaultValue={formValue.email}
				onChangeText={(email) => setFormValue({...formValue, email: email})}
				style={{
					fontSize: 16,
					borderBottomWidth: 1,
					borderColor: '#CDCDCD',
				}}
				/>
			</View>
			<View style={{ paddingVertical: 10 }}>
				<Text
				style={{
					opacity: 0.5,
				}}>
				{t("field.contact_number")}
				</Text>
				<TextInput
				placeholder="Contact Number"
				defaultValue={formValue.contact_number}
				onChangeText={(contactNumber) => setFormValue({...formValue, contact_number: contactNumber})}
				style={{
					fontSize: 16,
					borderBottomWidth: 1,
					borderColor: '#CDCDCD',
				}}
				/>
			</View>
			<Text
				style={{
					opacity: 0.5,
				}}>
				{t("field.language")}
			</Text>
			<View style={styles.dropdownsRow}>
				<SelectDropdown
                    data={["English", "中文", "தமிழ்", "melayu"]}
					onSelect={(selectedItem) => {
                        setFormValue({...formValue, language: selectedItem});
                    }}
					defaultButtonText={formValue.language}
                    buttonStyle={styles.dropdownBtnStyle}
                    buttonTextStyle={styles.dropdownBtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdownDropdownStyle}
                    rowStyle={styles.dropdownRowStyle}
                    rowTextStyle={styles.dropdownRowTxtStyle}
                    renderDropdownIcon={isOpened => {
						return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}/>;
                    }}
                />
			</View>
			</View>
		</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	dropdownsRow: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 5,
    },
    dropdownBtnStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdownBtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdownDropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdownRowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdownRowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default EditProfile;