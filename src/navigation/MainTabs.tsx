import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MessageListScreen from '../navigation/stacks/ChatStack';
import ContactsScreen from '../navigation/stacks/ContactStack';
import ProfileScreen from '../navigation/stacks/ProfileStack';
import { COLORS } from '../styles/colors';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 56 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 6,
                    backgroundColor: COLORS.primary,
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: COLORS.white,
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',

                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'ChatStack': // Use ChatStack as the route name
                            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                            break;
                        case 'ContactsStack':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'ProfileStack':
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
                name="ChatStack"
                component={MessageListScreen}
                options={{ title: 'Messages' }}
            />
            <Tab.Screen
                name="ContactsStack"
                component={ContactsScreen}
                options={{ title: 'Contacts' }}
            />
            <Tab.Screen
                name="ProfileStack"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
