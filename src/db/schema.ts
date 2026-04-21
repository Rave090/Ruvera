import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'display_name', type: 'string' },
        { name: 'role', type: 'string' },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'scan_results',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'skin_type', type: 'string' },
        { name: 'conditions', type: 'string' },
        { name: 'hydration_score', type: 'number' },
        { name: 'uniformity_score', type: 'number' },
        { name: 'texture_score', type: 'number' },
        { name: 'parameters_json', type: 'string' },
        { name: 'analysed_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'products',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'vendor_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'price', type: 'number' },
        { name: 'stock_count', type: 'number' },
        { name: 'image_urls', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'orders',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'total_amount', type: 'number' },
        { name: 'shipping_address', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'order_items',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string', isIndexed: true },
        { name: 'quantity', type: 'number' },
        { name: 'unit_price', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'consultations',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'dermatologist_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'scheduled_at', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'messages',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'consultation_id', type: 'string', isIndexed: true },
        { name: 'sender_id', type: 'string', isIndexed: true },
        { name: 'content', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'sent_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
