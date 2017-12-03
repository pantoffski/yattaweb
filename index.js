require('dotenv').config();
//server
const bodyParser = require('body-parser')
const express = require('express');
const app = express();
var history = require('connect-history-api-fallback');
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', (process.env.PORT || 5000));
var root = __dirname + '/public';
app.use(express.static('public'));
app.use(history({
  rewrites: [{
    from: /\/foo/,
    to: '/bar'
  }]
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
server.listen(app.get('port'), function () {
  console.log('listening to ' + process.env.PORT);
});
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get('/runners/:tStamp', function (req, res) {
  var ret = [];
  runners.find({
    tagId: {
      $nin: ['', null]
    },
    tStamp: {
      $gte: req.params.tStamp
    }
  }).select({
    tagId: 1,
    bib_number: 1,
    name_on_bib: 1,
    first_name: 1,
    last_name: 1,
    tStamp: 1
  }).sort({
    tStamp: -1
  }).exec(function (err, result) {
    for (var i in result) {
      ret.push({
        tagId: result[i].tagId * 1,
        bibNo: result[i].bib_number * 1,
        bibName: result[i].name_on_bib,
        name: result[i].first_name + ' ' + result[i].last_name,
        tStamp: result[i].tStamp
      })
    }
    res.send(ret);
  })
});
app.post('/:raceName/clear', function (req, res) {
  if (req.body.race && req.body.race.split('').reverse().join('') == req.params.raceName) {
    MatLog.find({
      raceName: req.params.raceName
    }).remove().exec(function (err, data) {
      if (err) res.send('error');
      else {
        res.send('ok');
        io.to(req.params.raceName).emit('clearTags');
      }
    });
  } else {
    res.send('error');
  }
})
app.post('/:raceName/addTags', function (req, res) {
  console.log('someone post!');
  var tags = JSON.parse(req.body.tags)[0];
  var tag2save = [];
  for (i in tags) {
    tag = tags[i];
    tag2save.push(new MatLog({
      raceName: req.params.raceName,
      matId: tag[0],
      tagId: tag[1],
      tStamp: tag[2]
    }));
  }
  var addingTags = tag2save.map(tag => {
    return new Promise((resolve, reject) => {
      tag.save((err, result) => {
        if (err) resolve();
        else {
          resolve([
            result.matId,
            result.tagId,
            result.tStamp
          ]);
        }
      });
    });
  });
  Promise.all(addingTags).then((resolve) => {
    resolve = resolve.filter(function (n) {
      return n != undefined
    });
    io.to(req.params.raceName).emit('tags', resolve);
  });
  res.send(tags.length + '');
});
//socket io
io.on('connection', function (client) {
  console.log('\n---io.on connection\n\n');
  client.on('joinRace', function (raceName) {
    console.log('raceName from io: x' + raceName + 'x');
    console.log(client.id);
    client.join(raceName);
    MatLog.find({
      raceName: raceName
    }).exec(function (err, data) {
      var ret = [];
      for (var i in data) {
        ret.push([data[i].matId, data[i].tagId, data[i].tStamp])
      }
      io.to(raceName).emit('currtags', ret);
    });
  });
});
//mongo
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var MatLogSchema = new mongoose.Schema({
  raceName: {
    type: String,
    index: true
  },
  matId: Number,
  tagId: Number,
  tStamp: {
    type: Number,
    index: true
  },
});
MatLogSchema.index({
  raceName: 1,
  matId: 1,
  tagId: 1
}, {
  unique: true
});
MatLogSchema.statics.findTag = function (tagId, cb) {
  return this.find({
    tagId: tagId
  }, {
    select: 'tStamp'
  }, cb);
};
var MatLog = mongoose.model('mat', MatLogSchema);
//mongo ong
var mongoose2 = require('mongoose');
mongoose2.connect(process.env.ONG_MONGODB_URI, {
  useMongoClient: true
});
mongoose2.Promise = global.Promise;
var runnersSchema = new mongoose2.Schema({
  _id: {
    type: String
  },
  bib_number: {
    type: String,
    index: true
  },
  first_name: {
    type: String,
    index: true
  },
  last_name: {
    type: String,
    index: true
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
  tStamp: {
    type: Number,
    index: true
  }
}, {
  _id: false
});
var runners = mongoose2.model('runner', runnersSchema);
console.log('done ja');
