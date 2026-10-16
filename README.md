# Week 9 – MongoDB Library API

## Description

This project is a REST API for managing books and authors using Node.js, Express, MongoDB, and Mongoose.

The application was developed as part of the Week 9 backend course assignment. The main purpose was to practice MongoDB database operations, schema validation, filtering, sorting, pagination, and relationships between collections.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Docker and Docker Compose
- mongo-express
- Insomnia
- Git and GitHub

## Project Structure

```text
week9-mongodb/
├── models/
│   ├── Author.js
│   └── Book.js
├── .env.example
├── .gitignore
├── compose.yml
├── db.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

The `.env` file is stored locally and excluded from Git.

## Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/Dantewar/week9-mongodb.git
cd week9-mongodb
git switch week9/mongodb
npm install
```

Create a `.env` file using `.env.example` as a template and configure the MongoDB connection.

Start the MongoDB containers:

```bash
docker compose up -d
```

Start the Express application:

```bash
npm run dev
```

The API runs at:

http://localhost:3000

MongoDB runs on port 27017, and mongo-express is available at:

http://localhost:8082

## API Endpoints

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | /books | Get books with filtering, sorting and pagination |
| GET | /books/:id | Get a book by ID |
| POST | /books | Create a book |
| PUT | /books/:id | Update a book |
| DELETE | /books/:id | Delete a book |

### Authors

| Method | Endpoint | Description |
|---|---|---|
| GET | /authors | Get all authors |
| POST | /authors | Create an author |
| GET | /authors/:id/books | Get books belonging to an author |

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API welcome message |
| GET | /health | API health response |

## Book Schema Validation

The Book model uses Mongoose validation.

- Title is required.
- Genre must be fantasy, dystopian, children, or classic.
- Published year must be between 1000 and 2026.
- Timestamps are enabled.
- Books can reference an author using MongoDB ObjectId.

Invalid input returns HTTP 400.

## Filtering, Sorting and Pagination

Examples:

```text
GET /books?genre=fantasy
GET /books?sort=publishedYear
GET /books?sort=-publishedYear
GET /books?page=1&limit=2
GET /books?genre=dystopian&page=1&limit=5
```

The response contains:

- page
- limit
- total
- data

## Authors and References

Authors are stored in a separate MongoDB collection.

Each book can reference an author through an ObjectId field.

Mongoose populate is used to retrieve author information together with book information.

This demonstrates a one-to-many relationship between authors and books.

## Testing

Insomnia was used to test the REST API.

Tests include creating, reading, updating and deleting books, validating incorrect input, and checking pagination.

The application uses the following HTTP status codes:

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid input |
| 404 | Resource not found |
| 500 | Internal server error |

## Git Workflow

Development was completed on the following branch:

`week9/mongodb`

The project was developed step by step with separate Git commits for setup, database configuration, CRUD operations, schema validation, pagination, and author relationships.

## Assignment Exercises

1. Create a Book model and basic routes.
2. Complete CRUD operations.
3. Configure the database environment and project structure.
4. Implement Mongoose schema validation.
5. Add filtering, sorting, and pagination.
6. Implement authors, references, and populate.

## Conclusion

This project demonstrates how to build a REST API using MongoDB and Mongoose. It covers database connections, CRUD operations, validation, query parameters, and relationships between collections.

The assignment also provided practical experience using Docker, Insomnia, Git, and GitHub.

## Project Status

All six planned exercises have been implemented. Final verification and submission preparation are the remaining steps.