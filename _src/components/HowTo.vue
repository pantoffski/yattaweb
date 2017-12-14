<template>
<div id='howTo'>
  <h2>HowTo</h2> สมมุติงานวิ่งชื่อ <em class='o'>soundRun</em><br/> ก็เปิด browser ไปที่ https://yattaweb.herokuapp.com/<em class='o'>soundRun</em><br/> ถ้าหลังชื่องานไม่เป็นวงกลมสีเขียวคือ ใช้ net มือถือที่ block socket.io<br/> (เหมือนมี True ได้เจ้าเดียว) หรือไม่ก็
  server ล่ม<br/><br/>
  <h3>post tags</h3>
  <em class='r'>post</em> ไปที่ https://yattaweb.herokuapp.com/<em class='o'>soundRun</em>/addTags<br/> postData อยู่ในรูป [[matId,tagId,tStamp],[matId,tagId,tStamp],...]<br/><br/> เช่น<br/> data={'tags': '[[1,1,1000],[1,2,2000]]'}<br/><br/>
  <a href='test.py' target='_blank'>(อ้างอิง ตัวอย่าง code python)</a>
  <br/> ระบบจะตอบ จำนวน tag ที่ post เข้ามา เช่น data={'tags': '[[1,1,1000],[1,2,2000]]'} จะตอบ <em class='g'>2</em> ไรงี้
  <h3>ลบ tags ทั้งหมดในงานวิ่งนั้นๆ</h3>
  <em class='r'>post</em> ไปที่ https://yattaweb.herokuapp.com/<em class='o'>soundRun</em>/clear<br/> postData อยู่ในรูป data={'race': 'กลับทิศชื่องานวิ่ง'}<br/><br/> เช่น
  <br/> post ไปที่ https://yattaweb.herokuapp.com/<em class='o'>soundRun</em>/clear<br/> data={'race':'
  <em class='o'>nuRdnuos</em>'} อะไรงี้
  <br/><br/>ลบสำเร็จตอบ <em class='g'>ok</em>, ลบไม่สำเร็จตอบ <em class='g'>error</em>
  <br/> ก็ไปตั้งชื่องานวิ่งเพื่อ test กันเองตามสะดวกเลย soundRun, poomerRun, icmm2020, ฯลฯ
</div>
</template>
<style lang="less">
#howTo {
    font-family: monospace;
    font-size: 18px;
    h3 {
        text-decoration: underline;
    }
    .o {
        color: salmon;
    }
    .r {
        color: firebrick;
    }
    .g {
        color: steelblue;
        text-shadow: 0px 0px 2px cornflowerblue;
    }
}
</style>
<script>
export default {
  name: 'raceViewer'
}
</script>
