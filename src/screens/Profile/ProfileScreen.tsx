import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SettingRow from '../../components/SettingRow';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.profileCard}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Alex Thompson</Text>
            <Text style={styles.role}>Senior Designer</Text>
            <Text style={styles.email}>alex@company.com</Text>
          </View>
          <View style={styles.editBtn}>
            <Text style={{ color: COLORS.primary, fontWeight: '800' }}>✎</Text>
          </View>
        </View>

        <View style={{ gap: 12, marginTop: 14 }}>
          <SettingRow title="Account Settings" />
          <SettingRow title="Notifications" />
          <SettingRow title="Privacy & Security" />
          <SettingRow title="Appearance" />
          <SettingRow title="Help & Support" />
          <SettingRow title="Logout" danger onPress={signOut} />
        </View>

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
  avatar: { width: 56, height: 56, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.18)' },
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
