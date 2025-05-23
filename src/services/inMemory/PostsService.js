class PostsService {
  constructor() {
    this._posts = [];
  }
  getAllPosts = () => this._posts;
  
  getPostById = (id) => this._posts.find(p => p.id === parseInt(id));
  
  addPost = ({ imageUrl, caption, authorId }) => {
    const id = this._posts.length + 1;
    const timestamp = new Date().toISOString();
    const newPost = { 
      id, 
      authorId,
      imageUrl,
      caption, 
      created_at: timestamp,
      updated_at: timestamp,
    };
    this._posts.push(newPost);
    return newPost;
  };
  
  updatePost = (id, { caption }) => {
    const index = this._posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    this._posts[index] = { 
      ...this._posts[index], 
      caption,
      updated_at: new Date().toISOString(),
    };
    return this._posts[index];
  };
  
  deletePost = (id) => {
    const index = this._posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    this._posts.splice(index, 1);
    return true;
  };
}

export default PostsService;