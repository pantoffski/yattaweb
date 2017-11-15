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
    to: '/index.html'
  }, {
    from: /\/bar/,
    to: 'index.html'
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
app.get('/test', function (req, res) {
  res.send('ok na ja')
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
//MatLog.collection.drop(function (err, foo) {})
// setTimeout(() => {
//   Tag.findTag(1001, function (err, tags) {
//     console.log(tags);
//   })
// }, 500);
console.log('done ja');
