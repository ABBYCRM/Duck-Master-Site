import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useGetSavedTools, useGetSearchHistory } from '@workspace/api-client-react';

function StatPill({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: number | string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={18} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, isLoading, isSigningIn, login, logout } = useAuth();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const { data: savedData } = useGetSavedTools({
    query: { enabled: isAuthenticated, queryKey: [] },
  });
  const { data: historyData } = useGetSearchHistory({
    query: { enabled: isAuthenticated, queryKey: [] },
  });

  const savedCount = savedData?.saved?.length ?? 0;
  const historyCount = historyData?.history?.length ?? 0;

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Replit User';

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: topInset + 16,
        paddingBottom: bottomInset + 80,
        paddingHorizontal: 20,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Duck mascot */}
      <View style={styles.mascotRow}>
        <Image
          source={require('@/assets/images/duck-mascot.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/gdy-logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>

      {isAuthenticated && user ? (
        <>
          {/* User card */}
          <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '22' }]}>
              {user.profileImageUrl ? (
                <Image
                  source={{ uri: user.profileImageUrl }}
                  style={styles.avatarImg}
                />
              ) : (
                <Feather name="user" size={28} color={colors.primary} />
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.displayName, { color: colors.foreground }]}>
                {displayName}
              </Text>
              {user.email && (
                <Text style={[styles.email, { color: colors.mutedForeground }]}>
                  {user.email}
                </Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatPill icon="bookmark" label="saved" value={savedCount} />
            <StatPill icon="clock" label="searches" value={historyCount} />
          </View>

          {/* Sign out */}
          <Pressable
            style={({ pressed }) => [
              styles.signOutBtn,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={logout}
            testID="logout-button"
          >
            <Feather name="log-out" size={16} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign out</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.guestSection}>
          <Text style={[styles.guestTitle, { color: colors.foreground }]}>
            Your pocket tool directory
          </Text>
          <Text style={[styles.guestSub, { color: colors.mutedForeground }]}>
            Sign in with your Replit account to save tools and sync them across all your devices.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.loginBtn,
              { backgroundColor: colors.primary, opacity: pressed || isSigningIn ? 0.8 : 1 },
            ]}
            onPress={login}
            disabled={isSigningIn}
            testID="login-button"
          >
            {isSigningIn ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="log-in" size={18} color="#fff" />
                <Text style={styles.loginBtnText}>Sign in with Replit</Text>
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* App info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.infoRow}>
          <Feather name="layers" size={15} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            25 modules · 842+ tools
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="wifi-off" size={15} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Search works offline
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="shield" size={15} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            GDY Tool Directory
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mascotRow: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  mascot: {
    width: 100,
    height: 100,
  },
  brandLogo: {
    width: 120,
    height: 36,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  displayName: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  email: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  guestSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  guestSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    minWidth: 220,
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
