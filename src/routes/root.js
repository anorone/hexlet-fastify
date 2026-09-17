export default (app, state) => {
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
};
