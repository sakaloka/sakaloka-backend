# SakaLoka API Documentations

> API untuk berbagi ulasan dan rekomendasi seputar destinasi wisata dan event lokal. Mirip seperti platform review dan komunitas yang membantu pengguna mengeksplor keindahan Indonesia. 

## Endpoint

### Users

Fitur Users menangani registrasi, login, ambil data pengguna, dan update nama pengguna.

#### Register
- URL
  - `/register`
- Method
  - POST
- Request Body
  - `email` as string
  - `password` as string
  - `name` as string
- Response
  ```json
  {
    "status": "success",
    "message": "Pengguna berhasil dibuat",
    "data": {
      "id": 1
    }
  }
  ```

#### Login
- URL
  - `/login`
- Method
  - POST
- Request Body
  - `email` as string
  - `password` as string
- Response
  ```json
  {
    "status": "success",
    "token": "<JWT_TOKEN>"
  }
  ```

#### Get User Details
- URL
  - `/users/{:id}`
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
      "email": "user@example.com",
      "password": "123456",
      "name": "Rifa",
      "created_at": "2025-05-24T07:00:00Z",
      "updated_at": "2025-05-24T07:00:00Z"
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
  - `name` as string
- Response
  ```json
  {
    "status": "success",
    "message": "Pengguna berhasil diperbarui",
    "data": {
      "id": 1,
      "email": "user@example.com",
      "password": "123456",
      "name": "Rifa Fairuz",
      "created_at": "...",
      "updated_at": "2025-05-24T08:00:00Z"
    }
  }
  ```
---
### Destinations
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
#### Get Destination Details
- URL
  - `/destinations/{:id}`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
---
### Events
#### Get All Events
- URL
  - `/events`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
#### Get Event Details
- URL
  - `/events/{:id}`
- Method
  - GET
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Response
#### Add New Event
- URL
  - `/events`
- Method
  - POST
- Headers
  ```
  Authorization: Bearer <token>
  ```
- Request Body
- Response
---
### Reviews
#### Get All Reviews
- URL
  - Event: `/reviews?type=event&targetId={:id}`
  - Destination: `/reviews?type=destination&targetId={:id}`
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
        "comment": "Sangat meriah dan terorganisir",
        "rating": 5,
        "userId": 1,
        "eventId": 1,
        "destinationId": null,
        "created_at": "2025-05-24T08:00:00Z",
        "updated_at": "2025-05-24T08:00:00Z"
      }
    ]
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
  - `comment` as string
  - `rating` as float
  - `userId` as int
  - `destinationId` as int
- Response
  ```json
  {
    "status": "success",
    "data": {
      "id": 2,
      "comment": "Sangat indah dan bersih",
      "rating": 4,
      "userId": 1,
      "destinationId": 2
    }
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
  - `comment` as string
  - `rating` as float
  - `userId` as int
  - `eventId` as int
- Response
  ```json
  {
    "status": "success",
    "data": {
      "id": 2,
      "comment": "Sangat menyenangkan dan banyak artefak",
      "rating": 4,
      "userId": 1,
      "eventId": 2
    }
  }
  ```
