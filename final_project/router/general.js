const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const usernameExists = (username) => {
    return users.some((user) => user.username === username);
};

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!usernameExists(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const { isbn } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.isbn13 === isbn);
    if (matchingBooks.length > 0) {
        res.send(matchingBooks[0]);
    } else {
        res.status(404).json({ message: "Book with isbn13: " + isbn + " not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const { author } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.author === author);
    // Return all matching books as a JSON object
    res.send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const { title } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.title === title);
    // Return all matching books as a JSON object
    res.send(JSON.stringify(matchingBooks, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const { isbn } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.isbn13 === isbn);
    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks[0].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book with isbn13: " + isbn + " not found" });
    }
});

module.exports.general = public_users;
