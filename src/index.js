import fastify from 'fastify';
import viewPlugin from '@fastify/view';
import pug from 'pug';
import { state } from './state.js';

const port = 3000;

const app = fastify();

app.register(viewPlugin, {
  engine: { pug },
  root: './src/views/'
});

app.get('/', (request, reply) => {
  reply.view('/index');
});

app.get('/hello', (request, reply) => {
  const { name } = request.query;
  reply.send(`Hello, ${name || 'World'}!`);
});

app.get('/courses/new', (request, reply) => {
  reply.send('Course build');
});

app.get('/courses/:courseId', (request, reply) => {
  const { courseId } = request.params;
  reply.send(`Course ID: ${courseId}`);
});

app.get('/courses/:courseId/lessons/:lessonId', (request, reply) => {
  const { courseId, lessonId } = request.params;
  reply.send(`Course ID: ${courseId}; Lesson ID: ${lessonId}`);
});

app.get('/users', (request, reply) => {
  const locals = { users: state.users };
  reply.view('/users/index', locals);
});

app.get('/users/:userId', (request, reply) => {
  const { userId } = request.params;
  const user = state.users.find(user => user.id === parseInt(userId));
  if (!user) {
    reply.code(404).send({ message: 'User not found' });
  } else {
    const locals = { user };
    reply.view('/users/single', locals);
  }
});

app.get('/users/:userId/posts/:postId', (request, reply) => {
  const { userId, postId } = request.params;
  reply.send(`User ID: ${userId}; Post ID: ${postId}`);
});

app.post('/users', (request, reply) => {
  reply.send('POST /users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
