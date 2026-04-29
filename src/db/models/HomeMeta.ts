import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class HomeMeta extends Model {
  static table = 'home_meta';

  @field('meta_key') metaKey!: string;
  @field('value_num') valueNum!: number | null;
  @field('value_str') valueStr!: string | null;
  @field('cached_at') cachedAt!: number;
}
