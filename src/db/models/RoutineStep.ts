import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export type RoutineTimeOfDay = 'morning' | 'evening';

export class RoutineStep extends Model {
  static table = 'routine_steps';

  @field('analysis_id') analysisId!: string;
  @field('time_of_day') timeOfDay!: RoutineTimeOfDay;
  @field('step_order') stepOrder!: number;
  @field('product_category') productCategory!: string;
  @field('instruction') instruction!: string;
  @field('product_name') productName!: string | null;
  @field('product_id') productId!: string | null;
  @field('generated_at') generatedAt!: number;
  @field('cached_at') cachedAt!: number;
}
