import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export type UserRole = 'user' | 'vendor' | 'dermatologist';

export class User extends Model {
  static table = 'users';

  @field('server_id') serverId!: string;
  @field('email') email!: string;
  @field('display_name') displayName!: string;
  @field('role') role!: UserRole;
  @field('avatar_url') avatarUrl!: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
