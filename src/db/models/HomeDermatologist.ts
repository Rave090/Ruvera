import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class HomeDermatologist extends Model {
  static table = 'home_dermatologists';

  @field('server_id') serverId!: string;
  @field('name') name!: string;
  @field('specialization') specialization!: string;
  @field('rating') rating!: number;
  @field('review_count') reviewCount!: number;
  @field('avatar_url') avatarUrl!: string | null;
  @field('is_online') isOnline!: boolean;
  @field('years_experience') yearsExperience!: number;
  @field('consultation_fee') consultationFee!: number;
  @field('currency') currency!: string;
  @field('cached_at') cachedAt!: number;
}
