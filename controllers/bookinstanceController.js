const BookInstance = require('../models/bookinstance');
const asyncHandler = require('express-async-handler');

const bookinstance_list = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance List");
});

const bookinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not IMPLEMENTED: BookInstance Detail: ${req.params.id}`);
});

const bookinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance create GET");
});

const bookinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance create POST");
});

const bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance update GET");
});

const bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});

const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance delete GET");
});

const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: BookInstance delete POST");
});

module.exports = {
  bookinstance_list,
  bookinstance_detail,
  bookinstance_create_get,
  bookinstance_create_post,
  bookinstance_update_get,
  bookinstance_update_post,
  bookinstance_delete_get,
  bookinstance_delete_post,
};