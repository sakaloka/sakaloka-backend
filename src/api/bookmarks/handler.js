class BookmarksHandler {
  constructor(service) {
    this._service = service;

    this.getBookmarksByUserHandler = this.getBookmarksByUserHandler.bind(this);
  }

  getBookmarksByUserHandler = async (request, h) => {
    try {
      const data = await this._service.getBookmarksByUser(request.params.id);
      if (!data) {
        return h.response({ status: 'fail', message: 'Tidak ada acara budaya dan destinasi yang tersimpan' }).code(404);
      }
      return { status: 'success', data };
    } catch (err) {
      console.error(err);
      return h.response({ status: 'error', message: 'Gagal mengambil bookmark pengguna' }).code(500);
    }
  }

  addBookmarkHandler = async (request, h) => {
    try {
      const { user_id, type, event_id, destination_id } = request.payload;
      await this._service.addBookmark({ user_id, type, event_id, destination_id });
      return h.response({ status: 'success', message: 'Bookmark berhasil ditambahkan' }).code(201);
    } catch (err) {
      console.error(err);
      return h.response({ status: 'error', message: 'Gagal menambahkan bookmark' }).code(500);
    }
  }
  
  deleteBookmarkHandler = async (request, h) => {
    try {
      const { user_id, bookmark_id } = request.payload;
      await this._service.deleteBookmark({ user_id, bookmark_id });
      return h.response({ status: 'success', message: 'Bookmark berhasil dihapus' });
    } catch (err) {
      console.error(err);
      return h.response({ status: 'error', message: 'Gagal menghapus bookmark' }).code(500);
    }
  }  
}

export default BookmarksHandler;