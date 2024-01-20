const Book = require('../models/book');
const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
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

const genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

const genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    const genre = Genre({ name: req.body.name });
    // console.log(genre);
    
    if(!errors.isEmpty()){
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }
    else {
      const genreExists = await Genre.findOne({ name: req.params.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if(genreExists){
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

const genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  if(genre === null){
    const err = new Error("Genre not found");
    err.status = 400;
    return next(err);
  }
  res.render("genre_form", {
    title: "Update Genre",
    genre: genre,
  })
});

const genre_update_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if(!errors.isEmpty()){
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedData = await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(updatedData.url);
    }
  }),
];

const genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre ] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary" ).exec(),
  ]);
  // res.json({genre, allBooksByGenre});
  if(genre === null){
    res.redirect("/catalog/genres");
  }
  
  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    genre_books: allBooksByGenre,
  });
});

const genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre ] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  // console.log(req.body);
  if(allBooksByGenre.length > 0){
    res.render("genre_delete", {
      title: "Delete Genre:",
      genre: genre,
      genre_books: allBooksByGenre,
    });
    return;
  } else {
    // console.log(req.body);
    await Genre.findByIdAndDelete(req.body.genre_id);
    res.redirect("/catalog/genres");
  }
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