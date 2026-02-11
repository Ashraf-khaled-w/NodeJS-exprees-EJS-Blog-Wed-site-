# 🚀 Advanced Node.js Blog Engine: Beyond the Basics

### _Solving Concurrency & Data Integrity in File-System Databases_

## 📖 Project Overview

This project is a full-featured Blog Web Application built with **Node.js**, **Express.js**, and **EJS**. While most beginner projects use simple databases, this project challenges the status quo by building a **reliable, secure, and concurrent-safe data persistence layer** using only the **JSON File System**.

---

## 🛠️ The Technical Challenge (The "Why")

Standard file-system operations in Node.js are asynchronous and vulnerable to **Race Conditions**. If two users attempt to write to the same JSON file (e.g., registering or adding a post at the exact same millisecond), data loss or corruption is inevitable because one process might overwrite the other's changes.

**I didn't just build a blog; I engineered a custom "locking" mechanism to ensure enterprise-grade data integrity.**

---

## 🧠 Deep Technical Dive

### 1️⃣ The Mutex Queue Pattern (`Modules/eventQueue.js`)

To solve the concurrency issue, I implemented a **Mutex (Mutual Exclusion)** pattern. Before any write operation, the process must acquire a "software lock".

```javascript
// The heart of the concurrency control logic
while (isWriting) {
  await new Promise((resolve) => setTimeout(resolve, 100)); // Busy-wait loop
}
isWriting = true; // Acquire Lock
```

**How it works:** Any incoming request checks the `isWriting` flag. If a write is in progress, the request enters a "waiting room" (100ms polling). Once the previous operation finishes in the `finally` block, the next request is released.

### 2️⃣ Atomic Transaction Logic

In `Modules/validationUser.js` and `Modules/PostsHandler.js`, I ensured that the `Read -> Modify -> Write` cycle is **Atomic**. By wrapping these operations inside the Queue, I guarantee that:

- **No ID Collisions:** Two users can never be assigned the same ID.
- **No Data Overwrites:** Every write happens on the most up-to-date version of the file.

### 3️⃣ Role-Based Access Control (RBAC)

The system distinguishes between authority levels to secure the application:

- **Admin:** Full control over users and content.
- **Author:** Permissions to create and manage personal blog posts.
- **User:** Basic access to browse and read published content.

---

## ✨ Key Features

- **Custom Database Engine:** Manual JSON persistence with advanced concurrency protection.
- **Secure Auth:** Session-based authentication implemented from scratch (Express-Session).
- **Dynamic Rendering:** Fast server-side rendering (SSR) using EJS templates.
- **Modern UI:** A responsive, mobile-first design using CSS Grid and Flexbox.
- **Interactive UX:** Features like "Show/Hide Password", real-time form validation, and **Single Post View** with clickable cards.

---

## 📂 Project Structure

```plaintext
├── Modules/
│   ├── eventQueue.js     # Concurrency Controller (The Brain)
│   ├── PostsHandler.js   # Atomic Post Operations
│   └── validationUser.js # Secure User Logic & RBAC
├── middleware/           # Auth & Post Validation
├── views/                # EJS Templates (SSR)
│   ├── index.ejs         # Home Page with Clickable Post Cards
│   └── post.ejs          # Single Post View
├── public/               # Optimized Assets & Styling (main.css)
└── Posts.json / users.json # Local Data Persistence
```

---

## 🚀 Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ashraf-khaled-w/nodejs-exprees-ejs-blog-wed-site-
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the Server:**

   ```bash
   pnpm start
   # or
   npm start
   ```

4. **Access the App:** Open `http://localhost:3000` in your browser.

---

## 📈 Future Roadmap

- [ ] Integration with Redis for distributed locking in multi-server environments.
- [ ] Image upload support using Multer.
- [ ] Migrating to a NoSQL database while maintaining the custom Logic for legacy support.

---

_Developed by [Ashraf Khaled] - Passionate about Backend Engineering and System Design._
