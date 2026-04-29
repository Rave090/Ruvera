import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'home_products',
          columns: [
            { name: 'server_id', type: 'string', isIndexed: true },
            { name: 'list_type', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'brand', type: 'string' },
            { name: 'category', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'currency', type: 'string' },
            { name: 'rating', type: 'number' },
            { name: 'review_count', type: 'number' },
            { name: 'image_url', type: 'string' },
            { name: 'badges_json', type: 'string' },
            { name: 'in_stock', type: 'boolean' },
            { name: 'is_favourited', type: 'boolean' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'skin_analysis_cache',
          columns: [
            { name: 'server_id', type: 'string' },
            { name: 'hydration_score', type: 'number' },
            { name: 'hydration_label', type: 'string' },
            { name: 'overall_health_score', type: 'number' },
            { name: 'skin_type', type: 'string' },
            { name: 'concerns_json', type: 'string' },
            { name: 'has_active_analysis', type: 'boolean' },
            { name: 'analysed_at', type: 'number' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'routine_steps',
          columns: [
            { name: 'analysis_id', type: 'string', isIndexed: true },
            { name: 'time_of_day', type: 'string', isIndexed: true },
            { name: 'step_order', type: 'number' },
            { name: 'product_category', type: 'string' },
            { name: 'instruction', type: 'string' },
            { name: 'product_name', type: 'string', isOptional: true },
            { name: 'product_id', type: 'string', isOptional: true },
            { name: 'generated_at', type: 'number' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'home_dermatologists',
          columns: [
            { name: 'server_id', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'specialization', type: 'string' },
            { name: 'rating', type: 'number' },
            { name: 'review_count', type: 'number' },
            { name: 'avatar_url', type: 'string', isOptional: true },
            { name: 'is_online', type: 'boolean' },
            { name: 'years_experience', type: 'number' },
            { name: 'consultation_fee', type: 'number' },
            { name: 'currency', type: 'string' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'banners',
          columns: [
            { name: 'server_id', type: 'string', isIndexed: true },
            { name: 'image_url', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'subtitle', type: 'string' },
            { name: 'cta_label', type: 'string' },
            { name: 'cta_route', type: 'string' },
            { name: 'expires_at', type: 'number' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'home_meta',
          columns: [
            { name: 'meta_key', type: 'string', isIndexed: true },
            { name: 'value_num', type: 'number', isOptional: true },
            { name: 'value_str', type: 'string', isOptional: true },
            { name: 'cached_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
});
