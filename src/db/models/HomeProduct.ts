import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export type HomeProductListType = 'trending' | 'best_sellers';

export class HomeProduct extends Model {
  static table = 'home_products';

  @field('server_id') serverId!: string;
  @field('list_type') listType!: HomeProductListType;
  @field('name') name!: string;
  @field('brand') brand!: string;
  @field('category') category!: string;
  @field('price') price!: number;
  @field('currency') currency!: string;
  @field('rating') rating!: number;
  @field('review_count') reviewCount!: number;
  @field('image_url') imageUrl!: string;
  @field('badges_json') badgesJson!: string;
  @field('in_stock') inStock!: boolean;
  @field('is_favourited') isFavourited!: boolean;
  @field('cached_at') cachedAt!: number;
}
