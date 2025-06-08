const routes = (handler) => [
  {
    method: 'GET',
    path: '/reviews',
    handler: handler.getReviewsHandler,
    options: { auth: false },
  },
  {
    method: 'GET',
    path: '/reviews/user',
    handler: handler.getReviewsByUserHandler,
  },  
  {
    method: 'GET',
    path: '/reviews/{type}/{id}/stats',
    handler: handler.getRatingStatsHandler,
  },  
  {
    method: 'POST',
    path: '/reviews/events',
    handler: handler.postEventReviewHandler,
  },
  {
    method: 'POST',
    path: '/reviews/destinations',
    handler: handler.postDestinationReviewHandler,
  },
  {
    method: 'PUT',
    path: '/reviews/{id}',
    handler: handler.putReviewHandler,
  },
  {
    method: 'DELETE',
    path: '/reviews/{id}',
    handler: handler.deleteReviewHandler,
  },
];

export default routes;