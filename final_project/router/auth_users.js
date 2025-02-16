const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some((user) => {
        return user.username === username && user.password === password;
    });
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.isbn13 === isbn);

    if (matchingBooks.length > 0) {
        const { review } = req.body;
        matchingBooks[0].reviews[req.session.authorization.username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    } else {
        return res.status(404).json({ message: "Book with isbn13: " + isbn + " not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const matchingBooks = Object.values(books).filter((book) => book.isbn13 === isbn);

    if (matchingBooks.length > 0) {
        if (matchingBooks[0].reviews[req.session.authorization.username]) {
            delete matchingBooks[0].reviews[req.session.authorization.username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review does not exist" });
        }
    } else {
        return res.status(404).json({ message: "Book with isbn13: " + isbn + " not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
