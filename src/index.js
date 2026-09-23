import { plugin as reverseRoutesPlugin } from 'fastify-reverse-routes';
import viewPlugin from '@fastify/view';
import formBodyPlugin from '@fastify/formbody';
import cookiePlugin from '@fastify/cookie';
import sessionPlugin from '@fastify/session';
import pug from 'pug';
import * as Yup from 'yup';
import { state } from './state.js';

import addRootRoutes from './routes/root.js';
import addUsersRoutes from './routes/users.js';
import addCoursesRoutes from './routes/courses.js';
import addLessonsRoutes from './routes/lessons.js';
import addPostsRoutes from './routes/posts.js';

export default async (app) => {
  const route = (name, context) => app.reverse(name, context);

  await app.register(reverseRoutesPlugin);

  app.register(viewPlugin, {
    engine: { pug },
    root: './src/views/',
    defaultContext: { route },
  });

  app.register(formBodyPlugin);
  app.register(cookiePlugin);

  app.register(sessionPlugin, {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
  });

  addRootRoutes(app, state, { route });
  addUsersRoutes(app, state, { route });
  addCoursesRoutes(app, state, { route });
  addLessonsRoutes(app, state, { route });
  addPostsRoutes(app, state, { route });

  app.addHook('preHandler', (request, reply, done) => {
    const { username } = request.session;
    reply.locals = { username };
    done();
  });

  return app;
};
