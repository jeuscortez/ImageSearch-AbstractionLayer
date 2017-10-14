// server.js
// where your node app starts

// init project
var express = require('express');
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var Bing = require("node-bing-api")({accKey: process.env.BING_KEY});
var searchTerm = require("./models/searchTerm")

app.use(cors());
app.use(bodyParser.json());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/latest/imagesearch',function(req,res){
  
  searchTerm.find({}).sort('-searchDate').exec(function(err, docs){
  res.json(docs);
  });
});

app.get('/api/imagesearch/:searchVal*', function(req,res){
  var searchVal = req.params.searchVal;
  var offset  = req.query.offset;
  
  //console.log(searchVal);
  //console.log(offset);
  
  var data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });
  //save to db collection
  data.save(function(err){
    if(err){
      res.send("Error Saving to DB");
    }
    //res.json(data);
  });
  
  if(offset===undefined){
    offset=1;
  }
  //check if the offset exists
  var searchOffset=0;
  console.log(offset);
  if(offset){
     if(offset==1){
       offset =0;
       searchOffset=1;
     }else
       if(offset>1){
          searchOffset = offset+1;
          }
     }
  
  Bing.images(searchVal, {
    count: (10 * searchOffset),
    offset: (10 * offset)
  }, function(error, rez, body){
    console.log(body);
    var bingArray = [];
    for(var i=0; i<10;i++){
      bingArray.push({
        url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageDisplayUrl
      });
    }
    res.json(bingArray);
  });
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
