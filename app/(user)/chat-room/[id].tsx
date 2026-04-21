import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { MessageBubble } from '@features/chat/components/MessageBubble';
import { useConversation } from '@features/chat/hooks/useConversation';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, isLoading, isSending, send } = useConversation(id);
  const userProfile = useAuthStore(selectUserProfile);
  const router = useRouter();

  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await send(text);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Typography variant="body" color="primary">← Back</Typography>
        </Pressable>
        <Typography variant="bodySmall" weight="semibold">Consultation</Typography>
        <View style={styles.headerRight} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwn={item.senderId === userProfile?.id}
              />
            )}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: false })
            }
          />

          <View style={styles.inputBar}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message…"
              placeholderTextColor={colors.textDisabled}
              style={styles.input}
              multiline
              returnKeyType="default"
              accessibilityLabel="Message input"
            />
            <Pressable
              onPress={handleSend}
              disabled={isSending || !input.trim()}
              style={[
                styles.sendBtn,
                (!input.trim() || isSending) && styles.sendBtnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              {isSending ? (
                <ActivityIndicator color={colors.surface} size="small" />
              ) : (
                <Typography variant="body" color="surface" weight="semibold">↑</Typography>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRight: {
    width: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
});
