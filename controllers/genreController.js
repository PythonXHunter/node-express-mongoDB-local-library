const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');

const genre_list = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Genre List");
});

const genre_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not IMPLEMENTED: Genre Detail: ${req.params.id}`);
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