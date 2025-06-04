const routes = (handler) => [
  { 
    method: 'GET', 
    path: '/destinations', 
    handler: handler.getDestinationsHandler 
  },
  { method: 'GET', 
    path: '/destinations/{id}', 
    handler: handler.getDestinationByIdHandler 
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
    path: '/destinations/top', 
    handler: handler.getTopDestinationsHandler,
    options: { auth: false }, 
  },
  {
    method: 'GET',
    path: '/destinations/recommend',
    handler: handler.getRecommendedHandler,
    options: { auth: false }, 
  },
];

export default routes;