/**
 *
 * This NodeJS application listens to MQTT messages and records them to MongoDB
 *
 * @author  BALAJI S
 * @license FluxAuto
 *
 */
const mongodb = require('mongodb');
const mqtt = require('mqtt');
const config = require('./config');
const express = require('express');
const app = express();
const port = process.env.PORT || 4040;
const mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
const client = mqtt.connect(mqttUri);
var indexRouter = require('./routes/index');

const cors = require('cors');
  
app.use('/', indexRouter);

//enables cors
app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false
    })
  );

  
/*
*Ingesting data based on the topic into mongodb
*/

client.on('connect', function () {
    client.subscribe(config.mqtt.namespace);
  });
  
  var mongoUri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;
  mongodb.MongoClient.connect(mongoUri, function (error, database) {
    console.log('Mongo Connected');
    if (error != null) {
        throw error;
    }
  
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let min = date_ob.getMinutes();
  
    //collection.createIndex({ "topic": 1 });
    client.on('message', function (topic, message) {
        var collection = database.collection(topic);
        
        let time = year + "-" + month + "-" + date+"-"+hour+":"+min;
        
        var messageObject = {
            time: time,
            topic: topic,
            message: JSON.parse(message.toString())
        };
  
        collection.insert(messageObject, function (error, result) {
            if (error != null) {
                console.log("ERROR: " + error);
            }
        });
  
    });
  });
  //=================================================>



app.listen(port, () => console.log(`app listening on port ${port}!`))
