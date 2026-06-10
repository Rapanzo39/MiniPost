# MiniPost 📝

A lightweight full-stack CRUD blog app built with Node.js, Express, MySQL, and EJS.

---

## Features

- Create, read, update, and delete posts
- Search posts by username or content
- Auto-generated avatars via Faker.js
- Flash messages with session-based toasts
- Seed the database with fake data for testing
- Clean, custom CSS UI (no default Bootstrap look)

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Runtime    | Node.js                           |
| Framework  | Express.js                        |
| Database   | MySQL                             |
| Templating | EJS                               |
| Styling    | Bootstrap 5 + Custom CSS          |
| Utilities  | UUID, Faker.js, method-override, express-session |

---

## Project Structure

```
minipost/
├── views/
│   ├── index.ejs       # All posts feed
│   ├── show.ejs        # Single post detail
│   ├── new.ejs         # Create post form
│   └── edit.ejs        # Edit post form
├── public/
│   └── style.css       # Custom styles
├── db.js               # MySQL connection
├── index.js            # Express app & routes
├── package.json
└── README.md
```
## PreView


---

