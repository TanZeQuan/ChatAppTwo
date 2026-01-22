import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ProfileStackParamList } from "../types";

import ProfileScreen from "../../screens/Profile/ProfileScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
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
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: "My Profile", animation: 'fade' }} 
      />
    </Stack.Navigator>
  );
}
