# Watch-it-2gether - Backend

This is the Node.js + TypeScript backend for the **Watch-it-2gether** project, utilizing **Prisma ORM** with a **PostgreSQL** database.

## 🚀 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** instance (Docker or local installation)

## 🛠️ Initial Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `backend/` directory and fill in your credentials:
   ```env
   DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/POSTGRES_DB?schema=public"
   
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=your_db_name
   ```

3. **Database Migration & Client Generation:**
   Run the following command to sync your schema with the database and generate the Prisma Client:
   ```bash
   npx prisma migrate dev
   ```

## 💻 Running the Project

### Development Mode
Start the server with auto-reload (using nodemon and ts-node):
```bash
npm run dev
```

### Production Build
To compile the TypeScript code and start the production server:
```bash
npm run compile
npm start
```

## 📂 Useful Prisma Commands

- `npx prisma studio`: Opens a GUI in your browser to view and edit database records.
- `npx prisma generate`: Regenerates the Prisma Client (run this whenever you change `schema.prisma`).
- `npx prisma migrate reset`: Drops and recreates the database from scratch (Warning: deletes all data).

---
**Note:** The `src/infrastructure/database/generated` folder and the `.env` file are excluded from Git for security and environment integrity.
```