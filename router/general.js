const express = require("express");
let books = require("./booksdb.js");
const { JsonWebTokenError } = require("jsonwebtoken");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username, password)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered, Now you can log in" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", async function (req, res) {
  setTimeout(() => {
    res.send(JSON.stringify(books, null, 4));
  }, 1000);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const getBook = () =>
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  getBook()
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(404).send(`Error: ${error}`));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksarray = Object.values(books);
  let bookss = booksarray.filter((book) => {
    return book.author === author;
  });
  res.json({ booksbyAuthor: bookss });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksarray = Object.values(books);
  let bookss = booksarray.filter((book) => {
    return book.title === title;
  });
  res.json({ booksbyTitle: bookss });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const booksarray = Object.values(books);
  let bookss = booksarray.filter((book) => {
    return book.isbn === isbn;
  });
  res.json({ booksbyReview: bookss });
});

module.exports.general = public_users;
