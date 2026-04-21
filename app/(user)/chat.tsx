import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { ChatListItem } from '@features/chat/components/ChatListItem';
import { useChatList } from '@features/chat/hooks/useChatList';
import { lightTheme } from '@theme';
import type { Conversation } from '@features/chat/types';

const { colors, spacing } = lightTheme;

export default function ChatScreen() {
  const { conversations, isLoading, error } = useChatList();
  const router = useRouter();

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/(user)/chat-room/${conversation.id}` as never);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      <View style={styles.header}>
        <Typography variant="h3" weight="semibold">Consultations</Typography>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Typography variant="body" color="error">{error}</Typography>
        </View>
      )}

      {!isLoading && !error && conversations.length === 0 && (
        <View style={styles.center}>
          <Typography variant="body" color="textSecondary">No consultations yet.</Typography>
          <Typography variant="caption" color="textDisabled" style={styles.hint}>
            Start a chat from the Home screen.
          </Typography>
        </View>
      )}

      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatListItem conversation={item} onPress={handleConversationPress} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hint: {
    marginTop: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
});
