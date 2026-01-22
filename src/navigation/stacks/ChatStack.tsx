import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ChatStackParamList } from "../types";

import MessageListScreen from "../../screens/Chat/MessageList";
import PrivateRoom from "../../screens/Chat/PrivateRoom";
import GroupRoomScreen from "../../screens/Chat/GroupRoom";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // ✅ 全局平滑转场动画配置
        animation: 'slide_from_right', // iOS 风格的滑动动画
        animationDuration: 250, // 动画时长
        gestureEnabled: true, // 允许手势返回
        gestureDirection: 'horizontal', // 水平手势
      }}
    >
      <Stack.Screen
        name="MessageList"
        component={MessageListScreen}
        options={{ 
          title: "Chats",
          // 聊天列表不需要进入动画（它是首页）
          animation: 'fade',
        }}
      />

      <Stack.Screen
        name="PrivateRoom"
        component={PrivateRoom}
        options={{ 
          title: "Chat Room",
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="GroupRoom"
        component={GroupRoomScreen}
        options={{ 
          title: "Group Room",
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}