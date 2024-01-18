const Author = require('../models/author');
const asyncHandler = require('express-async-handler');

const author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ "family_name": 1}).exec();
  // res.json({ allAuthors });
  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  })
});

const author_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not IMPLEMENTED: Author details: ${req.params.id}`);
});

const author_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author create GET");
});

const author_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author create POST");
});

const author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author delete GET");
});

const author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author delete POST");
});

const author_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author update GET");
});

const author_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not IMPLEMENTED: Author update POST");
});

module.exports = {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_update_get,
  author_update_post,
  author_delete_get,
  author_delete_post,
};