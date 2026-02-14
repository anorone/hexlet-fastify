import fastify from 'fastify';

const port = 3000;

const app = fastify();

app.get('/', (request, reply) => {
  reply.send('Hello, World!');
});

app.get('/hello', (request, reply) => {
  const { name } = request.query;
  reply.send(`Hello, ${name || 'World'}!`);
});

app.get('/users', (request, reply) => {
  reply.send('GET /users');
});

app.post('/users', (request, reply) => {
  reply.send('POST /users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
