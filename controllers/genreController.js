const Book = require('../models/book');
const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');

const genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ "name": 1 }).exec();
  // res.json({ allGenres });
  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  })
});

const genre_detail = asyncHandler(async (req, res, next) => {
  // const genre = await Genre.findById(req.params.id).exec();
  // const booksInGenre = await Book.find({ genre: req.params.id }, "title summary").exec();
  // res.json({ booksInGenre });
  const [ genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if(genre === null){
    const err = new Error("Genre not found");
    err.status = 400;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  })
});

const genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre create GET");
});

const genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre create POST");
});

const genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre update GET");
});

const genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre update POST");
});

const genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre update GET");
});

const genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre delete POST");
});

module.exports = {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
  genre_update_get,
  genre_update_post,
  genre_delete_get,
  genre_delete_post,
};