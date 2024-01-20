const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate('book').exec();
  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances
  });
  // res.json({ allBookInstances });
});

const bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if(bookInstance === null){
    const err = new Error("BookInstance not found");
    err.status = 404;
    return next(err);
  }
  // res.json({ bookInstance });
  res.render("bookinstance_detail", {
    title: "Book:",
    bookinstance: bookInstance,
  })
});

const bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  // res.json({ allBooks });
  res.render("bookinstance_form", {
    title: "Create Bookinstace",
    book_list: allBooks,
  });
});

const bookinstance_create_post = [
  body("book", "Book must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("imprint", "Imprint must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status")
    .escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy"})
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookinstance = BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if(!errors.isEmpty()){
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookinstance.book._id,
        errors: errors.array(),
        bookinstance: bookinstance, 
      });
      return;
    } else {
      await bookinstance.save();
      res.redirect(bookinstance.url);
    }
  }),
];

const bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const [bookinstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find(),
  ]);
  if(bookinstance === null){
    const err = new Error("BookInstance not found");
    err.status = 400;
    return next(err);
  }
  res.render("bookinstance_form", {
    title: "Updated Form",
    book_list: allBooks,
    selected_book: bookinstance.book._id,
    bookinstance: bookinstance,
  });
  // res.json({ bookinstance, allBooks });
});

const bookinstance_update_post = [
  body("book", "Book must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("status")
    .escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookinstance = BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if(!errors.isEmpty()){
      const allBooks = await Book.find({}, "title").exec()
      console.log(errors.array());
      res.render("bookinstance_form", {
        title: "Update BookInstance",
        selected_book: bookinstance.book._id,
        bookinstance: bookinstance,
        book_list: allBooks,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedData = await BookInstance.findByIdAndUpdate(req.params.id, bookinstance);
      res.redirect(updatedData.url);
    }
  }),

];

const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).populate("book").exec();
  if(bookInstance === null){
    res.redirect("/catalog/bookinstances");
  }
  // res.json({bookInstance});
  res.render("bookinstance_delete", {
    title: "Delete BookInstance",
    bookinstance: bookInstance,
  })
});

const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  await BookInstance.findByIdAndDelete(req.body.bookinstance_id);
  res.redirect("/catalog/bookinstances");
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