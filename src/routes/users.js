import * as Yup from 'yup';

export default (app, state, options) => {
  const { route } = options;

  app.get('/users', { name: 'users' }, (request, reply) => {
    const locals = { users: state.users };
    reply.view('/users/index', locals);
  });

  app.get('/users/new', { name: 'newUser' }, (request, reply) => {
    const locals = { values: {}, error: null };
    reply.view('/users/new', locals);
  });

  app.post('/users', {
    name: 'createUser',
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

  app.get('/users/:userId', { name: 'user' }, (request, reply) => {
    const { userId } = request.params;
    const user = state.users.find(user => user.id === parseInt(userId));
    if (!user) {
      reply.code(404).send({ message: 'User not found' });
    } else {
      const locals = { user };
      reply.view('/users/show', locals);
    }
  });

  app.get('/users/:userId/edit', { name: 'editUser' }, (request, reply) => {
    const { userId } = request.params;
    const user = state.users.find(user => user.id === parseInt(userId));
    if (!user) {
      reply.code(404).send({ message: 'User not found' });
    } else {
      const locals = { values: user, error: null };
      reply.view('/users/edit', locals);
    }
  });

  app.patch('/users/:userId', {
    name: 'updateUser',
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
      reply.view('/users/edit', locals);
      return;
    }
    const { userId } = request.params;
    const index = state.users.findIndex(user => user.id === parseInt(userId));
    if (index === -1) {
      reply.code(404).send({ message: 'User not found' });
    } else {
      state.users[index] = { ...state.users[index], ...request.body };
      reply.redirect(route('users'));
    }
  });

  app.delete('/users/:userId', { name: 'deleteUser' }, (request, reply) => {
    const { userId } = request.params;
    state.users = state.users.filter(user => user.id !== parseInt(userId));
    reply.redirect(route('users'));
  });
};
