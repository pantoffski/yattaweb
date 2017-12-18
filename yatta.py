import serial
import time
from threading import Thread
from random import randint
import sqlite3
import requests
import json
import hashlib
matAddr = 0x01

def tStamp(): return int(round(time.time() * 1000))


def chkSum(inp):
    uSum = 0
    for b in inp:
        uSum += b
    return ((~uSum) + 1) % 256


def makeCmd(cmd):
    tmp = [0xA0, len(cmd) + 2, matAddr] + cmd
    tmp.append(chkSum(tmp))
    return tmp
    #return serial.to_bytes(tmp)


def makeCmdOld(uBuff):
    tmp = [0xA0, len(uBuff) + 2, matAddr] + uBuff
    uSum = 0
    for b in tmp:
        uSum += b
    uSum = (~uSum) + 1
    tmp.append(uSum % 256)
    return tmp
    #return serial.to_bytes(tmp)


def formatCmd(cmd):
    return " ".join([hex(r).replace('0x', '').zfill(2) for r in cmd])


arr = [0x01, 0x02, 0x03, 0x04, 0x05,0xA0, 0x06, 0x07, 0x08, 0x09]
rxBuff = [0x01, 0x02, 0x03, 0x04, 0x05,0xA0, 0x06, 0x07, 0x08, 0x09,0x01, 0x0A0, 0x03, 0x04, 0x0A0,0x05, 0x02, 0x03, 0x04, 0x05]
print(arr)
toSlice = 0x02 + 1
cmd = arr[:toSlice]
arr = arr[toSlice:]
print(cmd)
print(arr)
print(formatCmd(cmd))
print(makeCmdOld(cmd))
print(makeCmd(cmd))
print("rxb4 {}".format(rxBuff))
print("len(rxBuff) {}".format(len(rxBuff)))
while(len(rxBuff) > 0 and rxBuff[0] != 0xA0):
    print("after trim head {}".format(rxBuff))
    rxBuff = rxBuff[1:]
print("after trim head {}".format(rxBuff))
print(rxBuff[1])
while(len(rxBuff) > 2 and len(rxBuff) >= rxBuff[1]):
    cmdLen = rxBuff[1]
    cmd = rxBuff[:cmdLen]
    rxBuff = rxBuff[cmdLen:]
    print(cmd)

h=hashlib.new('md5')
h.update('haha')
print(h.hexdigest())
h=hashlib.new('md5')
h.update('hoho')
print(h.hexdigest())
h=hashlib.new('md5')
h.update('haha')
print(h.hexdigest())
