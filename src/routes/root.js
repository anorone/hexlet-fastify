import * as Yup from 'yup';

export default (app, state, options) => {
  const { route } = options;

  app.get('/', { name: 'root' }, (request, reply) => {
    const { visited } = request.cookies;
    const locals = { visited: Boolean(visited) };
    reply.cookie('visited', true);
    reply.view('/index', locals);
  });

  app.get('/hello', { name: 'hello' }, (request, reply) => {
    const { name } = request.query;
    reply.send(`Hello, ${name || 'World'}!`);
  });

  app.get('/cookies', { name: 'cookies' }, (request, reply) => {
    console.log('Request cookies:', request.cookies);
    reply.callNotFound();
  });

  app.get('/login', { name: 'login' }, (request, reply) => {
    reply.view('/login');
  });

  app.post('/login', { name: 'newLogin' }, (request, reply) => {
    const username = request.body.username.trim();
    if (username) {
      request.session.username = username;
    }
    reply.redirect(route('root'));
  });
};
