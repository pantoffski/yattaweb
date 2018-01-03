
import serial
import time
from threading import Thread
#from random import randint
import sqlite3
import requests
import json
import hashlib


def tStamp(): return int(round(time.time() * 1000))


def chkSum(inp):
    uSum = 0
    for b in inp:
        uSum += b
    return ((~uSum) + 1) % 256


def makeCmd(cmd):
    tmp = [0xA0, len(cmd) + 2, matAddr] + cmd
    tmp.append(chkSum(tmp))
    return serial.to_bytes(tmp)


def formatCmd(cmd):
    return " ".join([hex(r).replace('0x', '').zfill(2) for r in cmd])


def save2db(tags):
    print ("adding {} tags".format(len(tags)))
    offset = 100
    while(len(tags) > 0):
        try:
            someTags = tags[:offset]
            #print ("adding {} some tags".format(len(someTags)))
            db = sqlite3.connect(connectionString)
            conn = db.cursor()
            for tag in someTags:
                #print ("{},{},{}".format(tag[0], tag[1], tag[2]))
                conn.execute('insert into tags values(?,?,?)',
                             (tag[0], tag[1], tag[2]))
            db.commit()
            db.close()
            tags = tags[offset:]
        except Exception as e:
            print("save2db !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(e)
            pass
    #print("done save2db")


def postToServer():
    global isRunning
    while(isRunning):
        try:
            db = sqlite3.connect(connectionString)
            conn = db.cursor()
            conn.execute('select count(*) from tags')
            rs = conn.fetchall()
            if(rs[0][0] > 0):
                stat = "matId:{}, remaining {} tags".format(matId, rs[0][0])
                print (stat)
                conn.execute(
                    'select * from tags order by tStamp asc limit 300')
                rs = conn.fetchall()
                db.close()
                # print('db closed')
                tags = json.dumps(rs, separators=(',', ':'))
                tagCount = len(rs)
                h = hashlib.new('md5')
                h.update(tags.encode('utf-8'))
                hashed = h.hexdigest()
                req = requests.post(yattaUrl + '/addTags',
                                    data={'tags': tags, 'stat': stat})
                # print ("srv return {} {}".format(req.text, hashed))
                if(hashed == req.text):
                    # print('start deleting')
                    # print('number matched,del {} tags'.format(tagCount))
                    db = sqlite3.connect(connectionString)
                    conn = db.cursor()
                    for r in rs:
                        conn.execute('delete from tags where matId=? and tagId=?',
                                     (r[0], r[1]))
                    db.commit()
                    db.close()
                    #print('done delete')
            else:
                db.close()
        except Exception as e:
            print ("postToServer !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(e)
            pass


def uartWatchDog():
    global lastBeat, uart, isRunning
    while(isRunning):
        if(tStamp() - lastBeat > 50000):
            uart = serial.Serial('/dev/ttyS0', 115200, timeout=1)
            uart.close()
            uart.open()
            while(not uart.isOpen()):
                pass
            print('uart opened')
            uart.write(resetCmd)
            time.sleep(1)
            # uart.write(powerCmd)
            # time.sleep(1)
            uart.write(freqHighCmd)
            time.sleep(1)
            uart.write(getFreqCmd)
            # time.sleep(2)
            # uart.write(getPowerCmd)
            time.sleep(2)
            uart.write(fastSwitchCmd)
            lastBeat = tStamp()


def readTag():
    global lastBeat, uart, isRunning
    rxBuff = []
    bankIdx = 0
    bank = [[] for i in range(2)]
    save2dbThread = Thread()
    save2dbThread.daemon = True
    tagId = 0
    while(isRunning):
        try:
            if(uart.inWaiting() > 0):
                lastBeat = tStamp()
                rxBuff += uart.read(uart.inWaiting())
            while(len(rxBuff) > 0 and rxBuff[0] != 0xA0):
                rxBuff = rxBuff[1:]
            while(len(rxBuff) > 2 and rxBuff[0] == 0xA0 and len(rxBuff) >= (rxBuff[1] + 2)):
                cmdLen = rxBuff[1] + 2
                cmd = rxBuff[:cmdLen]
                rxBuff = rxBuff[cmdLen:]
                if(chkSum(cmd[:cmdLen - 1]) == cmd[cmdLen - 1]):
                    # old tags // plz del b4 production
                    if(len(cmd) == 21):
                        tagId=(cmd[17] * 256 + cmd[18]) % 5000
                        ts = tStamp()
                        bank[bankIdx].append((matId, tagId, ts))
                    #new tags
                    if(len(cmd) == 11):
                        tagId = int(
                            "".join([hex(r).replace('0x', '').zfill(2) for r in cmd[7:9]]))
                        ts = tStamp()
                        bank[bankIdx].append((matId, tagId, ts))
                    #save tags to sqlite
                    if(len(bank[bankIdx]) > 0 and save2dbThread.isAlive() == False):
                        save2dbThread = Thread(
                            target=save2db, args=(bank[bankIdx],))
                        save2dbThread.daemon = True
                        save2dbThread.start()
                        bankIdx = (bankIdx + 1) % 2
                        bank[bankIdx] = []
                    if(len(cmd) == 12):
                        uart.write(fastSwitchCmd)
        except Exception as e:
            print ("readTag !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(e)
            pass


global lastBeat, isRunning, uart
isRunning = True
lastBeat = 0
matAddr = 0x01
matId = 1
connectionString = "file:tagDb?mode=memory&cache=shared"
yattaUrl = 'https://yattaweb.herokuapp.com/apinaja'
#yattaUrl = 'http://192.168.1.35:3000/apinaja'
stay = 0x01
interval = 0x00
repeat = 0x15
fastSwitchCmd = makeCmd([0x8A, 0x00, stay, 0x03, stay,
                         0x01, stay, 0x02, stay, interval, repeat])
resetCmd = makeCmd([0x70])
getPowerCmd = makeCmd([0x77])
resetCmd = makeCmd([0x70])
powerCmd = makeCmd([0x76, 0x21, 0x20, 0x19, 0x18])
getFreqCmd = makeCmd([0x79])
freqLowCmd = makeCmd([0x78, 0x01, 0x07, 0x11])
freqHighCmd = makeCmd([0x78, 0x01, 0x2B, 0x35])

db = sqlite3.connect(connectionString)
conn = db.cursor()
conn.execute('''drop table if exists tags''')
conn.execute(
    '''create table tags(matId int,tagId int,tStamp int, unique(matId,tagId) on conflict ignore)''')
conn.execute('''create index tStampIdx on tags(tStamp)''')
db.commit()
db.close()
watchDogThread = Thread(target=uartWatchDog)
watchDogThread.daemon = True
watchDogThread.start()
readTagThread = Thread(target=readTag)
readTagThread.daemon = True
readTagThread.start()
postToServerThread = Thread(target=postToServer)
postToServerThread.daemon = True
postToServerThread.start()

try:
    while(1):
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            try:
                inp = int(input("input matId :"))
                if(inp == 0):
                    uart.write(resetCmd)
                    # uart.close()
                    isRunning = False
                    time.sleep(1)
                    raise SystemExit
                if(inp > 0):
                    matId = inp
            except Exception:
                print(sys.exc_info()[0])
                pass
except Exception:
    print(sys.exc_info()[0])
    pass
print('done')
