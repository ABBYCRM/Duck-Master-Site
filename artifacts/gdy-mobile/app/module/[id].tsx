import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { CATEGORY_COLORS } from '@/constants/colors';
import { CATEGORIES, getToolName, type Tool } from '@/constants/tools';
import { useAuth } from '@/contexts/AuthContext';
import {
  useGetSavedTools,
  useSaveTool,
  useRemoveSavedTool,
} from '@workspace/api-client-react';

function ToolRow({
  tool,
  isSaved,
  onSave,
  onUnsave,
  isAuthenticated,
  accent,
}: {
  tool: Tool;
  isSaved: boolean;
  onSave: (t: Tool) => void;
  onUnsave: (url: string) => void;
  isAuthenticated: boolean;
  accent: string;
}) {
  const colors = useColors();

  return (
    <View
      style={[styles.toolRow, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.toolAccent, { backgroundColor: accent }]} />
      <Pressable
        style={styles.toolContent}
        onPress={() => Linking.openURL(tool.url)}
      >
        <Text style={[styles.toolName, { color: colors.foreground }]} numberOfLines={1}>
          {tool.name}
        </Text>
        <Text style={[styles.toolUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
          {tool.url.replace(/^https?:\/\//, '')}
        </Text>
      </Pressable>
      {isAuthenticated && (
        <Pressable
          style={styles.saveBtn}
          hitSlop={10}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            isSaved ? onUnsave(tool.url) : onSave(tool);
          }}
        >
          <Feather
            name="bookmark"
            size={18}
            color={isSaved ? colors.primary : colors.mutedForeground}
          />
        </Pressable>
      )}
    </View>
  );
}

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === id) ?? null,
    [id]
  );

  const tools: Tool[] = useMemo(
    () =>
      (category?.links ?? []).map((url) => ({
        url,
        name: getToolName(url),
        categoryId: category?.id ?? '',
        categoryLabel: category?.label ?? '',
      })),
    [category]
  );

  const accent =
    CATEGORY_COLORS[(parseInt(id ?? '1', 10) - 1) % CATEGORY_COLORS.length];

  const { data: savedData, refetch } = useGetSavedTools({
    query: { enabled: isAuthenticated, queryKey: [] },
  });

  const saveToolMutation = useSaveTool();
  const removeToolMutation = useRemoveSavedTool();

  const savedUrls = useMemo(
    () => new Set((savedData?.saved ?? []).map((s) => s.toolUrl)),
    [savedData]
  );

  const savedIdMap = useMemo(() => {
    const m: Record<string, number> = {};
    (savedData?.saved ?? []).forEach((s) => {
      m[s.toolUrl] = s.id;
    });
    return m;
  }, [savedData]);

  const handleSave = useCallback(
    async (tool: Tool) => {
      await saveToolMutation.mutateAsync({
        data: {
          toolUrl: tool.url,
          toolName: tool.name,
          categoryId: tool.categoryId,
          categoryLabel: tool.categoryLabel,
        },
      });
      refetch();
    },
    [saveToolMutation, refetch]
  );

  const handleUnsave = useCallback(
    async (url: string) => {
      const id = savedIdMap[url];
      if (!id) return;
      await removeToolMutation.mutateAsync({ toolId: id });
      refetch();
    },
    [removeToolMutation, savedIdMap, refetch]
  );

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            Module not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tools}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <ToolRow
            tool={item}
            isSaved={savedUrls.has(item.url)}
            onSave={handleSave}
            onUnsave={handleUnsave}
            isAuthenticated={isAuthenticated}
            accent={accent}
          />
        )}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: bottomInset + 40,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListHeaderComponent={
          <View style={[styles.moduleHeader, { borderBottomColor: colors.border }]}>
            <View style={[styles.moduleIdBadge, { backgroundColor: accent + '22' }]}>
              <Text style={[styles.moduleId, { color: accent }]}>{category.id}</Text>
            </View>
            <Text style={[styles.moduleTitle, { color: colors.foreground }]}>
              {category.label}
            </Text>
            <Text style={[styles.moduleCount, { color: colors.mutedForeground }]}>
              {tools.length} tools
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={tools.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  moduleHeader: {
    paddingBottom: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    gap: 6,
  },
  moduleIdBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  moduleId: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  moduleTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  moduleCount: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toolAccent: {
    width: 3,
    alignSelf: 'stretch',
  },
  toolContent: {
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
  saveBtn: {
    padding: 14,
  },
});
