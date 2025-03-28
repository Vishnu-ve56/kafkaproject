# Kafka-Postgres Sync

This project captures changes from a PostgreSQL `source_table` using Debezium and Kafka, then syncs those changes into a `destination_table` using a Node.js consumer.

## Project Overview

This project demonstrates a basic real-time Change Data Capture (CDC) pipeline using the following components:

1. **Debezium PostgreSQL Connector** monitors a PostgreSQL `source_table` using logical replication.
2. When rows are inserted or updated in the `source_table`, Debezium streams change events to a Kafka topic.
3. A **Kafka topic** (e.g. `PostgreSQL_Local.public.source_table`) receives the changes in JSON format.
4. A **Node.js consumer** (using `kafkajs`) listens to the topic and performs UPSERT operations into the `destination_table` using PostgreSQL.

This setup allows you to keep two PostgreSQL tables in sync in real-time — useful for analytics, backups, and event-driven systems.

## Setup

### 1. Prerequisites

- Kafka & Zookeeper running locally
- Kafka Connect with Debezium PostgreSQL connector
- PostgreSQL with `test_db` and tables:
  - `source_table` (with a primary key)
  - `destination_table` (same schema)

### 2. Create Tables

In your PostgreSQL `test_db`:

```sql
CREATE TABLE source_table (
  id INT PRIMARY KEY,
  name TEXT,
  age INT,
  updated_at BIGINT
);

CREATE TABLE destination_table (
  id INT PRIMARY KEY,
  name TEXT,
  age INT,
  updated_at TIMESTAMP
);
```
### 3. Start Kafka Connect

Run Kafka Connect with Debezium configured and the PostgreSQL connector registered. It should capture changes to source_table.

### 4. Start Node.js Consumer

#### Install dependencies

```bash
npm install kafkajs pg
```

#### Run the consumer

```bash 
node consumer.js
```



