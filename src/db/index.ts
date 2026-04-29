import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { migrations } from './migrations';
import { User } from './models/User';
import { HomeProduct } from './models/HomeProduct';
import { SkinAnalysisCache } from './models/SkinAnalysisCache';
import { RoutineStep } from './models/RoutineStep';
import { HomeDermatologist } from './models/HomeDermatologist';
import { Banner } from './models/Banner';
import { HomeMeta } from './models/HomeMeta';

// NOTE: Requires a native development build — NOT compatible with Expo Go.
// jsi: false — the JSI native module is not compiled in the current binary.
// Enable jsi: true only after confirming WatermelonDB JSI is linked (rebuild + pod install).
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'ruvera',
  jsi: false,
  onSetUpError: (error) => {
    if (__DEV__) {
      console.error('[WatermelonDB] Setup error:', error);
    }
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    User,
    HomeProduct,
    SkinAnalysisCache,
    RoutineStep,
    HomeDermatologist,
    Banner,
    HomeMeta,
  ],
});
