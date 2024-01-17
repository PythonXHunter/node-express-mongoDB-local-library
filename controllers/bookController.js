const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

const index = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Site Home Page");
});

const book_list = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book List");
});

const book_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not IMPLEMENTED: Book Detail: ${req.params.id}`);
})

const book_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book create GET");
});

const book_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book create POST");
});

const book_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book update GET");
});

const book_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book update POST");
});

const book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book delete GET");
});

const book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Book delete POST");
});

module.exports = {
  index,
  book_list,
  book_detail,
  book_create_get,
  book_create_post,
  book_update_get,
  book_update_post,
  book_delete_get,
  book_delete_post,
};