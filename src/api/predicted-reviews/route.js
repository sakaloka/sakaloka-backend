const routes = (handler) => [
  {
    method : 'GET',
    path   : '/predicted-reviews/top',
    handler: handler.getTopDestinationsHandler,
    options: { auth: false },
  },
  {
    method : 'POST',
    path   : '/predicted-reviews/bulk',
    handler: handler.bulkInsertHandler,
    options: { auth: false },
  },
];

export default routes;