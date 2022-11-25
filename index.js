require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const schemaUrl = new mongoose.Schema({ original_url: String, short_url: Number });
const Url = mongoose.model('Url', schemaUrl);


// Your first API endpoint
app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url
  console.log(typeof url)
  if(!url.includes("https://") && !url.includes("http://" )) {
    return res.json({ error: "invalid url"})
  }
  const urlCount = await Url.count() + 1
  const urlCreated = new Url({ original_url: url, short_url: urlCount })
  urlCreated.save()
  return res.json(urlCreated);
});

app.get('/api/shorturl/:shorturl', async (req, res) => {
  const urlObject = await Url.findOne({ short_url: req.params.shorturl })
  console.log(urlObject.original_url)
  return res.redirect(urlObject.original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
