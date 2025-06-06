const routes = (handler) => [
  { 
    method: 'GET', 
    path: '/destinations', 
    handler: handler.getDestinationsHandler,
  },
  { method: 'POST', 
    path: '/destinations/{id}', 
    handler: handler.getDestinationByIdHandler,
  },
  { method: 'POST', 
    path: '/destinations', 
    handler: handler.postDestinationHandler 
  },
  { method: 'PUT', 
    path: '/destinations/{id}', 
    handler: handler.putDestinationHandler 
  },
  { method: 'DELETE', 
    path: '/destinations/{id}', 
    handler: handler.deleteDestinationHandler 
  },
  { method: 'GET', 
    path: '/destinations/categories', 
    handler: handler.getCategoriesHandler,
    options: { auth: false },
  },
  {
    method: 'POST',
    path: '/users/preferences',
    handler: handler.postUserPreferencesHandler,
  },
  {
    method: 'GET',
    path: '/destinations/recommend/{id}',
    handler: handler.getRecommendationsByPreferencesHandler,
  },
  { method: 'GET', 
    path: '/destinations/top', 
    handler: handler.getTopDestinationsHandler,
    options: { auth: false }, 
  },
];

export default routes;