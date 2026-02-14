import fastify from 'fastify';

const port = 3000;

const app = fastify();

app.get('/', (request, reply) => {
  reply.send('Hello, World!');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
