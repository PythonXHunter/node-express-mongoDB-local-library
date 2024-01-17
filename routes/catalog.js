const router = require('express').Router();

const book_controller = require('../controllers/bookController');
const bookinstance_controller = require('../controllers/bookinstanceController');
const genre_controller = require('../controllers/genreController');
const author_controller = require('../controllers/authorController');

// Book Routes //

router.get('/', book_controller.index);

router.get('/book/create', book_controller.book_create_get);
router.post('/book/create', book_controller.book_create_post);

router.get('/book/:id/delete', book_controller.book_delete_get);
router.post('/book/:id/delete', book_controller.book_delete_post);

router.get('/book/:id/update', book_controller.book_update_get);
router.post('/book/:id/update', book_controller.book_update_post);

router.get('/books', book_controller.book_list);
router.get('/book/:id', book_controller.book_detail);
