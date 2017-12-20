require('dotenv').config();
var md5 = require('md5');
//server
const bodyParser = require('body-parser')
const express = require('express');
const app = express();
// var history = require('connect-history-api-fallback');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const redis = require("redis");
console.log('REDISCLOUD_URL', process.env.REDISCLOUD_URL);
redisClient = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});
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
  if (!Array.isArray(tags)) tags = JSON.parse(tags);
  console.log('addingTags '+tags.length);
  //console.log(tags);
  var hash = md5(JSON.stringify(tags));
  var tag2find = [...new Set(tags.map(t => t[1]))];
  var updatedAt = new Date().getTime();
  var gunTime = 0;
  redisClient.get('gunTime', function (err, t) {
    if (err || typeof t == 'undefined' || !t) {
      gunTime = 0;
    } else {
      gunTime = t * 1;
    }
    runnerModel.findByTags(tag2find, function (err, result) {
      if (err || !result) {
        res.send('error');
        return false;
      }
      var addingTags = result.map(runner => {
        return new Promise((resolve, reject) => {
          var related = tags.filter(t => {
            return t[1] == runner.tagId
          }).sort((a, b) => {
            return (a[0] == b[0]) ? 0 : ((a[0] < b[0] ? -1 : 1))
          });
          runner.updatedAt = updatedAt;
          related.forEach((u, idx) => {
            if (u[0] == 1 && runner.chk1 == 0) {
              runner.chk1 = (u[2] < gunTime) ? gunTime : u[2];
            }
            if (u[0] == 2 && runner.chk2 == 0) {
              runner.chk2 = u[2];
            }
            if (u[0] == 3 && runner.chk3 == 0) {
              runner.chk3 = u[2];
              if (runner.chk3 > runner.chk2 && runner.chk2 > runner.chk1 && runner.chk1 > 0 && runner.chk2 > 0 && runner.chk3 > 0) runner.isDq = false;
            }
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
});
app.post('/apinaja/startRace', function (req, res) {
  redisClient.set('gunTime', req.body.gunTime);
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('error');
      return false;
    }
    res.send('ok ' + req.body.gunTime);
    var gunTime = req.body.gunTime * 1;
    db.collection('runners').updateMany({
      $and: [{
        tagId: {
          $nin: ['', null]
        }
      }, {
        chk1: {
          $gt: 0
        }
      }, {
        chk1: {
          $lt: gunTime
        }
      }]
    }, {
      $set: {
        updatedAt: new Date().getTime(),
        chk1: gunTime
      }
    });
  });
});
app.post('/apinaja/getGunTime', function (req, res) {
  redisClient.get('gunTime', function (err, t) {
    if (err || typeof t == 'undefined' || !t) {
      res.send('0');
      return false;
    }
    res.send(t);
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
        chk3: 0,
        isDq: true
      }
    });
  });
});
app.post('/apinaja/runners/:updatedAt', function (req, res) {
  //console.log('here');
  var ret = [];
  runnerModel.find({
    tagId: {
      $nin: ['', null]
    },
    updatedAt: {
      $gte: req.params.updatedAt
    }
  }).select({
    tagId: 1,
    bib_number: 1,
    name_on_bib: 1,
    first_name: 1,
    last_name: 1,
    raceCat: 1,
    chk1: 1,
    chk2: 1,
    chk3: 1,
    isDq: 1,
    updatedAt: 1
  }).sort({
    updatedAt: -1
  }).exec(function (err, result) {
    for (var i in result) {
      ret.push({
        tagId: result[i].tagId * 1,
        bibNo: result[i].bib_number * 1,
        bibName: result[i].name_on_bib,
        name: result[i].first_name + ' ' + result[i].last_name,
        raceCat: result[i].raceCat,
        chk1: result[i].chk1,
        chk2: result[i].chk2,
        chk3: result[i].chk3,
        isDq: result[i].isDq,
        updatedAt: result[i].updatedAt
      })
    }
    res.send(ret);
  });
});
app.post('/apinaja/runnersWithData/:updatedAt', function (req, res) {
  //console.log('here');
  var ret = [];
  runnerModel.find({
    $and: [{
      $or: [{
        chk1: {
          $gt: 0
        }
      }, {
        chk2: {
          $gt: 0
        }
      }, {
        chk3: {
          $gt: 0
        }
      }]
    }, {
      updatedAt: {
        $gte: req.params.updatedAt
      }
    }]
  }).select({
    tagId: 1,
    bib_number: 1,
    name_on_bib: 1,
    first_name: 1,
    last_name: 1,
    raceCat: 1,
    chk1: 1,
    chk2: 1,
    chk3: 1,
    isDq: 1,
    updatedAt: 1
  }).sort({
    updatedAt: -1
  }).exec(function (err, result) {
    for (var i in result) {
      ret.push({
        tagId: result[i].tagId * 1,
        bibNo: result[i].bib_number * 1,
        bibName: result[i].name_on_bib,
        name: result[i].first_name + ' ' + result[i].last_name,
        raceCat: result[i].raceCat,
        chk1: result[i].chk1,
        chk2: result[i].chk2,
        chk3: result[i].chk3,
        isDq: result[i].isDq,
        updatedAt: result[i].updatedAt
      })
    }
    res.send(ret);
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
    type: Number,
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
  isDq: {
    type: Boolean,
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
