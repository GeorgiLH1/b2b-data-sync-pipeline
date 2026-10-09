import express, { Request, Response } from 'express';
import pg from 'pg';
import { fetchBusinessAData } from './sourceService.js';
import { validateAndTransformProducts } from './transformService.js';

const { Pool } = pg;
const app = express();
app.use(express.json());

const PORT = process.env['PORT'] || 5001;

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'b2b_sync',
  password: 'password',
  port: 5432,
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        external_id VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        raw_payload JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id VARCHAR(255) PRIMARY KEY,
        source VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        items_count INT DEFAULT 0,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id VARCHAR(255) PRIMARY KEY,
        sync_log_id VARCHAR(255) REFERENCES sync_logs(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        stack TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Базата данни е готова!');
  } catch (error) {
    console.error('❌ Грешка при базата данни:', error);
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 B2B AI Data Sync Pipeline API е онлайн!');
});

app.get('/api/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const dbTest = await pool.query('SELECT NOW()');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
    `);

    res.json({
      status: 'healthy',
      databaseConnected: true,
      tables: tableCheck.rows.map((r) => r.table_name),
      timestamp: dbTest.rows[0].now,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// НОВ ЕНДПОЙНТ: Тест на Извличането на Данни (Точка 3)
app.get('/api/sync/fetch-source', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawProducts = await fetchBusinessAData();
    res.json({
      success: true,
      message: 'Данните от Бизнес А бяха извлечени успешно!',
      count: rawProducts.length,
      sampleData: rawProducts.slice(0, 2), // Показваме първите 2 за преглед
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// НОВ ЕНДПОЙНТ: Валидация и Трансформация на данните (Точка 4)
app.get('/api/sync/transform-source', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawProducts = await fetchBusinessAData();
    const { validProducts, invalidCount, errors } = validateAndTransformProducts(rawProducts);

    res.json({
      success: true,
      message: 'Данните бяха извлечени, валидирани и трансформирани успешно!',
      stats: {
        totalReceived: rawProducts.length,
        validProductsCount: validProducts.length,
        invalidProductsCount: invalidCount,
      },
      validationErrors: errors,
      transformedSample: validProducts.slice(0, 2), // Първите 2 валидирани записа
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  await initDatabase();
});