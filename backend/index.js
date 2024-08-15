import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const upload = multer({ dest: 'uploads/' }); // Define upload destination

const dbConfig = {
    host: "your-database-host",
    user: "your-database-username",
    password: "your-database-password",
    database: "your-database-name"
};

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files from uploads directory

app.get("/", (req, res) => {
    res.json("Hello");
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/books', upload.single('cover'), (req, res) => {
    const { title, desc, price } = req.body;
    const cover = req.file ? req.file.path : null; // Get the uploaded file path

    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
    const values = [title, desc, price, cover];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been created successfully");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been Deleted successfully");
    });
});

app.put("/books/:id", upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const { title, desc, price } = req.body;
    const cover = req.file ? req.file.path : null;

    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";
    const values = [title, desc, price, cover, bookId];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been updated successfully");
    });
});

app.listen(8000, () => {
    console.log("Connected to server on port 8000");
});
