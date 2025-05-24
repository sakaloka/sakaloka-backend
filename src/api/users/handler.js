import jwt from 'jsonwebtoken';

class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.loginUserHandler = this.loginUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.putUserHandler = this.putUserHandler.bind(this);
  }
  postUserHandler = (request, h) => {
    const { email, password, name } = request.payload;
    if (!email || !password || !name) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }
  
    const user = this._service.addUser({ email, password, name });
  
    return h.response({
      status: 'success',
      message: 'Pengguna berhasil dibuat'
    }).code(201);
  };
  
  loginUserHandler = (request, h) => {
    const { email, password } = request.payload;
    const user = this._service.findUserByEmailAndPassword(email, password);
  
    if (!user) {
      return h.response({ error: 'fail', message: 'Email atau kata sandi salah' }).code(401);
    }
  
    const token = jwt.sign({ id: user.id }, 'your-secret', { expiresIn: '1h' });
    return h.response({ 
      message: 'success', 
      loginResult: {
        userId: user.id,
        name: user.name,
        token,
      }
    }).code(200);
  };
  
  getUserByIdHandler = (request, h) => {
    const { id } = request.params;
    const user = this._service.findUserById(id);
  
    if (!user) {
      return h.response({ status: 'fail', message: 'Pengguna tidak ditemukan' }).code(404);
    }
  
    return {
      status: 'success',
      data: user,
    };
  };
  
  putUserHandler = (request, h) => {
    const { id } = request.params;
    const { name } = request.payload;
  
    if (!name) {
      return h.response({ status: 'fail', message: 'Nama wajib diisi' }).code(400);
    }
  
    const updatedUser = this._service.updateUserById(id, { name });
  
    if (!updatedUser) {
      return h.response({ status: 'fail', message: 'Pengguna tidak ditemukan' }).code(404);
    }
  
    return {
      status: 'success',
      message: 'Pengguna berhasil diperbarui',
      data: updatedUser,
    };
  };
}

export default UsersHandler;