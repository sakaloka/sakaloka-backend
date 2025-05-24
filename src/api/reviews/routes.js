const routes = (handler) => [
  {
    method: 'GET',
    path: '/reviews',
    handler: handler.getReviewsHandler,
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
    path: '/reviews/events/{id}',
    handler: handler.putReviewHandler,
  },
  {
    method: 'PUT',
    path: '/reviews/destinations/{id}',
    handler: handler.putReviewHandler,
  },
  {
    method: 'DELETE',
    path: '/reviews/{id}',
    handler: handler.deleteReviewHandler,
  },
];

export default routes;