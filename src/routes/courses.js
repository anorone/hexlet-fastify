import * as Yup from 'yup';

export default (app, state, options) => {
  const { route } = options;

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

  app.post('/courses', {
    name: 'createCourse',
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

  app.get('/courses/:courseId', { name: 'course' }, (request, reply) => {
    const { courseId } = request.params;
    const course = state.courses.find(course => {
      return course.id === parseInt(courseId);
    });
    if (!course) {
      reply.code(404).send({ message: 'Course not found' });
    } else {
      const locals = { course };
      reply.view('/courses/show', locals);
    }
  });

  app.get('/courses/:courseId/edit', {
    name: 'editCourse',
  }, (request, reply) => {
    const { courseId } = request.params;
    const course = state.courses.find(course => {
      return course.id === parseInt(courseId);
    });
    if (!course) {
      reply.code(404).send({ message: 'Course not found' });
    } else {
      const locals = { values: course, error: null };
      reply.view('/courses/edit', locals);
    }
  });

  app.patch('/courses/:courseId', {
    name: 'updateCourse',
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
      reply.view('courses/edit', locals);
      return;
    }
    const { courseId } = request.params;
    const index = state.courses.findIndex(course => {
      return course.id === parseInt(courseId);
    });
    if (index === -1) {
      reply.code(404).send({ message: 'Course not found' });
    } else {
      state.courses[index] = { ...state.courses[index], ...request.body };
      reply.redirect(route('courses'));
    }
  });

  app.delete('/courses/:courseId', {
    name: 'deleteCourse',
  }, (request, reply) => {
    const { courseId } = request.params;
    state.courses = state.courses.filter(course => {
      return course.id !== parseInt(courseId);
    });
    reply.redirect(route('courses'));
  });
};
