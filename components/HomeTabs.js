import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

import Home from "../screens/Home";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

/**
 * Handles bottom tab navigation.
 */
const HomeTabs = () => {
    // handles language translations
	const { t } = useTranslation();

	return (
        <Tab.Navigator>
            <Tab.Screen name={t("header.home")} component={Home}
            options={{
                tabBarLabel: t("header.home"),
                tabBarOptions: {
                    activeTintColor: "#3498FF",
                },
                tabBarIcon: (tabInfo) => {
                    return (
                        <Ionicons
                            name="home"
                            size={24}
                            color={tabInfo.focused ? "#3498FF" : "#8e8e93"}
                        />
                    );
                },
            }}/>
            <Tab.Screen name={t("header.profile")} component={Profile}
            options={{
                tabBarLabel: t("header.profile"),
                tabBarOptions: {
                    activeTintColor: "#3498FF",
                },
                tabBarIcon: (tabInfo) => {
                    return (
                        <Ionicons
                            name="md-person-circle-outline"
                            size={24}
                            color={tabInfo.focused ? "#3498FF" : "#8e8e93"}
                        />
                    );
                },
            }}/>
        </Tab.Navigator>
	);
}

export default HomeTabs;