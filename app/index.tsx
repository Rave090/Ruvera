import { Redirect } from 'expo-router';

// The auth guard in _layout.tsx handles all routing decisions.
// This redirect is a safety fallback for the root path.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
