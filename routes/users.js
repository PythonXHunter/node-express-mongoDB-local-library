const express = require('express');
const router = express.Router();
const Author = require('../models/author');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  // const author = await Author.find({ "first_name":"Patrick" });
  // res.json({author});
  Author.find({ "first_name":"Patrick" })
    .then(author => res.send(author))
    .catch(next);
});

module.exports = router;
