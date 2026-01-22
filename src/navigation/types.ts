// src/navigation/types.ts
import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type MainTabParamList = {
  Messages: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};
