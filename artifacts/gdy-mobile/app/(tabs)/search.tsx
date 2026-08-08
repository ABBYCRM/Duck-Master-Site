import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { CATEGORY_COLORS } from '@/constants/colors';
import { getAllTools, filterTools, type Tool } from '@/constants/tools';
import { useAuth } from '@/contexts/AuthContext';
import { useSaveTool, useRemoveSavedTool, useGetSavedTools } from '@workspace/api-client-react';

const ALL_TOOLS = getAllTools();

function ToolItem({
  tool,
  savedIds,
  onSave,
  onUnsave,
  isAuthenticated,
}: {
  tool: Tool;
  savedIds: Set<string>;
  onSave: (t: Tool) => void;
  onUnsave: (url: string) => void;
  isAuthenticated: boolean;
}) {
  const colors = useColors();
  const accent =
    CATEGORY_COLORS[(parseInt(tool.categoryId, 10) - 1) % CATEGORY_COLORS.length];
  const isSaved = savedIds.has(tool.url);

  return (
    <View
      style={[styles.toolItem, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.toolAccent, { backgroundColor: accent }]} />
      <Pressable
        style={styles.toolContent}
        onPress={() => WebBrowser.openBrowserAsync(tool.url)}
        testID={`tool-row-${tool.url}`}
      >
        <Text style={[styles.toolName, { color: colors.foreground }]} numberOfLines={1}>
          {tool.name}
        </Text>
        <Text style={[styles.toolUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
          {tool.url.replace(/^https?:\/\//, '')}
        </Text>
        <View style={[styles.catBadge, { backgroundColor: accent + '20' }]}>
          <Text style={[styles.catBadgeText, { color: accent }]} numberOfLines={1}>
            {tool.categoryLabel}
          </Text>
        </View>
      </Pressable>
      {isAuthenticated && (
        <Pressable
          style={styles.saveBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            isSaved ? onUnsave(tool.url) : onSave(tool);
          }}
          hitSlop={8}
        >
          <Feather
            name={isSaved ? 'bookmark' : 'bookmark'}
            size={18}
            color={isSaved ? colors.primary : colors.mutedForeground}
          />
        </Pressable>
      )}
    </View>
  );
}

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  // Saved tools for save/unsave state
  const { data: savedData, refetch: refetchSaved } = useGetSavedTools({
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

  const results = useMemo(
    () => filterTools(debouncedQuery, ALL_TOOLS),
    [debouncedQuery]
  );

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(text), 300);
  }, []);

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
      refetchSaved();
    },
    [saveToolMutation, refetchSaved]
  );

  const handleUnsave = useCallback(
    async (url: string) => {
      const id = savedIdMap[url];
      if (!id) return;
      await removeToolMutation.mutateAsync({ toolId: id });
      refetchSaved();
    },
    [removeToolMutation, savedIdMap, refetchSaved]
  );

  const isEmpty = debouncedQuery.length > 0 && results.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            marginTop: topInset + 12,
            marginHorizontal: 16,
          },
        ]}
      >
        <Feather name="search" size={18} color={colors.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search 842+ tools…"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          testID="search-input"
        />
        {query.length > 0 && Platform.OS !== 'ios' && (
          <Pressable onPress={() => handleQueryChange('')} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Results */}
      {debouncedQuery.length === 0 ? (
        <View style={styles.placeholder}>
          <Feather name="search" size={40} color={colors.border} />
          <Text style={[styles.placeholderTitle, { color: colors.mutedForeground }]}>
            Search tools offline
          </Text>
          <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
            Type a tool name, URL, or category
          </Text>
        </View>
      ) : isEmpty ? (
        <View style={styles.placeholder}>
          <Feather name="frown" size={40} color={colors.border} />
          <Text style={[styles.placeholderTitle, { color: colors.mutedForeground }]}>
            No results
          </Text>
          <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
            Try a different keyword
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <ToolItem
              tool={item}
              savedIds={savedUrls}
              onSave={handleSave}
              onUnsave={handleUnsave}
              isAuthenticated={isAuthenticated}
            />
          )}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: bottomInset + 80,
            paddingHorizontal: 16,
            gap: 8,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {results.length} result{results.length !== 1 ? 's' : ''} — offline search
            </Text>
          }
          scrollEnabled={results.length > 0}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 4,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  placeholderTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  placeholderSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  toolItem: {
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
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
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
  catBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  saveBtn: {
    padding: 14,
  },
});
