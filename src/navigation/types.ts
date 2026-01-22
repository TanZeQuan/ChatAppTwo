// src/navigation/types.ts
import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type MainTabParamList = {
  ChatStack: NavigatorScreenParams<ChatStackParamList>;
  ContactsStack: NavigatorScreenParams<ContactsStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type ChatStackParamList = {
  MessageList: undefined;
  PrivateRoom: {
    chatId: string;
    chatName: string;
    isGroup?: boolean;
  };
  PrivateSetting: {
    chatId: string;
    chatName: string;
    avatar?: string;
  };
  GroupRoom: {
    chatId: string;
    chatName: string;
    isGroup: boolean;
    members?: any[];
    memberIds?: string[];
  };
  GroupSetting: {
    chatId: string;
    chatName: string;
    members?: any[];
    memberIds?: string[];
  };
  GroupMemberList: {
    groupId: string;
  };
  AddGroupMember: {
    chatId: string;
    chatName: string;
  };
  MessagetHistory: {
    chatId: string;
    chatName: string;
  };
};

export type ContactsStackParamList = {
  ContactScreen: undefined;
  AddFriend: undefined;
  AddGroup: undefined;
  JoinGroup: undefined;
  FriendRequest: undefined;
  ScanGroup: undefined;
};

/**
 * PROFILE STACK
 */
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  SettingScreen: undefined;
  EditName: undefined;
  MeetingScreen: undefined;
  QRcode: undefined;
  JoinMeeting: undefined;
  CreateMeeting: undefined;
  EditEmail: undefined;
  Notification: undefined;
};
