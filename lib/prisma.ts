import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// 1. Tell Neon to use WebSockets to bypass your ISP block
neonConfig.webSocketConstructor = ws;

// 2. THE FIX: Changed to 'postgres://' and removed '&channel_binding=require'
const connectionString = "postgres://neondb_owner:npg_GX1AgPfI8Olc@ep-falling-band-a12sa5nq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

// 3. Create the pool
const pool = new Pool({ connectionString });

// 4. Wrap the pool in Prisma's Neon adapter
const adapter = new PrismaNeon(pool as any);

// 5. Export directly (We removed the 'globalThis' cache to force a totally fresh connection)
export const prisma = new PrismaClient({ adapter });