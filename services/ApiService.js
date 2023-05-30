import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig.extra.PRODUCTION_API_URL

/**
 * Retrieves singpass authorization url.
 */
export const getSingpassAuthorizationUrl = async () => {
	try {
		return await axios.get(API_BASE_URL + "/auth/login");
	} catch (err) {
		return {status: 500, message: "Server Down"};
	}
}

/**
 * Retrieves user info from singpass.
 * 
 * @param {Object} cookie cookie for authentication check
 */
export const getUserInfo = async (cookie) => {
	try {
		const headers = {headers: {"Cookie": cookie}}
		return await axios.get(API_BASE_URL + "/userinfo", headers);
	} catch (err) {
    	return {status: 500, message: "Server Down"};
    }
}

/**
 * Logs the user out of the app.
 * 
 * @param {Object} cookie cookie for authentication check
 */
export const postLogout = async (cookie) => {
	try {
		const headers = {headers: {"Cookie": cookie}}
		return await axios.get(API_BASE_URL + "/auth/logout", headers);
	} catch (err) {
		return {status: 500, message: "Server Down"};
	}
}

/**
 * Checks if a user is logged in successfully via singpass.
 * 
 * @param {Object} cookie cookie for authentication check
 */
export const checkIsLoggedIn = async (cookie) => {
	try {
		const headers = {headers: {"Cookie": cookie}}
		return await axios.get(API_BASE_URL + "/auth/is_logged_in", headers);
	} catch (err) {
		return {status: 500, message: "Server Down"};
	}
}

/**
 * Retrieves user info from singpass.
 * 
 * @param {Object} cookie cookie for authentication check 
 * @param {Object} startLocation start location latitude and longitude
 * @param {Object} endLocation end location latitude and longitude
 */
export const getRidePrices = async (cookie, startLocation, endLocation) => {
	try {
		const params = {
			startLat: startLocation.coordinate.latitude,
			startLong: startLocation.coordinate.longitude,
			endLat: endLocation.coordinate.latitude,
			endLong: endLocation.coordinate.longitude
		}
        const headers = {headers: {"Cookie": cookie}, params: params}
        return await axios.get(API_BASE_URL + "/prices", headers);
    } catch (err) {
        return {status: 500, message: "Server Down"};
    }
}