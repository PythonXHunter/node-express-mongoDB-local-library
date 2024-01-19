const Book = require('../models/book');
const Author = require('../models/author');
const { body, validationResult } = require('express-validator');
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
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);
  // res.json({ author, allBooksByAuthor });
  if(author === null){
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

const author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
});

const author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric character."),
  
  body("family_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has no-alphanumeric character."),
  
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy"})
    .isISO8601()
    .toDate(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    // console.log('errors', errors.array());
    // console.log('Author', author);
    if(!errors.isEmpty()){
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
  
];

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