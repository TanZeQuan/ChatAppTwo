import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MessagesScreen from '../screens/MessageScreen';
import ContactsScreen from '../screens/ContactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../styles/colors';

export type MainTabParamList = {
    Messages: undefined;
    Contacts: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 56 + insets.bottom,   // ✅ 自动适配
                    paddingBottom: insets.bottom, // ✅ iPhone 不会被挡
                    paddingTop: 6,
                    backgroundColor: COLORS.primary,
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: COLORS.white,
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',

                // ✅ Ionicons 在这里
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Messages':
                            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                            break;
                        case 'Contacts':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    return <Ionicons name={iconName} size={size ?? 24} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{ title: 'Messages' }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{ title: 'Contacts' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
