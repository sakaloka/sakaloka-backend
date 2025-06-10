# SakaLoka API Documentation

> API untuk berbagi ulasan dan rekomendasi seputar destinasi wisata dan acara budaya dari berbagai kota di Indonesia. 

## Endpoint

https://sakaloka-backend-production.up.railway.app

### Users

Fitur Users menangani registrasi, login, ambil data pengguna, dan update nama pengguna.

#### Register
- URL
  - `/register`
- Method
  - POST
- Request Body
  - `email` as `string`, must be unique
  - `password` as `string`
  - `name` as `string`
- Response
  ```json
  {
    "status": "success",
    "message": "Pengguna berhasil dibuat"
  }
  ```

#### Login
- URL
  - `/login`
- Method
  - POST
- Request Body
  - `email` as `string`
  - `password` as `string`
- Response
  ```json
  {
    "status": "success",
    "message": "Berhasil login",
    "loginResult": {
        "userId": 1,
        "name": "Rifa",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTc0OTQ1NDI4Nn0.4cRvIgiubcTbaIzXLEYjwF_BDClO8sJWPfeXVelP6uI"
    }
  }
  ```

#### Get User Details
- URL
  - `/users/{:userId}`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": {
        "id": 1,
        "email": "rifa@gmail.com",
        "name": "Rifa",
        "created_at": "2025-06-06 20:18:33",
        "updated_at": "2025-06-06 20:18:33"
    }
  }
  ```

#### Update User Data
- URL
  - `/users/{id}`
- Method
  - PUT
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `name` as `string`
- Response
  ```json
  {
    "status": "success",
    "message": "Pengguna berhasil diperbarui",
    "data": {
        "id": 1,
        "email": "rifa@c.com",
        "name": "Rifa",
        "created_at": "2025-06-06 20:18:33",
        "updated_at": "2025-06-09 14:54:55"
    }
  }
  ```
#### Get User Summary
- URL
  - `/users/summary{:userId}`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "message": "Summary berhasil diambil",
    "data": {
      "bookmark_total": 4,
      "event_total": 103,
      "destination_total": 182
    }
  }
  ```
#### Add User Preferences
- URL
  - `/users/preferences`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `userId` as `int`
  - `preferences` as `string`, setiap kata kunci dipisahkan dengan `,`
- Response
  ```json
  {
    "status": "success",
    "message": "Preferensi kategori berhasil disimpan",
    "data": 1
  }
  ```
---
### Destinations
#### Get All Categories
- URL
  - `/destinations/categories`
- Method
  - GET
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "name": "Budaya"
      }
    ]
  }
  ```
#### Get All Destinations
- URL
  - `/destinations`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "name": "Taman Nasional Gunung Leuser",
        "latitude": 3.741,
        "longitude": 97.1549,
        "description": "Taman Nasional Gunung Leuser adalah salah satu dari enam taman nasional yang terletak di Pulau Sumatera, Indonesia. Taman nasional ini merupakan salah satu kawasan lindung yang penting bagi flora dan fauna endemik, termasuk spesies langka seperti orangutan Sumatera, harimau Sumatera, dan gajah Sumatera.",
        "location": "Aceh, Aceh",
        "categories": "Budaya,Taman Nasional"
      }
    ]
  }
  ```
#### Get Destination Details
- URL
  - `/destinations/{:destinationId}`
- Parameters
  - `userId` as `int`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": {
      "id": 2,
      "name": "Desa Wisata Munduk",
      "latitude": -8.26866,
      "longitude": 115.07947,
      "description": "Desa Wisata Munduk adalah sebuah desa di pegunungan Bali yang terkenal dengan keindahan alamnya. Desa ini dikelilingi oleh perkebunan kopi, kakao, dan rempah-rempah, serta memiliki udara segar dan pemandangan yang menakjubkan. Di Desa Wisata Munduk, pengunjung dapat menikmati keindahan alam, trekking, melihat air terjun, dan menjelajahi kehidupan desa yang tenang.",
      "location": "Bali, Bali",
      "categories": "Desa Wisata",
      "rating_average": "4.5",
      "rating_count": 4,
      "photo_urls": "https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/2.%20Desa%20Wisata%20Munduk/gallery_photo/62413_medium.jpg || https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/2.%20Desa%20Wisata%20Munduk/gallery_photo/candi-bentar-bali.jpg || https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/2.%20Desa%20Wisata%20Munduk/gallery_photo/Desa-Munduk-Singaraja-Buleleng-Bali.jpg || https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/2.%20Desa%20Wisata%20Munduk/main/munduk-5d0d0eaa097f3620796457b4.jpg",
      "bookmark_count": 1,
      "is_saved": 0
    }
  }
  ```
#### Get Top Destinations
- URL
  - `/destinations/top`
- Method
  - GET
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 138,
        "name": "Desa Wisata Kelor",
        "location": "Yogyakarta, DI Yogyakarta",
        "photo_url": "https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/138.%20Desa%20Wisata%20Kelor/main/desa-wisata-kelor-sleman.jpg",
        "rating": 4.5
      }
    ]
  }
  ```
#### Get Destination Recommendations
- URL
  - `/destinations/recommend/{:userId}`
- Method
  - GET
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 84,
        "name": "Taman Nasional Gunung Merbabu",
        "location": "Magelang, Jawa Tengah",
        "latitude": -7.47056,
        "longitude": 110.21778,
        "description": "Taman Nasional Gunung Merbabu adalah sebuah taman nasional yang terletak di Provinsi Jawa Tengah, Indonesia. Taman nasional ini terkenal karena keindahan gunungnya, flora dan fauna yang beragam, serta trekking yang menantang.",
        "similarity": 0.35584685887086115
      }
    ]
  }
  ```
---
### Events
#### Get All Events
- URL
  - `/events`
- Parameters
  - `userId` as `int`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "title": "Gebrag Ngadu Bedug",
        "location": "Pandeglang, Banten",
        "category": "Event Budaya",
        "start_date": "2025-06-07",
        "end_date": "2025-06-09",
        "description": " Gebrag Ngadu Bedug adalah upaya revitalisasi tradisi yang telah lama hilang. Tradisi ini sempat terhenti selama lebih dari 30 tahun, diinisiasi kembali oleh para pelaku seni dan budaya setempat.",
        "detail_url": "https://eventdaerah.kemenparekraf.go.id/detail-event/gebrag-ngadu-bedug",
        "is_saved": 0
      },
    ]
  }
  ```
#### Get Event Details
- URL
  - `/events/{:eventId}`
- Parameters
  - `userId` as `int`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 4,
        "title": "Festival Bamboo Rafting",
        "location": "Hulu Sungai Selatan, Kalimantan Selatan",
        "category": "Event Budaya",
        "start_date": "2025-06-17",
        "end_date": "2025-06-23",
        "description": " Festival Bamboo Rafting merupakakan event pariwisata unggulan di Kabupaten Hulu Sungai Selatan. Event ini dilaksanakan dengan nama Festival Loksado.",
        "detail_url": "https://eventdaerah.kemenparekraf.go.id/detail-event/festival-bamboo-rafting-2",
        "rating_average": "4.0",
        "rating_count": 2,
        "bookmark_count": 0,
        "is_saved": 0
      }
    ]
  }
  ```
---
### Reviews
#### Get Reviews
- URL
  - `/reviews`
- Parameters
  - `type` as `event | destination` 
  - `targetId` as `int`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 2,
        "name": "Zoro",
        "rating": 4,
        "comment": "Sangat bermanfaat",
        "event_id": 4
      }
    ]
  }
  ```
#### Add Event Review
- URL
  - `/reviews/events`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `comment` as `string`
  - `rating` as `int`
  - `userId` as `int`
  - `eventId` as `int`
- Response
  ```json
  {
    "status": "success",
    "data": {
      "id": 3,
      "userId": 1,
      "eventId": 1,
      "rating": 5,
      "comment": "Event ini sangat meriah dan terorganisir dengan baik."
    }
  }
  ```
#### Add Destination Review
- URL
  - `/reviews/destinations`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `comment` as `string`
  - `rating` as `int`
  - `userId` as `int`
  - `destinationId` as `int`
- Response
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "userId": 1,
      "destinationId": 3,
      "rating": 4,
      "comment": "Pemandangan sangat indah dan udara sejuk."
    }
  }
  ```
#### Update Review
- URL
  - `/reviews/{:reviewId}`
- Method
  - PUT
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `comment` as `string`
  - `rating` as `int`
- Response
  ```json
  {
    "status": "success",
    "message": "Review berhasil diperbarui"
  }
  ```
#### Delete Review
- URL
  - `/reviews/{:reviewId}`
- Method
  - DELETE
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "message": "Review berhasil dihapus"
  }
  ```
---
### Bookmark
#### Get User Bookmarks
- URL
  - `/bookmarks/{:userId}`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 50,
        "user_id": 15,
        "type": "Destinasi",
        "destination_id": 1,
        "event_id": null,
        "name": "Taman Nasional Gunung Leuser",
        "photo_url": "https://storage.googleapis.com/travelee-capstone-projects.appspot.com/places/1.%20Taman%20Nasional%20Gunung%20Leuser/main/Taman-Nasional-Gungung-Leuser.jpg"
      },
      {
        "id": 49,
        "user_id": 15,
        "type": "Acara Budaya",
        "destination_id": null,
        "event_id": 2,
        "name": "Festival Bakar Tongkang",
        "photo_url": null
      },
    ]
  }
  ```
#### Add a Bookmark
- URL
  - `/bookmarks`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `user_id` as `int`
  - `type` as `Acara Budaya | Destinasi`
  - `event_id` as `int`
  - `destination_id` as `int`
- Response
  ```json
  {
    "status": "success",
    "message": "Bookmark berhasil ditambahkan"
  }
  ```
#### Delete a Bookmark
- URL
  - `/bookmarks`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
  - `user_id` as `int`
  - `bookmark_id` as `int`
- Response
  ```json
  {
    "status": "success",
    "message": "Bookmark berhasil dihapus"
  }
  ```