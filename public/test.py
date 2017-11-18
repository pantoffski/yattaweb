import time
from threading import Thread
from random import randint
import sqlite3
import requests
import json

yattaRaceName = 'maiRun'
yattaPwd = yattaRaceName[::-1]
connectionString = "file:tagDb?mode=memory&cache=shared"
matId = 1


def tStamp(): return int(round(time.time() * 1000))


def save2db(tags):
    # print "adding {} tags".format(len(tags))
    doneSave = False
    while(not doneSave):
        try:
            db = sqlite3.connect(connectionString)
            conn = db.cursor()
            for tag in tags:
                conn.execute('insert into test values(?,?,?)',
                             (tag[0], tag[1], tag[2]))
            db.commit()
            db.close()
            doneSave = True
        except Exception:
            print 'addtags errror'
            pass


def readTag():
    bankIdx = 0
    bank = [[] for i in range(2)]
    save2dbThread = Thread()
    save2dbThread.daemon = True
    tagId = 0
    while(1):
        #tagId = randint(1, 3000)
        tagId += 1
        ts = tStamp()
        if(tagId <= 500):
            bank[bankIdx].append((matId, tagId, ts))
            bank[bankIdx].append((matId, tagId, ts + 1))
            bank[bankIdx].append((matId, tagId, ts + 2))
            bank[bankIdx].append((matId, tagId, ts + 3))
            bank[bankIdx].append((matId, tagId, ts + 4))
        if(len(bank[bankIdx]) > 0 and save2dbThread.isAlive() == False):
            save2dbThread = Thread(target=save2db, args=(bank[bankIdx],))
            save2dbThread.daemon = True
            save2dbThread.start()
            bankIdx = (bankIdx + 1) % 2
            bank[bankIdx] = []
        time.sleep(0.001349527665)
        # time.sleep(0.501349527665)


def postToServer():
    while(1):
        try:
            db = sqlite3.connect(connectionString)
            conn = db.cursor()
            conn.execute('select count(*) from test')
            rs = conn.fetchall()
            conn.execute('select * from test order by tStamp asc limit 300')
            rs2 = conn.fetchall()
            tags = json.dumps(rs2)
            sendingTagCount = len(rs2)


            if(sendingTagCount > 0):
                print "sending {} tags, remaining {}    tags".format(sendingTagCount, rs[0][0])
                req = requests.post('https://yattaweb.herokuapp.com/' + yattaRaceName + '/addTags',
                                    data={'tags': '[' + tags + ']'})
                print "server return :: {}".format(req.text)
                if(int(req.text) == sendingTagCount):
                    for r in rs2:
                        # print
                        conn.execute('delete from test where matId=? and tagId=?',
                                     (r[0], r[1]))
                    db.commit()
                    db.close()
        except KeyboardInterrupt:
            print 'postToServer KeyboardInterrupt'
            pass
        except Exception:
            print "error post to server"
            pass
        # time.sleep(0.5)


req = requests.post('https://yattaweb.herokuapp.com/' + yattaRaceName + '/clear',
                    data={'race': yattaPwd})
print req.text

#raise SystemExit
db = sqlite3.connect("file:tagDb?mode=memory&cache=shared")
conn = db.cursor()
conn.execute('''drop table if exists test''')
conn.execute(
    '''create table test(matId int,tagId int,tStamp int, unique(matId,tagId) on conflict ignore)''')
conn.execute('''create index tStampIdx on test(tStamp)''')
db.commit()
db.close()
readTagThread = Thread(target=readTag)
readTagThread.daemon = True
readTagThread.start()
postToServerThread = Thread(target=postToServer)
postToServerThread.daemon = True
postToServerThread.start()

try:
    while(1):
        try:
            while(1):
                time.sleep(1)
        except KeyboardInterrupt:
            try:
                print('keyboard interrupt naja')
                inp = int(input("input matId :"))
                print inp
                if(inp == 0):
                    raise SystemExit
                if(inp > 0):
                    matId = inp
            except Exception:
                pass
except Exception:
    pass
print('done')
