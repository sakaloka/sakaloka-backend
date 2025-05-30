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
];

export default routes;