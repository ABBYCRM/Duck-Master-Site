import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { CATEGORY_COLORS } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import {
  useGetSavedTools,
  useRemoveSavedTool,
  type SavedToolItem,
} from '@workspace/api-client-react';

function SavedToolRow({
  item,
  onUnsave,
}: {
  item: SavedToolItem;
  onUnsave: (id: number) => void;
}) {
  const colors = useColors();
  const accent =
    CATEGORY_COLORS[(parseInt(item.categoryId, 10) - 1) % CATEGORY_COLORS.length];

  return (
    <View
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.rowAccent, { backgroundColor: accent }]} />
      <Pressable
        style={styles.rowContent}
        onPress={() => WebBrowser.openBrowserAsync(item.toolUrl)}
      >
        <Text style={[styles.toolName, { color: colors.foreground }]} numberOfLines={1}>
          {item.toolName}
        </Text>
        <Text style={[styles.toolUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
          {item.toolUrl.replace(/^https?:\/\//, '')}
        </Text>
        <View style={[styles.catBadge, { backgroundColor: accent + '20' }]}>
          <Text style={[styles.catText, { color: accent }]}>{item.categoryLabel}</Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.unsaveBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUnsave(item.id);
        }}
        hitSlop={8}
        testID={`unsave-${item.id}`}
      >
        <Feather name="x" size={18} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

function LoginPrompt() {
  const colors = useColors();
  const { login, isSigningIn } = useAuth();

  return (
    <View style={styles.loginPrompt}>
      <Feather name="lock" size={48} color={colors.border} />
      <Text style={[styles.loginTitle, { color: colors.foreground }]}>
        Sign in to save tools
      </Text>
      <Text style={[styles.loginSub, { color: colors.mutedForeground }]}>
        Save your favourite tools and sync them across devices with your Replit account.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.loginBtn,
          { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={login}
        disabled={isSigningIn}
        testID="login-button"
      >
        {isSigningIn ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginBtnText}>Sign in with Replit</Text>
        )}
      </Pressable>
    </View>
  );
}

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetSavedTools({
    query: { enabled: isAuthenticated, queryKey: [] },
  });

  const removeToolMutation = useRemoveSavedTool();

  const saved = data?.saved ?? [];

  const handleUnsave = useCallback(
    async (id: number) => {
      await removeToolMutation.mutateAsync({ toolId: id });
      refetch();
    },
    [removeToolMutation, refetch]
  );

  const grouped = useMemo(() => {
    const map: Record<string, { label: string; items: SavedToolItem[] }> = {};
    for (const item of saved) {
      if (!map[item.categoryId]) {
        map[item.categoryId] = { label: item.categoryLabel, items: [] };
      }
      map[item.categoryId].items.push(item);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [saved]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset }]}>
        <LoginPrompt />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Feather name="alert-circle" size={36} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            Failed to load saved tools
          </Text>
          <Pressable
            style={[styles.retryBtn, { borderColor: colors.border }]}
            onPress={() => refetch()}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </Pressable>
        </View>
      ) : saved.length === 0 ? (
        <View style={styles.center}>
          <Feather name="bookmark" size={40} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No saved tools yet</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Browse or search tools and tap the bookmark icon to save them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SavedToolRow item={item} onUnsave={handleUnsave} />
          )}
          contentContainerStyle={{
            paddingTop: topInset + 12,
            paddingBottom: bottomInset + 80,
            paddingHorizontal: 16,
            gap: 8,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
              {saved.length} saved tool{saved.length !== 1 ? 's' : ''}
            </Text>
          }
          scrollEnabled={saved.length > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  loginTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  loginSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 200,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  retryBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowAccent: {
    width: 3,
    alignSelf: 'stretch',
  },
  rowContent: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  toolName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  toolUrl: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  catBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  catText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  unsaveBtn: {
    padding: 14,
  },
});
