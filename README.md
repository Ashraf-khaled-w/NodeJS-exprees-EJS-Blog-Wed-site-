# Custom Node.js Blog Engine (Capstone Project)

A full-stack blog application built from first principles using Node.js, Express, and EJS. This project serves as a Capstone for my portfolio, demonstrating core backend engineering concepts by implementing custom data persistence and concurrency control mechanisms instead of relying on high-level database abstractions.

## 🚀 Key Technical Features

### 1. Custom JSON Database Engine

Instead of using a traditional SQL or NoSQL database (like MongoDB or MySQL), I engineered a **file-system based database architecture**. All application data (Users, Posts) is persisted directly in local JSON files (`users.json`, `Posts.json`).

This "low-level" approach required manually implementing database fundamentals:

- **Data Serialization:** Efficiently reading/parsing and stringifying data streams.
- **File I/O:** Using `fs/promises` for asynchronous non-blocking file operations.
- **Schema Management:** Defining data structures in code rather than database schemas.

### 2. Event Queue & Concurrency Control

One of the biggest challenges with file-based databases is **Race Conditions**—if two users try to write to the database simultaneously, the file could be corrupted or data lost.

To solve this _without_ using a real database engine, I implemented a **Custom Event Queue with a Mutex (Spin-Lock) Pattern** in `Modules/eventQueue.js`.

**How it works:**

1. **Mutex Flag:** A global variable (`isWritingPost`) acts as a lock.
2. **Busy-Wait Loop:** Before any write operation, the function checks if the lock is active. If it is, it enters a non-blocking wait loop using `setTimeout` (Spin-Lock).
3. **Critical Section:** Once the lock is acquired, the specific operation (reading -> modifying -> writing) is executed exclusively.
4. **Release:** The lock is released in a `finally` block to ensure it's never stuck, even if an error occurs.

This demonstrates a deep understanding of **Process Synchronization** and **Operating System concepts** applied in a web server context.

```javascript
/* Snippet from Modules/eventQueue.js */
const queuePostSafly = async (data) => {
  // 1. Wait if resource is locked (Spin-Lock)
  while (isWritingPost) {
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
  }

  // 2. Acquire Lock
  isWritingPost = true;
  try {
    await data(); // 3. Execute Critical Section
  } finally {
    isWritingPost = false; // 4. Release Lock
  }
};
```

### 3. Modern Server-Side Rendering (SSR)

- **EJS Templating:** Dynamic HTML generation on the server.

  ```ejs
  /* Example from views/index.ejs - Dynamic Rendering */
  <% if (posts.length > 0) { %>
      <div class="posts-grid">
          <% posts.forEach(post => { %>
              <article class="post-card">
                  <h2><%= post.title %></h2>
                  <p><%= post.content %></p>
              </article>
          <% }) %>
      </div>
  <% } %>
  ```

- **Custom Middleware:** Authentication logic is handled via custom Express middleware (`index.js`).

  ```javascript
  /* Modules/session.js - Session Configuration */
  import session from "express-session";

  const sessionMiddleware = session({
    secret: "secret", // In production, use environment variable
    resave: false,
    saveUninitialized: false,
  });

  /* index.js - Exposing Session Data to Views */
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    next();
  });
  ```

- **Responsive UI:** A clean, modern interface built with **Vanilla CSS** (Flexbox & Grid), featuring a responsive layout, persistent dark/light theme logic (system based), and interactive forms.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Templating:** EJS (Embedded JavaScript)
- **Styling:** CSS3 (Custom Design System, Inter Font)
- **Architecture:** DLC (Data-Logic-Controller) Separation

## � Screenshots

<!-- Add your screenshots here -->

## �📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the Server:**

   ```bash
   # Production mode
   pnpm start

   # Development mode (auto-reload)
    nodemon index.js
   ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure

```
├── Modules/
│   ├── eventQueue.js      # Concurrency control logic (Mutex)
│   ├── PostsHandler.js    # Logic for reading/writing posts
│   └── validationUser.js  # Logic for user auth & management
├── public/
│   └── styles/
│       └── main.css       # Custom CSS design system
├── views/
│   ├── partials/          # Header & Footer components
│   ├── index.ejs          # Home page (Feed)
│   ├── Login.ejs          # Auth pages
│   └── ...
├── index.js               # Application Entry Point & Routes
└── users.json / Posts.json # Data persistence files
```

---

_Developed by [Ashraf Khaled] - Node.js Capstone Project._
