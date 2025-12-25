require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
   KAFKA_USERNAME: process.env.KAFKA_USERNAME,
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback'
};
