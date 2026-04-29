import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Banner extends Model {
  static table = 'banners';

  @field('server_id') serverId!: string;
  @field('image_url') imageUrl!: string;
  @field('title') title!: string;
  @field('subtitle') subtitle!: string;
  @field('cta_label') ctaLabel!: string;
  @field('cta_route') ctaRoute!: string;
  @field('expires_at') expiresAt!: number;
  @field('cached_at') cachedAt!: number;
}
