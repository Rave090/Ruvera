import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class SkinAnalysisCache extends Model {
  static table = 'skin_analysis_cache';

  @field('server_id') serverId!: string;
  @field('hydration_score') hydrationScore!: number;
  @field('hydration_label') hydrationLabel!: string;
  @field('overall_health_score') overallHealthScore!: number;
  @field('skin_type') skinType!: string;
  @field('concerns_json') concernsJson!: string;
  @field('has_active_analysis') hasActiveAnalysis!: boolean;
  @field('analysed_at') analysedAt!: number;
  @field('cached_at') cachedAt!: number;
}
