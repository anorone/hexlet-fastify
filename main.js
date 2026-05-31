import fastify from 'fastify';
import init from './src/index.js';

const port = 3000;

const app = fastify({ exposeHeadRoutes: false });

await init(app);

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
});
