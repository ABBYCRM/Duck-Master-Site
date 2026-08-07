import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { CATEGORIES, type Category } from '@/constants/tools';
import { CATEGORY_COLORS } from '@/constants/colors';

const TOTAL_TOOLS = CATEGORIES.reduce((sum, c) => sum + c.links.length, 0);

function ModuleCard({ item, index }: { item: Category; index: number }) {
  const colors = useColors();
  const accent = CATEGORY_COLORS[(parseInt(item.id, 10) - 1) % CATEGORY_COLORS.length];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      onPress={() => router.push(`/module/${item.id}`)}
      testID={`module-card-${item.id}`}
    >
      {/* Accent strip */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.cardBody}>
        <View style={[styles.badge, { backgroundColor: accent + '22' }]}>
          <Text style={[styles.badgeText, { color: accent }]}>{item.id}</Text>
        </View>
        <Text
          style={[styles.label, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {item.links.length} tools
        </Text>
      </View>
    </Pressable>
  );
}

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const headerData = useMemo(
    () => ({
      totalModules: CATEGORIES.length,
      totalTools: TOTAL_TOOLS,
    }),
    []
  );

  const ListHeader = (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Image
          source={require('@/assets/images/gdy-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
        {headerData.totalModules} modules · {headerData.totalTools} tools
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
          <ModuleCard item={item} index={index} />
        )}
        contentContainerStyle={{
          paddingTop: topInset + 8,
          paddingBottom: bottomInset + 80,
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 12,
  },
  logoRow: {
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 40,
  },
  tagline: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  row: {
    gap: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 120,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  cardBody: {
    padding: 12,
    flex: 1,
    gap: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
    flex: 1,
  },
  count: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
