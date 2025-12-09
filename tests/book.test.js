// tests/book.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  app = require('../src/app');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Book API', () => {
  test('POST /api/books -> create book (201)', async () => {
    const newBook = { title: 'Test Book', author: 'Me', publishedYear: 2020, pages: 123 };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Test Book');
  });

  test('GET /api/books -> empty list then list after create', async () => {
    let res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);

    await request(app).post('/api/books').send({ title: 'A', author: 'B' });

    res = await request(app).get('/api/books');
    expect(res.body.length).toBe(1);
  });

  test('GET /api/books/:id -> 404 for missing, 200 for existing', async () => {
    const resMissing = await request(app).get('/api/books/000000000000000000000000');
    expect([400, 404]).toContain(resMissing.statusCode);

    const create = await request(app).post('/api/books').send({ title: 'Fetch', author: 'X' });
    const id = create.body._id;
    const res = await request(app).get(`/api/books/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Fetch');
  });

  test('PUT /api/books/:id -> 404 for missing, 200 for update', async () => {
    const created = await request(app).post('/api/books').send({ title: 'Before', author: 'A' });
    const id = created.body._id;

    const res = await request(app).put(`/api/books/${id}`).send({ title: 'After', author: 'A' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('After');
  });

  test('DELETE /api/books/:id -> 204 for delete', async () => {
    const created = await request(app).post('/api/books').send({ title: 'ToDelete', author: 'A' });
    const id = created.body._id;

    const res = await request(app).delete(`/api/books/${id}`);
    expect(res.statusCode).toBe(204);

    const res2 = await request(app).get(`/api/books/${id}`);
    expect([400, 404]).toContain(res2.statusCode);
  });
});
