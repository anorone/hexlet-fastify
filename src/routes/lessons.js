export default (app, state) => {
  app.get('/courses/:courseId/lessons/:lessonId', {
    name: 'lesson',
  }, (request, reply) => {
    const { courseId, lessonId } = request.params;
    reply.send(`Course ID: ${courseId}; Lesson ID: ${lessonId}`);
  });
};
