const routes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.postUserHandler,
    options: { auth: false },
  },
  {
    method: 'POST',
    path: '/login',
    handler: handler.loginUserHandler,
    options: { auth: false },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.putUserHandler,
  },
  {
    method: 'GET',
    path: '/users/summary/{id}',
    handler: handler.getUserSummaryHandler,
  },
];

export default routes;