import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

/**
 * Handles showing of app loading.
 */
const LoadingPlaceholder = () => {
	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator size="large"/>
		</View>
	);
}

export default LoadingPlaceholder;