const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodoverride = require("method-override");
const { faker } = require('@faker-js/faker');
const session = require("express-session");
const db = require("./db");

app.use(session({
    secret: "minipost-secret",
    resave: false,
    saveUninitialized: true
}));


app.use(
  '/bootstrap',
  express.static(
    __dirname + '/node_modules/bootstrap/dist'
  )
);

app.use(express.urlencoded({extended: true}));
// override with the X-HTTP-Method-Override header in the request
app.use(methodoverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));




// to check if the server is working well
app.get("/",(req,res)=>{
    res.send("server working well!!!");
});

// to show all the posts
app.get("/posts", (req, res) => {

    let { search = "" } = req.query;

    let message = req.session.message;
    req.session.message = null;

    db.query(
        `SELECT * FROM posts
         WHERE username LIKE ?
         OR content LIKE ?`,
        [`%${search}%`, `%${search}%`],
        (err, results) => {

            if(err) throw err;

            res.render("index", {
                posts: results,
                message
            });
        }
    );
});

// to show the form to create a new post
app.get("/posts/new",(req,res)=>{
    res.render("new");
});



// to create a new post
///posts is the route to create a new post and it is the same route to show all the posts but the method is different
app.post("/posts", (req, res) => {

    let { username, content } = req.body;

    if (!username || !content) {
        return res.send("Username and content required");
    }

    const id = uuidv4();

    db.query(
        "INSERT INTO posts(id, username, content, avatar) VALUES (?, ?, ?, ?)",
        [
            id,
            username,
            content,
            faker.image.avatar()
        ],
        (err) => {

            if (err) throw err;

            req.session.message =
                "Post created successfully 🎉";

            res.redirect("/posts");
        }
    );
});

// to show the content of a post in detail and
//show single post
app.get("/posts/:id", (req, res) => {

    let { id } = req.params;

    db.query(
        "SELECT * FROM posts WHERE id = ?",
        [id],
        (err, results) => {

            if(err) throw err;

            res.render("show", {
                post: results[0]
            });
        }
    );
});

// to upadate the content of a post
app.patch("/posts/:id", (req, res) => {

    let { id } = req.params;
    let { content } = req.body;

    db.query(
        "UPDATE posts SET content = ? WHERE id = ?",
        [content, id],
        (err) => {

            if(err) throw err;

            req.session.message =
                "Post updated successfully ✏️";

            res.redirect("/posts");
        }
    );
});


//to edit the post. show edit form
app.get("/posts/:id/edit", (req, res) => {

    let { id } = req.params;

    db.query(
        "SELECT * FROM posts WHERE id = ?",
        [id],
        (err, results) => {

            if(err) throw err;

            res.render("edit", {
                post: results[0]
            });
        }
    );
});

//to delete a post
app.delete("/posts/:id", (req, res) => {

    let { id } = req.params;

    db.query(
        "DELETE FROM posts WHERE id = ?",
        [id],
        (err) => {

            if(err) throw err;

            req.session.message =
                "Post deleted successfully 🗑️";

            res.redirect("/posts");
        }
    );
});


//if we want to seed the database with fake data we can use this route
app.get("/seed", (req, res) => {

    for(let i = 0; i < 10; i++){

        db.query(
            "INSERT INTO posts(id, username, content, avatar) VALUES (?, ?, ?, ?)",
            [
                uuidv4(),
                faker.internet.username(),
                faker.lorem.sentence(),
                faker.image.avatar()
            ]
        );
    }

    res.send("Seeded");
});


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});