require('dotenv').config();
var md5 = require('md5');
//server
const bodyParser = require('body-parser')
const express = require('express');
const app = express();
// var history = require('connect-history-api-fallback');
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', (process.env.PORT || 5000));
var root = __dirname + '/public';
app.use(express.static('public'));
// app.use(history({
//   rewrites: [{
//     from: /\/foo/,
//     to: '/bar'
//   }]
// }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
server.listen(app.get('port'), function () {
  console.log('listening to ' + process.env.PORT);
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*, content-type");
  next();
});
app.post('/apinaja/addTags', function (req, res) {
  var tags = req.body.tags;
  var stat = req.body.stat;
  console.log(tags);
  if (!Array.isArray(tags)) tags = JSON.parse(tags);
  var hash = md5(JSON.stringify(tags));
  var tag2find = [...new Set(tags.map(t => t[1]))];
  var updatedAt = new Date().getTime();
  var gunTime = 84;
  runnerModel.findByTags(tag2find, function (err, result) {
    var addingTags = result.map(runner => {
      return new Promise((resolve, reject) => {
        var related = tags.filter(t => {
          return t[1] == runner.tagId
        }).sort((a, b) => {
          return (a[0] == b[0]) ? 0 : ((a[0] < b[0] ? -1 : 1))
        });
        runner.updatedAt = updatedAt;
        related.forEach((u, idx) => {
          if (runner['chk' + u[0]] == 0) runner['chk' + u[0]] = u[2];
        });
        runner.save((err, result) => {
          if (err) resolve();
          else resolve(runner.tagId);
        });
      });
    });
    Promise.all(addingTags).then((resolve) => {
      io.emit('tagStat', tags.length + ' tags added. ' + stat);
      res.send(hash + '');
    });
  });
});
app.post('/apinaja/cleanData', function (req, res) {
  console.log('cleanData');
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').find({
      tagId: {
        $ne: null
      }
    }).project({
      bib_number: 1,
      tagId: 1
    }).forEach(r => {
      console.log(r);
      db.collection('runners').update({
        _id: r._id
      }, {
        $set: {
          tagIdd: r.tagId * 1
        }
      });
    });
  });
});
app.post('/apinaja/cleanData4', function (req, res) {
  console.log('cleanData');
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').find({
      tagId: {
        $eq: NaN
      }
    }).project({
      bib_number: 1,
    }).forEach(r => {
      console.log(r);
      db.collection('runners').update({
        _id: r._id
      }, {
        $unset: {
          tagId: 1
        }
      });
    });
  });
});
app.post('/apinaja/cleanData5', function (req, res) {
  console.log('cleanData');
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').updateMany({}, {
      $unset: {
        isDq: 1
      }
    });
  });
});
app.post('/apinaja/cleanData2', function (req, res) {
  console.log('cleanData');
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').updateMany({}, {
      $unset: {
        tagId: 1
      }
    });
  });
});
app.post('/apinaja/cleanData3', function (req, res) {
  console.log('cleanData');
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').updateMany({}, {
      $rename: {
        "tagIdd": "tagId"
      }
    });
  });
});
app.post('/apinaja/resetRace', function (req, res) {
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').updateMany({}, {
      $set: {
        updatedAt: new Date().getTime(),
        chk1: 0,
        chk2: 0,
        chk3: 0
      }
    });
  });
});
//socket io
io.on('connection', function (client) {
  console.log('\n---io.on connection\n\n');
  client.on('joinRace', function (raceName) {
    console.log('raceName from io: x' + raceName + 'x');
    console.log(client.id);
    client.join(raceName);
    // MatLog.find({
    //   raceName: raceName
    // }).exec(function (err, data) {
    //   var ret = [];
    //   for (var i in data) {
    //     ret.push([data[i].matId, data[i].tagId, data[i].tStamp])
    //   }
    //   io.to(raceName).emit('currtags', ret);
    // });
  });
});
//mongo
var mongoose = require('mongoose');
mongoose.connect(process.env.ONG_MONGODB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var runnersSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  bib_number: {
    type: Number,
    index: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  tagId: {
    type: String,
    index: true
  },
  name_on_bib: {
    type: String
  },
  raceCat: {
    type: String
  },
  chk1: {
    type: Number
  },
  chk2: {
    type: Number
  },
  chk3: {
    type: Number,
    index: true
  },
  updatedAt: {
    type: Number,
    index: true
  }
}, {
  _id: false
});
runnersSchema.statics.findByTags = function (tags, cb) {
  return this.find({
    tagId: {
      $in: tags
    }
  }, 'tagId chk1 chk2 chk3 updatedAt', cb);
};
var runnerModel = mongoose.model('runner', runnersSchema);
