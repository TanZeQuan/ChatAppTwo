import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SettingRow from '../../components/SettingRow';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.body}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Alex Thompson</Text>
            <Text style={styles.role}>Senior Designer</Text>
            <Text style={styles.email}>alex@company.com</Text>
          </View>

          {/* Edit Button */}
          <View style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          </View>
        </View>

        {/* Settings */}
        <View style={{ gap: 12, marginTop: 14 }}>
          <SettingRow
            title="Account Settings"
            icon="person-outline"
          />
          <SettingRow
            title="Notifications"
            icon="notifications-outline"
          />
          <SettingRow
            title="Privacy & Security"
            icon="lock-closed-outline"
          />
          <SettingRow
            title="Appearance"
            icon="color-palette-outline"
          />
          <SettingRow
            title="Help & Support"
            icon="help-circle-outline"
          />
          <SettingRow
            title="Logout"
            icon="log-out-outline"
            danger
            onPress={signOut}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Company Chat App</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 84,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  body: { flex: 1, padding: SPACING.screenPadding },

  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  role: { fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 2 },
  email: { fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 2 },

  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(30,99,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: { alignItems: 'center', marginTop: 22, opacity: 0.7 },
  footerText: { fontSize: 12, color: 'rgba(0,0,0,0.45)' },
});
