import db from "../../db/database.js";

class BookmarksService {
  getBookmarksByUser = async (id) => {
    const [rows] = await db.execute(`
      SELECT 
        ub.id,
        ub.type,
        CASE 
          WHEN ub.type = 'Acara Budaya' THEN e.title 
          ELSE d.name 
        END AS name,
        CASE 
          WHEN ub.type = 'Destinasi' THEN dp.photo_url
          ELSE NULL
        END AS photo_url,
        ub.created_at
      FROM user_bookmark ub
      LEFT JOIN events e ON ub.event_id = e.id
      LEFT JOIN destinations d ON ub.destination_id = d.id
      LEFT JOIN destination_photos dp ON d.id = dp.destination_id AND dp.is_gallery = 0
      WHERE ub.user_id = ?
    `, [id]);
  
    return rows;
  }  

  addBookmark = async ({ user_id, type, event_id = null, destination_id = null }) => {
    await db.execute(`
      INSERT INTO user_bookmark (user_id, type, event_id, destination_id)
      VALUES (?, ?, ?, ?)
    `, [user_id, type, event_id, destination_id]);
  }
  
  deleteBookmark = async ({user_id, bookmark_id}) => {
    await db.execute(`
      DELETE FROM user_bookmark
      WHERE user_id = ? AND id = ? 
    `, [user_id, bookmark_id]);
  }  
}

export default BookmarksService;