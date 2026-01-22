import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ContactsStackParamList } from "../types";

import ContactsScreen from "../../screens/Contact/ContactScreen";

const Stack = createNativeStackNavigator<ContactsStackParamList>();

export default function ContactsStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // ✅ 全局平滑转场动画配置
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="ContactScreen" 
        component={ContactsScreen} 
        options={{ title: "Contacts", animation: 'fade' }} 
      />
    </Stack.Navigator>
  );
}
