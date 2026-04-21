import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { User } from './models/User';

// NOTE: This database instance requires a native development build.
// It will NOT work in Expo Go — use `npx expo run:ios` or `npx expo run:android`.
const adapter = new SQLiteAdapter({
  schema,
  dbName: 'ruvera',
  jsi: true,
  onSetUpError: (error) => {
    // Surface setup failures visibly during development.
    // Replace with a crash-reporting call in production.
    if (__DEV__) {
      console.error('[WatermelonDB] Setup error:', error);
    }
  },
});

export const database = new Database({
  adapter,
  modelClasses: [User],
});
