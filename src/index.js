import fastify from 'fastify';
import viewPlugin from '@fastify/view';
import formBodyPlugin from '@fastify/formbody';
import pug from 'pug';
import { state } from './state.js';

const port = 3000;

const app = fastify();

app.register(viewPlugin, {
  engine: { pug },
  root: './src/views/'
});

app.register(formBodyPlugin);

app.get('/', (request, reply) => {
  reply.view('/index');
});

app.get('/hello', (request, reply) => {
  const { name } = request.query;
  reply.send(`Hello, ${name || 'World'}!`);
});

app.get('/courses', (request, reply) => {
  const { term } = request.query;
  const { courses } = state;
  const filteredCourses = term ? courses.filter(course => {
    const title = course.title.toLowerCase();
    const description = course.description.toLowerCase();
    const searchTerm = term.toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  }) : courses;
  const data = { term, courses: filteredCourses };
  reply.view('courses/index', data);
});

app.get('/courses/new', (request, reply) => {
  reply.view('courses/new');
});

app.get('/courses/:courseId', (request, reply) => {
  const { courseId } = request.params;
  reply.send(`Course ID: ${courseId}`);
});

app.get('/courses/:courseId/lessons/:lessonId', (request, reply) => {
  const { courseId, lessonId } = request.params;
  reply.send(`Course ID: ${courseId}; Lesson ID: ${lessonId}`);
});

app.post('/courses', (request, reply) => {
  const course = {
    id: state.courses.length + 1,
    title: request.body.title.trim(),
    description: request.body.description.trim(),
  };
  state.courses.push(course);
  reply.redirect('/courses');
});

app.get('/users', (request, reply) => {
  const locals = { users: state.users };
  reply.view('/users/index', locals);
});

app.get('/users/new', (request, reply) => {
  reply.view('/users/new');
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
  const user = {
    id: state.users.length + 1,
    name: request.body.name.trim(),
    email: request.body.email.trim().toLowerCase(),
    password: request.body.password,
  };
  state.users.push(user);
  reply.redirect('/users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
