import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // We use DIRECT_URL here because 'db push' requires a direct, unpooled connection
  datasource: {
    url: env('DIRECT_URL'), 
  },
});