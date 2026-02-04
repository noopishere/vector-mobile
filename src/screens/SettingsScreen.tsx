import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';

interface SettingRowProps {
  label: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    disabled={isSwitch}
    activeOpacity={0.7}
  >
    <Text style={styles.settingLabel}>{label}</Text>
    {isSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: colors.surfaceElevated, true: colors.primary + '60' }}
        thumbColor={switchValue ? colors.primary : colors.textDim}
      />
    ) : (
      <Text style={styles.settingValue}>{value}</Text>
    )}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <SettingRow
            label="Push Notifications"
            isSwitch
            switchValue={settings.notifications}
            onSwitchChange={(value) => updateSettings({ notifications: value })}
          />
          <SettingRow
            label="Dark Mode"
            isSwitch
            switchValue={settings.darkMode}
            onSwitchChange={(value) => updateSettings({ darkMode: value })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>
          <SettingRow
            label="Refresh Interval"
            value={`${settings.refreshInterval / 1000}s`}
          />
          <SettingRow label="Clear Cache" onPress={() => console.log('Clear cache')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="Build" value="2026.02.04" />
          <SettingRow
            label="Terms of Service"
            onPress={() => console.log('Open ToS')}
          />
          <SettingRow
            label="Privacy Policy"
            onPress={() => console.log('Open Privacy')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>VECTOR MOBILE</Text>
          <Text style={styles.footerSubtext}>Prediction Markets & News</Text>
          <Text style={styles.footerCopyright}>© 2026 Vector</Text>
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
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: colors.text,
  },
  settingValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: colors.textMuted,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
  },
  footerSubtext: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textDim,
    marginTop: spacing.xs,
  },
  footerCopyright: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    marginTop: spacing.md,
  },
});

export default SettingsScreen;
