const Book = require('../models/book');
const Author = require('../models/author');
const BookInstance = require('../models/bookinstance');
const Genre = require('../models/genre');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ "status": "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render(
    "index",
    {
      title: "Local Library Home",
      book_count: numBooks,
      book_instance_count: numBookInstances,
      book_instance_available_count: numAvailableBookInstances,
      author_count: numAuthors,
      genre_count: numGenres,
    }
  );
});

const book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({title: 1})
    .populate("author")
    .exec();
    
    res.render("book_list", {
      title: "Book List",
      book_list: allBooks,
  });
});

const book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);
  // res.json({ book, bookInstances });
  if(book === null){
    const err = new Error("Book no found");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
})

const book_create_get = asyncHandler(async (req, res, next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ "family_name": 1 }).exec(),
    Genre.find().sort({ "name": 1 }).exec(),
  ]);

  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});

const book_create_post = [
  (req, res, next) => {
    if(!Array.isArray(req.body.genre)){
      req.body.genre = 
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 3})
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // console.log("Genre", req.body.genre);
    const book = Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });
    // console.log(book);
    if(!errors.isEmpty()){
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: -1 }).exec(),
        Genre.find().sort({ name: -1 }).exec(),
      ]);

      for(const genre of allGenres){
        if(book.genre.includes(genre._id)){
          genre.checked = "true";
        }
      }
      // console.log(allAuthors);
      // console.log(allGenres);
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

const book_update_get = asyncHandler(async (req, res, next) => {
  const [book, allAuthors, allGenres] = await Promise.all([
    Book.findById(req.params.id).populate("author").exec(),
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if(book === null) {
    const err = new Error("Book not found");
    err.status = 400;
    return next(err);
  }

  allGenres.forEach((genre) => {
    if(book.genre.includes(genre._id)) genre.checked = "true";
  });
  // res.json({ book, allAuthors, allGenres });
  res.render("book_form", {
    title: "Update Book",
    authors: allAuthors,
    genres: allGenres,
    book: book,
  });
});

const book_update_post = [
  (req, res, next) => {
    if(!Array.isArray(req.body.genre)){
      req.body.genre = 
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // console.log(req.body.genre, [req.body.genre]);
    const book = Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });
    // console.log(book.genre);
    if(!errors.isEmpty()){
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for(const genre of allGenres){
        if(book.genre.indexOf(genre._id) > -1){
          genre.checked = "true";
        }
      }

      res.render("book_form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});

      res.redirect(updatedBook.url);
    }
  }),
];

const book_delete_get = asyncHandler(async (req, res, next) => {
  const [book, allBookInstancesByBook ] = await Promise.all([
    Book.findById(req.params.id).exec(),
    BookInstance.find({ book: req.params.id }, "status due_back").exec(),
  ]);

  if(book === null){
    res.redirect("/catalog/books");
  }
  // res.json({ book, allBookInstancesByBook });
  res.render("book_delete", {
    title: "Delete Book",
    book: book,
    book_bookinstances : allBookInstancesByBook, 
  });
});

const book_delete_post = asyncHandler(async (req, res, next) => {
  const [book, allBookInstancesByBook] = await Promise.all([
    Book.findById(req.params.id).exec(),
    BookInstance.find({ book: req.params.id}, "status due_back").exec(),
  ]);

  if(allBookInstancesByBook.length > 0){
    // res.json({ book, allBookInstancesByBook });
    res.render("book_delete", {
      title: "Delete Book",
      book: book,
      book_bookinstances: allBookInstancesByBook,
    });
    return;
  } else {
    console.log(req.body);
    await Book.findByIdAndDelete(req.body.book_id);
    res.redirect("/catalog/books");
  }
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