var express = require('express');
var router = express.Router();
const request = require('sync-request');
const userModel = require('../models/users');
const articleModel = require('../models/articles');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Get sources by language
router.get('/sources/:country/:lang', async (req, res) => {

  const raw = await request('GET', `https://newsapi.org/v2/sources?apiKey=${process.env.NEWS_APIKEY}&country=${req.params.country}&language=${req.params.lang}`);
  const data = await JSON.parse(raw.body);
  res.json({ data });
});


// Get articles by source
router.get('/get-articles', async (req, res) => {
  const raw = await request('GET', `https://newsapi.org/v2/top-headlines?sources=${req.query.id}&apiKey=${process.env.NEWS_APIKEY}&pageSize=50`);
  const data = await JSON.parse(raw.body);
  const articles = data.articles;

  res.json({ articles })
});


// Add article to database
router.post('/my-articles', async (req, res) => {
  let result = false;
  const user = await userModel.findOne({ token: req.body.token });
  const checkArticle = await articleModel.findOne({ title: req.body.title });


  if (user && !checkArticle) {
    const newArticle = new articleModel ({
      img: req.body.img,
      title: req.body.title,
      description: req.body.desc,
      content: req.body.content,
      lang: req.body.lang,
      userId: user._id
    });
    const article = await newArticle.save();
    
    if (article.title) {
      result = true;
    }
  }

  res.json({ result })
});


// Delete article from database
router.delete('/my-articles/:token/:title', async (req, res) => {
  let result = false;
  const user = await userModel.findOne({ token: req.params.token });

  if (user) {
    const feedbackDb = await articleModel.deleteOne({ title: req.params.title, userId: user._id });

    if (feedbackDb.deletedCount === 1) {
      result = true;
    }
  }

  res.json({ result })
})


// Get a user's article list
router.get('/my-articles/', async (req, res) => {

  let articles = [];
  const user = await userModel.findOne({ token: req.query.token });

  if (user) {
    // if(req.query.lang !== '') {
    //   articles = await articleModel.find({ userId: user._id, lang: req.query.lang })
    // } else {
      articles = await articleModel.find({ userId: user._id })
    // }
  }

  res.json({ articles })
});


// Get the user's language
router.get('/user-lang', async (req, res) => {

  let lang;
  const user = await userModel.findOne({ token: req.query.token })
  if (user) {
    lang = user.lang;
  }
  res.json({ lang })
});


// Update the user's language
router.post('/user-lang', async (req, res) => {
  let result = false;
  const user = await userModel.updateOne({ token: req.body.token }, { lang: req.body.lang });

  if (user) {
    result = true
  };

  res.json ({ result })
})


module.exports = router;
