import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext'; // 确保路径正确

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth(); // 获取登出方法
  
  // --- 弹窗状态管理 ---
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const closeModal = () => setActiveModal(null);

  // --- 模拟状态 ---
  const [switches, setSwitches] = useState({ msg: true, group: true, voice: false });
  const toggleSwitch = (key: keyof typeof switches) => setSwitches(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>我</Text>
      </View>

      <View style={styles.body}>
        {/* 用户资料卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Ionicons name="person" size={40} color="#9CA3AF" /></View>
            <TouchableOpacity style={styles.cameraIcon}><Ionicons name="camera" size={12} color="#fff" /></TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nameText}>Alex Thompson</Text>
            <Text style={styles.idText}>ID: USER123456789</Text>
            <View style={styles.onlineBadge}><Text style={styles.onlineText}>Online</Text></View>
          </View>
          <TouchableOpacity style={styles.qrCodeBtn} onPress={() => setActiveModal('qr')}>
            <Ionicons name="qr-code-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* 设置项列表 */}
        <View style={styles.settingsGroup}>
          <SettingItem icon="settings-outline" label="编制个人质料" iconBg="#EBF2FF" iconColor="#2563EB" onPress={() => setActiveModal('editProfile')} />
          <SettingItem icon="heart-outline" label="我的收藏" iconBg="#FFF1F2" iconColor="#F43F5E" onPress={() => setActiveModal('favorites')} />
          <SettingItem icon="key-outline" label="更换密码" iconBg="#FFF7ED" iconColor="#F97316" onPress={() => setActiveModal('password')} />
          <SettingItem icon="notifications-outline" label="通知设置" iconBg="#F0FDF4" iconColor="#22C55E" onPress={() => setActiveModal('notify')} />
          <SettingItem icon="lock-closed-outline" label="隐私和安全" iconBg="#FEF2F2" iconColor="#EF4444" onPress={() => setActiveModal('privacy')} />
          <SettingItem icon="log-out-outline" label="登出" iconBg="#FFF1F2" iconColor="#EF4444" onPress={() => setActiveModal('logout')} />
        </View>
      </View>

      {/* --- 全局 Modal 渲染 --- */}
      {renderModal(activeModal, closeModal, { switches, toggleSwitch, signOut })}
    </View>
  );
}

// --- 弹窗内容渲染函数 ---
function renderModal(type: string | null, close: () => void, props: any) {
  if (!type) return null;

  return (
    <Modal visible={!!type} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.modalOverlay} onPress={close}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* 1. 头部 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getModalTitle(type)}</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* 2. 主体 */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
            {type === 'editProfile' && (
              <View style={{ alignItems: 'center' }}>
                <View style={[styles.avatar, { width: 80, height: 80, borderRadius: 40 }]}><Ionicons name="person" size={50} color="#9CA3AF" /></View>
                <Text style={styles.changeAvatarText}>更改头像</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>名字</Text>
                  <TextInput style={styles.input} defaultValue="Alex Thompson" />
                  <Text style={styles.inputLabel}>用户ID</Text>
                  <TextInput style={[styles.input, { backgroundColor: '#F3F4F6' }]} value="USER123466" editable={false} />
                  <Text style={styles.inputNote}>您的唯一用户ID无法更改</Text>
                </View>
              </View>
            )}

            {type === 'privacy' && (
              <View style={{ gap: 12 }}>
                <SwitchRow label="显示最后在线时间" sub="让其他人看到您最后活跃时间" val={true} onToggle={() => { }} />
                <SwitchRow label="显示在线状态" sub="让其他人看到您何时在线" val={false} onToggle={() => { }} />
                <SwitchRow label="已读回执" sub="让对方知道您已阅读他们的消息。" val={false} onToggle={() => { }} />
              </View>
            )}

            {type === 'password' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>现密码</Text>
                <TextInput style={styles.input} placeholder="输入现密码" secureTextEntry />
                <Text style={styles.inputLabel}>新密码</Text>
                <TextInput style={styles.input} placeholder="输入新密码" secureTextEntry />
                <Text style={styles.inputNote}>必须至少六位数字密码</Text>
                <Text style={styles.inputLabel}>确认新密码</Text>
                <TextInput style={styles.input} placeholder="确认新密码" secureTextEntry />
              </View>
            )}

            {type === 'notify' && (
              <View style={{ gap: 12 }}>
                <SwitchRow label="消息通知" sub="接收新消息通知" val={props.switches.msg} onToggle={() => props.toggleSwitch('msg')} />
                <SwitchRow label="群组通知" sub="接收群组消息通知" val={props.switches.group} onToggle={() => props.toggleSwitch('group')} />
                <SwitchRow label="声音" sub="播放通知声音" val={props.switches.voice} onToggle={() => props.toggleSwitch('voice')} />
              </View>
            )}

            {type === 'qr' && (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={180} color="#000" />
                </View>
                <Text style={styles.idText}>扫描二维码添加我为好友</Text>
              </View>
            )}

            {type === 'logout' && (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={styles.logoutConfirmText}>确定要登出？</Text>
                <Text style={styles.logoutSubText}>登出之后下一次需要重新登入</Text>
              </View>
            )}
          </ScrollView>

          {/* 3. 底部按钮 */}
          <View style={styles.modalFooter}>
            {type === 'logout' ? (
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.btnCancel} onPress={close}><Text style={styles.btnCancelText}>取消</Text></TouchableOpacity>
                <TouchableOpacity 
                  style={styles.btnDanger} 
                  onPress={() => {
                    close();
                    props.signOut(); // ✅ 执行登出并自动切回 Login
                  }}
                >
                  <Text style={styles.btnText}>确定</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.btnPrimary} onPress={close}>
                <Text style={styles.btnText}>{type === 'password' ? '更改' : '确定'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

// --- 组件抽离 ---
function SettingItem({ icon, label, iconBg, iconColor, onPress }: any) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}><Ionicons name={icon} size={20} color={iconColor} /></View>
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function SwitchRow({ label, sub, val, onToggle }: any) {
  return (
    <View style={styles.switchCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Text style={styles.switchSub}>{sub}</Text>
      </View>
      <Switch value={val} onValueChange={onToggle} trackColor={{ true: '#22C55E' }} />
    </View>
  );
}

function getModalTitle(type: string) {
  const titles: any = { editProfile: '编制个人资料', notify: '通知设置', logout: '确定要登出？', privacy: '隐私与安全', password: '更换密码', qr: '我的QR码', favorites: '我的收藏' };
  return titles[type] || '详情';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E1F1FF' },
  header: { backgroundColor: '#2563EB', height: 100, paddingHorizontal: 16, justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25, elevation: 4 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#2563EB', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  userInfo: { flex: 1, marginLeft: 16 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  idText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  onlineBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4 },
  onlineText: { color: '#16A34A', fontSize: 10, fontWeight: 'bold' },
  qrCodeBtn: { padding: 4 },
  settingsGroup: { gap: 12 },
  itemRow: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { flex: 1, marginLeft: 15, fontSize: 15, color: '#1F2937', fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  modalBody: { marginBottom: 20 },
  modalFooter: { paddingTop: 15, borderTopWidth: 1, borderTopColor: '#E5E7EB' },

  inputGroup: { width: '100%', marginTop: 10 },
  inputLabel: { fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 5, borderWidth: 1, borderColor: '#E5E7EB' },
  inputNote: { fontSize: 11, color: '#9CA3AF', marginBottom: 15 },
  
  switchCard: { backgroundColor: '#fff', borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, borderWidth: 1, borderColor: '#F3F4F6' },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
  switchSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  qrPlaceholder: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  
  btnPrimary: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rowButtons: { flexDirection: 'row', gap: 12 },
  btnCancel: { flex: 1, backgroundColor: '#9CA3AF', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnCancelText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnDanger: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },

  changeAvatarText: { color: '#6B7280', fontSize: 13, marginTop: 10, marginBottom: 10 },
  logoutConfirmText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  logoutSubText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
});