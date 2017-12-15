require('dotenv').config();
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
  console.log('addTags');
  if(!Array.isArray(tags))tags=JSON.parse(tags);
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
          if (u[0] == 1) runner.chk1 = u[2];
          if (u[0] == 2) {
            runner.chk2 = u[2];
            if (runner.chk1 == 0) {
              runner.isDq = true;
              runner.chk1 = gunTime;
            }
          }
          if (u[0] == 3) {
            runner.chk3 = u[2];
            if (runner.chk1 == 0) {
              runner.isDq = true;
              runner.chk1 = gunTime;
            }
          }
        });
        runner.save((err, result) => {
          if (err) resolve();
          else resolve(runner.tagId);
        });
      });
    });
    Promise.all(addingTags).then((resolve) => {
      io.emit('tags',1);
      console.log('done add ',tags.length);
      res.send(tags.length + '');
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
        chk3: 0,
        isDq: false
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
  },
  isDq: {
    type: Boolean,
    index: true
  }
}, {
  _id: false
});
runnersSchema.statics.findByTag = function (tagId, cb) {
  return this.findOne({
    tagId: tagId
  }, 'tagId chk1 chk2 chk3 isDq updatedAt', cb);
};
runnersSchema.statics.findByTags = function (tags, cb) {
  return this.find({
    tagId: {
      $in: tags
    }
  }, 'tagId chk1 chk2 chk3 isDq updatedAt', cb);
};
var runnerModel = mongoose.model('runner', runnersSchema);
