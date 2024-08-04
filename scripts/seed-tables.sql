-- Load uuid extension
create extension if not exists "uuid-ossp";

-- Seed users
INSERT INTO users (name, email, password)
VALUES
  ('lobovskiy', 'lobovskiy@mail.com', 'TEST_PASSWORD'),
  ('reviewer_1', 'reviewer_1@mail.com', 'TEST_PASSWORD'),
  ('reviewer_2', 'reviewer_2@mail.com', 'TEST_PASSWORD'),
  ('reviewer_3', 'reviewer_3@mail.com', 'TEST_PASSWORD'),
  ('reviewer_4', 'reviewer_4@mail.com', 'TEST_PASSWORD');

-- Seed carts
INSERT INTO carts (user_id)
SELECT
  users.id
FROM users;

-- Create temporary products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

-- Seed product ids from DynamoDB
INSERT INTO products (id, price)
VALUES
  ('c947b810-c1c0-46fb-9ec7-b6a95be3a537', 23.3),
  ('d784550b-8a9b-4ef0-88c1-78f9d9b200de', 77.8),
  ('70be1651-270c-48a3-a9dc-b26ffc49f933', 20.2),
  ('8044a946-1b93-4b97-a85b-d3d310cc4804', 27.1),
  ('972506d8-ff27-4050-b5fb-e1a36202a516', 45.5),
  ('f929fc6e-59f4-4aa8-b941-0b80d0e8c6fb', 63.2),
  ('1a5e50a7-be4a-4133-90f7-3c6ee5358e48', 21.8),
  ('9c35c7a5-6492-49f7-8a8f-e6d7a817870e', 16.6),
  ('dcbac7e7-e96b-4a8f-962c-2f67455a1e04', 15.2),
  ('a1990850-71af-4462-ba25-ea494895b2f9', 40.1),
  ('9a2bbba9-d93b-45c6-b101-bb6a0252aef9', 24.6),
  ('4456c0ec-4413-4194-8b22-44cdc1e39641', 42),
  ('1f4a7d2a-055f-4d78-bb18-ad04719fbe1e', 44.6),
  ('54524ab8-eb60-4295-b44b-50d5f0b2e8f7', 59.6),
  ('8560a210-fab9-4969-8d34-08ac876592d0', 23.9);


-- Seed cart_items
INSERT INTO cart_items (cart_id, product_id, count, price)
SELECT
  carts.id AS cart_id,
  products.id AS product_id,
  floor(random() * 9 + 1) AS count,
  products.price AS price
FROM carts
JOIN users ON carts.user_id = users.id
JOIN products ON true;

-- Drop the temporary products table
DROP TABLE products;

-- Seed orders
INSERT INTO orders (user_id, cart_id, payment, delivery, comments, total)
SELECT
  users.id AS user_id,
  carts.id AS cart_id,
  '{"method": "credit_card", "amount": 3}'::jsonb AS payment,
  '{"address": "test address", "city": "test city", "zipcode": "12345", "firstName": "Test", "lastName": "User"}'::jsonb AS delivery,
  'Test comments' AS comments,
  floor(random() * 950 + 50) AS total
FROM carts
JOIN users ON carts.user_id = users.id;
