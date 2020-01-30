var express = require('express');
var router = express.Router();
const config = require('../config');
var MongoClient = require("mongodb").MongoClient;

var mongoUri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;
MongoClient.connect(mongoUri, (err, db) => {
  if (err) throw err;
    console.log("Mongo Connected in Trip");

/*
*Get list of collections in the DB
*/
router.get("/collections",(req,res)=>{
   const coll = db.listCollections().toArray((err, result)=>{
      if(err)throw err;
      res.json(result)
     })
  })
  /*
*Get list of trip data according to the collection nAME
*/
  router.get("/:id", (req, res) => {
    const tripData = db.collection(req.params.id).find().toArray((err, result)=>{
        if(err) throw err;
        console.log(result)
        res.json(result);
    
       
    });
  });
});


module.exports = router;
