require('dotenv').config();
var md5 = require('md5');
//server
const bodyParser = require('body-parser')
const express = require('express');
const app = express();
var history = require('connect-history-api-fallback');
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
app.use(history({
  disableDotRule: true,
  verbose: true
}));
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
  console.log('addingTags ' + tags.length);
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
              if (runner.chk2 == 0) {
                runner.isFakeStart = true;
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
app.post('/apinaja/runnersCountByRaceCat', function (req, res) {
  runnerModel.aggregate({
    $group: {
      _id: '$raceCat',
      count: {
        $sum: 1
      }
    }
  }).exec(function (err, result) {
    console.log(result);
    res.send(result);
  });
});

function findOverall(is_alumni, gender) {
  return new Promise((resolve, reject) => {
    runnerModel.findOverall({
      is_alumni: is_alumni,
      gender: gender
    }, function (err, result) {
      resolve(result[0]);
    });
  });
}

function scoreBoardTxt(runner, gunTime) {
  if (runner == null || runner == undefined) return '';
  var ret = '',
    m, s;
  s = Math.floor((runner.chk2 - gunTime) / 1000);
  s = (s < 0) ? 0 : s;
  m = Math.floor(s / 60);
  s -= m * 60;
  ret += ('00' + m).split('').slice(-2).join('') + ':' + ('00' + s).split('').slice(-2).join('') + ' ';
  ret += (runner.is_alumni == 'yes') ? 'E' : ' ';
  ret += runner.raceCat.slice(0, 2) + '-';
  ret += ('0000' + runner.bib_number).split('').slice(-4).join('') + ' ';
  ret += runner.first_name + ' ' + runner.last_name;
  return ret;
}
app.post('/apinaja/raceResult', async function (req, res) {
  var ret = {},
    sortedRet = {},
    resultOrder = ['overall', '00m', '00f', '25m', '25f', '30m', '30f', '35m', '35f', '40m', '40f', '45m', '45f', '50m', '50f', '55m', '60m'];
  redisClient.get('gunTime', async function (err, t) {
    if (err || typeof t == 'undefined' || !t) {
      res.send('[]');
      return false;
    }
    var gunTime = t * 1;
    var overAll = [],
      overAllTag = [];
    overAll.push(await findOverall('yes', 'm'));
    overAll.push(await findOverall('yes', 'f'));
    overAll.push(await findOverall('no', 'm'));
    overAll.push(await findOverall('no', 'f'));
    overAll = overAll.filter(a => {
      return a !== undefined
    });
    overAllTag = overAll.map(a => a.bib_number);
    if (overAll.length) ret['overall'] = [...overAll.map(a => scoreBoardTxt(a, gunTime)), '', '', '', ''].slice(0, 4);
    runnerModel.aggregate([{
      '$match': {
        '$and': [{
          'chk2': {
            '$nin': [0, null]
          }
        }, {
          'bib_number': {
            '$nin': overAllTag
          }
        }, {
          'raceCat': {
            '$nin': ['xx', null]
          }
        }, {
          'race': 'mini'
        }]
      }
    }, {
      '$sort': {
        'raceCat': 1,
        'chk2': 1
      }
    }, {
      '$group': {
        '_id': '$raceCat',
        'docs': {
          '$push': '$$ROOT'
        }
      }
    }, {
      '$project': {
        'runners': {
          '$slice': ['$docs', 5]
        }
      }
    }]).exec(function (err, result) {
      result.forEach(r => {
        ret[r._id] = [...r.runners.map(a => scoreBoardTxt(a, gunTime)), '', '', '', ''].slice(0, 5);
        //console.log(r);
      });
      resultOrder.forEach(r => {
        if (ret[r]) sortedRet[r] = ret[r]
      });
      res.send(sortedRet);
    });
  });
});
app.post('/apinaja/runnersCountByGender', function (req, res) {
  runnerModel.aggregate([{
    $match: {
      'race': 'mini'
    }
  }, {
    $group: {
      _id: '$gender',
      count: {
        $sum: 1
      }
    }
  }]).exec(function (err, result) {
    console.log(result);
    res.send(result);
  });
});
app.post('/apinaja/getWinner_bak', function (req, res) {
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('error');
      return false;
    }
    db.collection('runners').aggregate([{
      '$match': {
        '$and': [{
          'chk2': {
            '$nin': [0, null]
          }
        }, {
          'raceCat': {
            '$nin': ['xx', null]
          }
        }]
      }
    }, {
      '$sort': {
        'raceCat': 1,
        'chk2': 1
      }
    }, {
      '$group': {
        '_id': '$raceCat',
        'docs': {
          '$push': '$$ROOT'
        }
      }
    }, {
      '$project': {
        'runners': {
          '$slice': ['$docs', 10]
        }
      }
    }]).toArray(function (err, item) {
      console.log(item);
      res.send(item);
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
  var tmp = new Date().getTime();
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
        chk2: tmp + Math.floor(Math.random() * 1000000),
        isFakeStart: false
      }
    });
  });
});
app.post('/apinaja/foo', function (req, res) {
  runnerModel.find({
    raceCat: '20f'
  }).select({
    raceCat:1,race:1,bib_number:1
  }).exec(function (err, result) {
    console.log(result);
    result.map(runner => {
      runner.raceCat='00f';
      runner.save((err, result) => {});
    });
    res.send(result)
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
    isFakeStart: 1,
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
        isFakeStart: result[i].isFakeStart,
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
    isFakeStart: 1,
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
        isFakeStart: result[i].isFakeStart,
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
  gender: {
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
    type: String,
    index: true
  },
  is_alumni: {
    type: String,
    index: true
  },
  chk1: {
    type: Number
  },
  chk2: {
    type: Number,
    index: true
  },
  isFakeStart: {
    type: Boolean
  },
  tag: {
    type: String,
    index: true
  },
  updatedAt: {
    type: Number,
    index: true
  }
}, {
  _id: false
});
runnersSchema.statics.findOverall = function (info, cb) {
  return this.find({
    race: 'mini',
    is_alumni: info.is_alumni,
    gender: info.gender,
    chk2: {
      $nin: [0, null]
    }
  }, 'chk2 first_name last_name bib_number is_alumni raceCat', {
    limit: 1,
    sort: {
      chk2: 1
    }
  }, cb);
};
runnersSchema.statics.findByTags = function (tags, cb) {
  return this.find({
    tagId: {
      $in: tags
    }
  }, 'tagId chk1 chk2 updatedAt', cb);
};
var runnerModel = mongoose.model('runner', runnersSchema);
