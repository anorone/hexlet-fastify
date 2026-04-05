import fastify from 'fastify';
import { plugin as reverseRoutesPlugin } from 'fastify-reverse-routes';
import viewPlugin from '@fastify/view';
import formBodyPlugin from '@fastify/formbody';
import pug from 'pug';
import * as Yup from 'yup';
import { state } from './state.js';

const port = 3000;

const app = fastify({ exposeHeadRoutes: false });

const route = (name, context) => app.reverse(name, context);

await app.register(reverseRoutesPlugin);

app.register(viewPlugin, {
  engine: { pug },
  root: './src/views/',
  defaultContext: { route },
});

app.register(formBodyPlugin);

app.get('/', { name: 'root' }, (request, reply) => {
  reply.view('/index');
});

app.get('/hello', { name: 'hello' }, (request, reply) => {
  const { name } = request.query;
  reply.send(`Hello, ${name || 'World'}!`);
});

app.get('/courses', { name: 'courses' }, (request, reply) => {
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

app.get('/courses/new', { name: 'newCourse' }, (request, reply) => {
  const locals = { values: {}, error: null };
  reply.view('courses/new', locals);
});

app.get('/courses/:courseId', { name: 'course' }, (request, reply) => {
  const { courseId } = request.params;
  reply.send(`Course ID: ${courseId}`);
});

app.get('/courses/:courseId/lessons/:lessonId', {
  name: 'lesson',
}, (request, reply) => {
  const { courseId, lessonId } = request.params;
  reply.send(`Course ID: ${courseId}; Lesson ID: ${lessonId}`);
});

app.post('/courses', {
  name: 'addCourse',
  attachValidation: true,
  schema: {
    body: Yup.object().shape({
      title: Yup.string().trim().min(2),
      description: Yup.string().trim().min(10),
    }),
  },
  validatorCompiler: ({ schema }) => (request) => {
    try {
      const value = schema.validateSync(request);
      return { value };
    } catch (error) {
      return { error };
    }
  },
}, (request, reply) => {
  const { validationError } = request;
  if (validationError) {
    const locals = {
      values: request.body,
      error: validationError,
    };
    reply.view('courses/new', locals);
    return;
  }
  const { title, description } = request.body;
  const course = {
    id: state.courses.length + 1,
    title,
    description,
  };
  state.courses.push(course);
  reply.redirect(route('courses'));
});

app.get('/users', { name: 'users' }, (request, reply) => {
  const locals = { users: state.users };
  reply.view('/users/index', locals);
});

app.get('/users/new', { name: 'newUser' }, (request, reply) => {
  const locals = { values: {}, error: null };
  reply.view('/users/new', locals);
});

app.get('/users/:userId', { name: 'user' }, (request, reply) => {
  const { userId } = request.params;
  const user = state.users.find(user => user.id === parseInt(userId));
  if (!user) {
    reply.code(404).send({ message: 'User not found' });
  } else {
    const locals = { user };
    reply.view('/users/single', locals);
  }
});

app.get('/users/:userId/posts/:postId', {
  name: 'post',
}, (request, reply) => {
  const { userId, postId } = request.params;
  reply.send(`User ID: ${userId}; Post ID: ${postId}`);
});

app.post('/users', {
  name: 'addUser',
  attachValidation: true,
  schema: {
    body: Yup.object().shape({
      name: Yup.string().trim().min(2, 'Name must be at least 2 characters'),
      email: Yup.string().email().trim().lowercase(),
      password: Yup.string().min(5),
      passwordConfirmation: Yup.string().test(
        'passwords are equal',
        'Password and password confirmation must be equal',
        (value, { parent }) => value === parent.password,
      ),
    }),
  },
  validatorCompiler: ({ schema }) => (request) => {
    try {
      const value = schema.validateSync(request);
      return { value };
    } catch (error) {
      return { error };
    }
  },
}, (request, reply) => {
  const { validationError } = request;
  if (validationError) {
    const locals = {
      values: request.body,
      error: validationError,
    };
    reply.view('/users/new', locals);
    return;
  }
  const { name, email, password } = request.body;
  const user = {
    id: state.users.length + 1,
    name,
    email,
    password,
  };
  state.users.push(user);
  reply.redirect(route('users'));
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
