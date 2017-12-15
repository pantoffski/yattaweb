import time
from threading import Thread
from random import randint
import sqlite3
import requests
import json

yattaUrl='https://yattaweb.herokuapp.com/apinaja'
yattaPwd='nuRdnuos'
connectionString = "file:tagDb?mode=memory&cache=shared"
matId = 1


def tStamp(): return int(round(time.time() * 1000))


def save2db(tags):
    print "adding {} tags".format(len(tags))
    db = sqlite3.connect(connectionString)
    conn = db.cursor()
    for tag in tags:
        try:
            #print "{},{},{}".format(tag[0],tag[1],tag[2])
            conn.execute('insert into test values(?,?,?)',
                         (tag[0], tag[1], tag[2]))
        except Exception:
            pass
    db.commit()
    db.close()


def readTag():
    bankIdx = 0
    bank = [[] for i in range(2)]
    save2dbThread = Thread()
    save2dbThread.daemon = True
    tagId = 0
    while(1):
        # tagId = randint(1, 3000)
        tagId += 1
        ts = tStamp()
        if(tagId < 5000):
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
        #time.sleep(0.001349527665)
        time.sleep(0.101349527665)


def postToServer():
    while(1):
        try:
            db = sqlite3.connect(connectionString)
            conn = db.cursor()
            conn.execute('select count(*) from test')
            rs = conn.fetchall()
            print "remaining {} tags".format(rs[0])
            conn.execute('select * from test order by tStamp asc limit 300')
            rs = conn.fetchall()
            tags = json.dumps(rs)
            print(tags)
            if(len(tags) > 0):
                req = requests.post(yattaUrl+'/addTags',
                                    data={'tags': '[[1,1,1],[2,2,2]]'})
                                    #data={'tags': '[' + tags + ']'})
                print req.text
                for r in rs:
                    # print
                    conn.execute('delete from test where matId=? and tagId=?',
                                 (r[0], r[1]))
                db.commit()
                db.close()
        except Exception:
            print "error post to server"
            pass
        #time.sleep(0.5)


# req = requests.post('https://yattaweb.herokuapp.com/icmm2018/clear',
#                     data={'race':'8102mmci'})
# req = requests.post(yattaUrl+'/clear',
#                     data={'race':yattaPwd})
# raise SystemExit
# print req.text
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
    foo = 0
    while(1):
        time.sleep(1)
        foo += 1
        if(foo % 10 == 0):
            print('in main thread')
            matId = matId + 1
            print(matId)
except KeyboardInterrupt:
    print('keyboard interrupt naja')
print('done')
