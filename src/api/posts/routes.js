const routes = (handler) => [
  {
    method: 'GET',
    path: '/posts',
    handler: handler.getPostsHandler,
  },
  {
    method: 'GET',
    path: '/posts/{id}',
    handler: handler.getPostByIdHandler,
  },
  {
    method: 'POST',
    path: '/posts',
    handler: handler.postPostHandler,
    options: {
      payload: {
        output: 'stream',      
        parse: true,           
        multipart: true,       
        maxBytes: 50 * 1024 * 1024, 
      },
      auth: false,
    }
  },
  {
    method: 'PUT',
    path: '/posts/{id}',
    handler: handler.putPostHandler,
  },
  {
    method: 'DELETE',
    path: '/posts/{id}',
    handler: handler.deletePostHandler,
  },
];

export default routes;