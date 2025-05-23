class PostsHandler {
  constructor(service) {
    this._service = service;

    this.getPostsHandler = this.getPostsHandler.bind(this);
    this.getPostByIdHandler = this.getPostByIdHandler.bind(this);
    this.postPostHandler = this.postPostHandler.bind(this);
    this.putPostHandler = this.putPostHandler.bind(this);
    this.deletePostHandler = this.deletePostHandler.bind(this);
  }
  getPostsHandler = () => ({
    status: 'success',
    data: this._service.getAllPosts(),
  });
  
  getPostByIdHandler = (request, h) => {
    const { id } = request.params;
    const post = this._service.getPostById(id);
    
    if (!post) {
      return h.response({ status: 'fail', message: 'Postingan tidak ditemukan' }).code(404);
    }
  
    return {
      status: 'success',
      data: post,
    };
  };
  
  postPostHandler = (request, h) => {
    const { imageUrl, caption, authorId } = request.payload;
  
    if (!imageUrl) {
      return h.response({
        status: 'fail',
        message: 'Gambar tidak ditemukan',
      }).code(400);
    }
  
    const newPost = this._service.addPost({ imageUrl, caption, authorId });
  
    return h.response({
      status: 'success',
      message: 'Postingan berhasil dibuat',
      data: { id: newPost.id },
    }).code(201);
  };
  
  putPostHandler = (request, h) => {
    const { id } = request.params;
    const { caption } = request.payload;
  
    const updated = this._service.updatePost(id, { caption });
  
    if (!updated) {
      return h.response({ status: 'fail', message: 'Postingan tidak ditemukan' }).code(404);
    }
  
    return {
      status: 'success',
      message: 'Postingan berhasil diperbarui',
    };
  };
  
  deletePostHandler = (request, h) => {
    const { id } = request.params;
    const deleted = this._service.deletePost(id);
  
    if (!deleted) {
      return h.response({ status: 'fail', message: 'Postingan tidak ditemukan' }).code(404);
    }
  
    return {
      status: 'success',
      message: 'Postingan berhasil dihapus',
    };
  };
}

export default PostsHandler;