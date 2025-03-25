const { Kafka } = require('kafkajs');
const { Client } = require('pg');

// Kafka setup
const kafka = new Kafka({
  clientId: 'pg-sync-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'pg-sync-group' });

// Postgres setup
const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'test_db',
  password: 'postgres',
  port: 5432,
});

async function run() {
  await pgClient.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'PostgreSQL_Local.public.source_table', fromBeginning: true });

  console.log("Listening to Kafka topic...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log('Received:', data);

      const { id, name, age } = data;

        // Convert microseconds to milliseconds
        const updated_at_millis = Math.floor(data.updated_at / 1000);
        const updatedAt = new Date(updated_at_millis);

        await pgClient.query(
        `INSERT INTO destination_table (id, name, age, updated_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            age = EXCLUDED.age,
            updated_at = EXCLUDED.updated_at`,
        [id, name, age, updatedAt]
        );

    },
  });
}

run().catch(console.error);
