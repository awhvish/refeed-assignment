# 🚀 Full-Stack Project (Next.js + NestJS)

This is a full-stack web application built using **Next.js** for the frontend and **NestJS** for the backend. The backend uses **MongoDB** as the database.

## 📂 Project Structure
```
project-root/
│-- frontend/   # Next.js (latest stable version)
│-- backend/    # NestJS (latest stable version)
```

## 🛠️ Setup & Installation

### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js (LTS)](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Docker](https://www.docker.com/) (Optional, for MongoDB container)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/refeed-assignment.git
cd refeed-assignment
```

## 🚀 Running the Backend (NestJS)

### 1️⃣ Install dependencies
```sh
cd backend
npm install
```

### 2️⃣ Setup Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI="yourMongoURL"
```

### 4️⃣ Run the Backend 
```sh
npm run start:dev
```

---

## 🎨 Running the Frontend (Next.js)

### 1️⃣ Install dependencies
```sh
cd frontend
npm install
```

### 2️⃣ Setup Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
PUBLIC_API_URL=http://localhost:5000
```

### 3️⃣ Run the Frontend
```sh
npm run dev
```

Now visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Running Tests

### 🔹 Backend (NestJS) Tests
We use **Jest** for testing.

#### Run tests
```sh
cd backend
npm run test
```

#### Run tests with coverage
```sh
npm run test:cov
```

This generates a coverage report inside `backend/coverage/`.

---

## 📊 Providing Test Files & Reports in GitHub

### 🔹 Store test files in the backend
Keep all test files inside `backend/src/**/*.spec.ts`.

Example:
```
backend/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.service.ts
│   │   │   ├── user.service.spec.ts  # Test file
```

### 🔹 Upload Test Reports to GitHub
You can automate this using GitHub Actions:
1. Add this workflow file to `.github/workflows/test.yml`:

```yaml
name: Backend Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Run Tests
        run: |
          cd backend
          npm run test:cov

      - name: Upload coverage reports
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: backend/coverage/
```

This will run tests on every push and upload coverage reports as an artifact. 🎯

---


## For production, ensure you:
- Use **a cloud MongoDB** like MongoDB Atlas
- Set correct **CORS policies** in NestJS

---


