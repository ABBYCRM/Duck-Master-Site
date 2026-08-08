import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  useSaveTool,
  useRemoveSavedTool,
  useGetSavedTools,
  useAiSearch,
} from '@workspace/api-client-react';

const ALL_TOOLS = getAllTools();
// Build a quick lookup map for enriching AI results with any extra local fields
const TOOL_BY_URL = new Map<string, Tool>(ALL_TOOLS.map((t) => [t.url, t]));

type DisplayTool = Tool & { relevance?: string | null; aiPowered?: boolean };

function ToolItem({
  tool,
  savedIds,
  onSave,
  onUnsave,
  isAuthenticated,
}: {
  tool: DisplayTool;
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
        <View style={styles.toolNameRow}>
          <Text style={[styles.toolName, { color: colors.foreground }]} numberOfLines={1}>
            {tool.name}
          </Text>
          {tool.aiPowered && (
            <View style={[styles.aiBadge, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="zap" size={9} color={colors.primary} />
              <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI</Text>
            </View>
          )}
        </View>
        <Text style={[styles.toolUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
          {tool.url.replace(/^https?:\/\//, '')}
        </Text>
        {tool.relevance ? (
          <Text
            style={[styles.relevanceText, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {tool.relevance}
          </Text>
        ) : null}
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
            name="bookmark"
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

  // AI search state
  const [aiResults, setAiResults] = useState<DisplayTool[] | null>(null);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  // Track the query that the current aiResults correspond to
  const lastAiQueryRef = useRef('');

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  // Saved tools for save/unsave state
  const { data: savedData, refetch: refetchSaved } = useGetSavedTools({
    query: { enabled: isAuthenticated, queryKey: [] },
  });
  const saveToolMutation = useSaveTool();
  const removeToolMutation = useRemoveSavedTool();
  const aiSearchMutation = useAiSearch();

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

  // Local (offline) filter — always computed as fallback
  const localResults = useMemo<DisplayTool[]>(
    () => filterTools(debouncedQuery, ALL_TOOLS),
    [debouncedQuery]
  );

  // Run AI search whenever debouncedQuery changes
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setAiResults(null);
      setIsAiPowered(false);
      setIsAiLoading(false);
      lastAiQueryRef.current = '';
      return;
    }

    lastAiQueryRef.current = q;
    setIsAiLoading(true);

    aiSearchMutation.mutateAsync({ data: { query: q } })
      .then((resp) => {
        // Ignore stale responses if the query changed while in-flight
        if (lastAiQueryRef.current !== q) return;

        const enriched = resp.results.reduce<DisplayTool[]>((acc, item) => {
            const local = TOOL_BY_URL.get(item.url);
            if (local) {
              acc.push({
                ...local,
                relevance: item.relevance ?? undefined,
                aiPowered: resp.aiPowered,
              });
            }
            return acc;
          }, []);

        setAiResults(enriched);
        setIsAiPowered(resp.aiPowered);
      })
      .catch(() => {
        // Network error or server error — fall back to local results silently
        if (lastAiQueryRef.current !== q) return;
        setAiResults(null);
        setIsAiPowered(false);
      })
      .finally(() => {
        if (lastAiQueryRef.current === q) setIsAiLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const results: DisplayTool[] = aiResults ?? localResults;
  const isEmpty = debouncedQuery.length > 0 && results.length === 0 && !isAiLoading;

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(text), 400);
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
        {isAiLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : query.length > 0 && Platform.OS !== 'ios' ? (
          <Pressable onPress={() => handleQueryChange('')} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      {/* Results */}
      {debouncedQuery.length === 0 ? (
        <View style={styles.placeholder}>
          <Feather name="search" size={40} color={colors.border} />
          <Text style={[styles.placeholderTitle, { color: colors.mutedForeground }]}>
            Search 842+ tools
          </Text>
          <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
            Type a tool name, URL, or category
          </Text>
        </View>
      ) : isAiLoading && results.length === 0 ? (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
            Searching…
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
            <View style={styles.resultHeader}>
              <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
              {isAiPowered ? (
                <View style={[styles.aiPoweredBadge, { backgroundColor: colors.primary + '18' }]}>
                  <Feather name="zap" size={10} color={colors.primary} />
                  <Text style={[styles.aiPoweredText, { color: colors.primary }]}>
                    AI-powered
                  </Text>
                </View>
              ) : null}
            </View>
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  aiPoweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiPoweredText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
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
  toolNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolName: {
    fontSize: 14,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    flexShrink: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  toolUrl: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  relevanceText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
    marginTop: 2,
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
