export default (app, state) => {
  app.get('/', { name: 'root' }, (request, reply) => {
    reply.view('/index');
  });

  app.get('/hello', { name: 'hello' }, (request, reply) => {
    const { name } = request.query;
    reply.send(`Hello, ${name || 'World'}!`);
  });
};
