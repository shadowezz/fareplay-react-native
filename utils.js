/**
 * Parses cookie string received to an object (it's a workaround for react 
 * native which doesn't have a good cookie library/we could not get it to work).
 * 
 * @param {string} inputString cookie string received to parse
 */
export const parseCookies = (inputString) => {
	let keyValuePairs = {};
	let substrings = inputString.split('; ');

	for (let i = 0; i < substrings.length; i++) {
		let splitSubstring = substrings[i].split('=');
		let key = splitSubstring[0];
		let value = splitSubstring[1];

		keyValuePairs[key] = value;
	}

	return keyValuePairs;
}