const routes = (handler) => [
  { 
    method: 'GET', 
    path: '/events', 
    handler: handler.getEventsHandler 
  },
  { 
    method: 'GET', 
    path: '/events/{id}', 
    handler: handler.getEventByIdHandler 
  },
  { 
    method: 'POST', 
    path: '/events', 
    handler: handler.postEventHandler 
  },
  { 
    method: 'PUT', 
    path: '/events/{id}', 
    handler: handler.putEventHandler 
  },
  { method: 'DELETE', 
    path: '/events/{id}', 
    handler: handler.deleteEventHandler 
  },
];

export default routes;