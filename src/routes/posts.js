export default (app, state) => {
  app.get('/users/:userId/posts/:postId', {
    name: 'post',
  }, (request, reply) => {
    const { userId, postId } = request.params;
    reply.send(`User ID: ${userId}; Post ID: ${postId}`);
  });
};
