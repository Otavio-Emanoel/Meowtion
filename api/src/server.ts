import Fastify from 'fastify';
import { Pool } from 'pg';

const fastify = Fastify({ logger: true });

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'app_database',
  password: 'adminpassword',
  port: 5432,
});

fastify.get('/api/status', async (request, reply) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT NOW()');
    return { 
      status: 'Online', 
      db_time: rows[0].now,
      colors: { primary: '#F7FF00', background: '#4A5568' }
    };
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Database connection failed' });
  } finally {
    client.release();
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000 🚀');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();