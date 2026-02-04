import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';

interface SettingRowProps {
  label: string;
  value?: string;
  icon?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  icon,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  danger,
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    disabled={isSwitch}
    activeOpacity={0.7}
  >
    <View style={styles.settingLeft}>
      {icon && <Text style={styles.settingIcon}>{icon}</Text>}
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>
        {label}
      </Text>
    </View>
    {isSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: colors.surfaceElevated, true: colors.primary + '60' }}
        thumbColor={switchValue ? colors.primary : colors.textDim}
      />
    ) : value ? (
      <Text style={styles.settingValue}>{value}</Text>
    ) : (
      <Text style={styles.settingArrow}>→</Text>
    )}
  </TouchableOpacity>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>VECTOR</Text>
          <Text style={styles.subtitle}>SETTINGS</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title="ACCOUNT" />
          <View style={styles.sectionCard}>
            <View style={styles.accountInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>V</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Anonymous User</Text>
                <Text style={styles.accountType}>Free Tier</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>UPGRADE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <SectionHeader title="PREFERENCES" />
          <View style={styles.sectionCard}>
            <SettingRow
              icon="🔔"
              label="Push Notifications"
              isSwitch
              switchValue={settings.notifications}
              onSwitchChange={(value) => updateSettings({ notifications: value })}
            />
            <SettingRow
              icon="🌙"
              label="Dark Mode"
              isSwitch
              switchValue={settings.darkMode}
              onSwitchChange={(value) => updateSettings({ darkMode: value })}
            />
            <SettingRow
              icon="📊"
              label="Show P&L as Percentage"
              isSwitch
              switchValue={settings.showPnlPercent}
              onSwitchChange={(value) => updateSettings({ showPnlPercent: value })}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <SectionHeader title="DATA & SYNC" />
          <View style={styles.sectionCard}>
            <SettingRow
              icon="⏱️"
              label="Auto-Refresh Interval"
              value={`${settings.refreshInterval / 1000}s`}
            />
            <SettingRow
              icon="📥"
              label="Download Market Data"
              onPress={() => console.log('Download data')}
            />
            <SettingRow
              icon="🗑️"
              label="Clear Local Cache"
              onPress={() => console.log('Clear cache')}
              danger
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <SectionHeader title="SUPPORT" />
          <View style={styles.sectionCard}>
            <SettingRow
              icon="📖"
              label="How Prediction Markets Work"
              onPress={() => handleOpenLink('https://vector.markets/learn')}
            />
            <SettingRow
              icon="❓"
              label="Help Center"
              onPress={() => handleOpenLink('https://vector.markets/help')}
            />
            <SettingRow
              icon="💬"
              label="Contact Support"
              onPress={() => handleOpenLink('mailto:support@vector.markets')}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <SectionHeader title="LEGAL" />
          <View style={styles.sectionCard}>
            <SettingRow
              icon="📜"
              label="Terms of Service"
              onPress={() => handleOpenLink('https://vector.markets/terms')}
            />
            <SettingRow
              icon="🔒"
              label="Privacy Policy"
              onPress={() => handleOpenLink('https://vector.markets/privacy')}
            />
            <SettingRow
              icon="⚖️"
              label="Licenses"
              onPress={() => console.log('Show licenses')}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <SectionHeader title="ABOUT" />
          <View style={styles.sectionCard}>
            <SettingRow icon="📱" label="Version" value="1.0.0" />
            <SettingRow icon="🏗️" label="Build" value="2026.02.04" />
            <SettingRow icon="⚡" label="SDK" value="Expo 54" />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerLogoText}>VECTOR</Text>
            <Text style={styles.footerTagline}>PREDICTION MARKETS</Text>
          </View>
          <Text style={styles.footerCopyright}>
            © 2026 Vector Markets Inc.
          </Text>
          <Text style={styles.footerDisclaimer}>
            Trading involves risk. Past performance is not indicative of future results.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingBottom: spacing.lg,
  },
  logo: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  avatarText: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  accountDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  accountName: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  accountType: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  upgradeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  settingLabel: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.text,
  },
  settingLabelDanger: {
    color: colors.negative,
  },
  settingValue: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.textMuted,
  },
  settingArrow: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: colors.textDim,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerLogo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  footerLogoText: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
  },
  footerTagline: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  footerCopyright: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    marginBottom: spacing.sm,
  },
  footerDisclaimer: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 14,
    opacity: 0.7,
  },
});

export default SettingsScreen;
