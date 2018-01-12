
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
    global lastBeat, uart, isRunning,antStat
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
                        antStat[cmd[4]%4]='o'
                    if(len(cmd) == 11):
                        antStat[cmd[4]%4]='o'
                    if(len(cmd) == 12):
                        uart.write(fastSwitchCmd)
                    print(antStat)
        except Exception as e:
            print ("readTag !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(e)
            pass


global lastBeat, isRunning, uart, antStat
antStat=['x','x','x','x']
isRunning = True
lastBeat = 0
matAddr = 0x01
matName = 'left'
matId = 1
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

watchDogThread = Thread(target=uartWatchDog)
watchDogThread.daemon = True
watchDogThread.start()
readTagThread = Thread(target=readTag)
readTagThread.daemon = True
readTagThread.start()

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
