import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.loginUserHandler = this.loginUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.putUserHandler = this.putUserHandler.bind(this);
  }

  postUserHandler = async (request, h) => {
    const { email, password, name } = request.payload;

    if (!email || !password || !name) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }

    try {
      const user = await this._service.addUser({ email, password, name });
      return h.response({
        status: 'success',
        message: 'Pengguna berhasil dibuat',
        data: user,
      }).code(201);
    } catch (err) {
      const isDuplicate = err.message.includes('Email sudah digunakan');
      return h
        .response({ status: 'fail', message: isDuplicate ? err.message : 'Terjadi kesalahan server' })
        .code(isDuplicate ? 409 : 500);
    }
  };

  loginUserHandler = async (request, h) => {
    const { email, password } = request.payload;

    const user = await this._service.findUserByEmailAndPassword(email, password);
    if (!user) {
      return h.response({ status: 'fail', message: 'Email atau kata sandi salah' }).code(401);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return h.response({
      status: 'success',
      message: 'Berhasil login',
      loginResult: {
        userId: user.id,
        name: user.name,
        token,
      },
    }).code(200);
  };

  getUserByIdHandler = async (request, h) => {
    const { id } = request.params;

    const user = await this._service.findUserById(id);
    if (!user) {
      return h.response({ status: 'fail', message: 'Pengguna tidak ditemukan' }).code(404);
    }

    return {
      status: 'success',
      data: user,
    };
  };

  putUserHandler = async (request, h) => {
    const { id } = request.params;
    const { name } = request.payload;

    if (!name) {
      return h.response({ status: 'fail', message: 'Nama wajib diisi' }).code(400);
    }

    const updatedUser = await this._service.updateUserById(id, { name });

    if (!updatedUser) {
      return h.response({ status: 'fail', message: 'Pengguna tidak ditemukan' }).code(404);
    }

    return {
      status: 'success',
      message: 'Pengguna berhasil diperbarui',
      data: updatedUser,
    };
  };

  getUserSummaryHandler = async (request, h) => {
    const { id } = request.params;
    try {
      const summary = await this._service.getUserSummary(id);
      return h.response({
        status: 'success',
        message: 'Summary berhasil diambil',
        data: summary,
      }).code(201);
    } catch (err) {
      return h.response({ status: 'fail', message: 'Terjadi kesalahan saat mengambil data' }).code(500);
    }
  }
}

export default UsersHandler;