webpackJsonp([1],{0:function(t,e,n){n("j1ja"),t.exports=n("bicQ")},"2jmq":function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"howTo"}},[n("h2",[t._v("HowTo")]),t._v(" สมมุติงานวิ่งชื่อ "),n("em",{staticClass:"o"},[t._v("soundRun")]),n("br"),t._v(" ก็เปิด browser ไปที่ https://yattaweb.herokuapp.com/"),n("em",{staticClass:"o"},[t._v("soundRun")]),n("br"),t._v(" ถ้าหลังชื่องานไม่เป็นวงกลมสีเขียวคือ ใช้ net มือถือที่ block socket.io"),n("br"),t._v(" (เหมือนมี True ได้เจ้าเดียว) หรือไม่ก็\r\n  server ล่ม"),n("br"),n("br"),t._v(" "),n("h3",[t._v("post tags")]),t._v(" "),n("em",{staticClass:"r"},[t._v("post")]),t._v(" ไปที่ https://yattaweb.herokuapp.com/"),n("em",{staticClass:"o"},[t._v("soundRun")]),t._v("/addTags"),n("br"),t._v(" postData อยู่ในรูป [[matId,tagId,tStamp],[matId,tagId,tStamp],...]"),n("br"),n("br"),t._v(" เช่น"),n("br"),t._v(" data={'tags': '[[1,1,1000],[1,2,2000]]'}"),n("br"),n("br"),t._v(" "),n("a",{attrs:{href:"test.py",target:"_blank"}},[t._v("(อ้างอิง ตัวอย่าง code python)")]),t._v(" "),n("br"),t._v(" ระบบจะตอบ จำนวน tag ที่ post เข้ามา เช่น data={'tags': '[[1,1,1000],[1,2,2000]]'} จะตอบ "),n("em",{staticClass:"g"},[t._v("2")]),t._v(" ไรงี้\r\n  "),n("h3",[t._v("ลบ tags ทั้งหมดในงานวิ่งนั้นๆ")]),t._v(" "),n("em",{staticClass:"r"},[t._v("post")]),t._v(" ไปที่ https://yattaweb.herokuapp.com/"),n("em",{staticClass:"o"},[t._v("soundRun")]),t._v("/clear"),n("br"),t._v(" postData อยู่ในรูป data={'race': 'กลับทิศชื่องานวิ่ง'}"),n("br"),n("br"),t._v(" เช่น\r\n  "),n("br"),t._v(" post ไปที่ https://yattaweb.herokuapp.com/"),n("em",{staticClass:"o"},[t._v("soundRun")]),t._v("/clear"),n("br"),t._v(" data={'race':'\r\n  "),n("em",{staticClass:"o"},[t._v("nuRdnuos")]),t._v("'} อะไรงี้\r\n  "),n("br"),n("br"),t._v("ลบสำเร็จตอบ "),n("em",{staticClass:"g"},[t._v("ok")]),t._v(", ลบไม่สำเร็จตอบ "),n("em",{staticClass:"g"},[t._v("error")]),t._v(" "),n("br"),t._v(" ก็ไปตั้งชื่องานวิ่งเพื่อ test กันเองตามสะดวกเลย soundRun, poomerRun, icmm2020, ฯลฯ\r\n")])}],s={render:r,staticRenderFns:a};e.a=s},"4vft":function(t,e,n){"use strict";var r=n("NYxO"),a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t};e.a={name:"raceViewer",props:["raceName"],data:function(){return{isUpload:!1}},methods:a({resetData:function(){console.log("resetData"),this.$http.post("/apinaja/resetRace").then(function(t){return console.log(t)})},addTags:function(){console.log("addTags"),this.$http.post("/apinaja/addTags",{stat:"3 tags remain",tags:[[1,1,666],[1,2,1666],[2,4,2666],[1,4,3666],[2,5,4666],[2,6,4666]],foo:"bar"}).then(function(t){var e=t.data,n=t.status;return console.log(e,n)})}},Object(r.b)(["initData","bar"]),{sortByTagIdClass:function(){if(1==this.sortBy)return 1==this.sortDi?"up":"down"},sortByMatIdClass:function(){if(0==this.sortBy)return 1==this.sortDi?"up":"down"},sortBytStampClass:function(){if(2==this.sortBy)return 1==this.sortDi?"up":"down"},sortByMatId:function(){this.$store.commit("sortByMatId")},sortByTagId:function(){this.$store.commit("sortByTagId")},sortBytStamp:function(){this.$store.commit("sortBytStamp")}}),mounted:function(){this.$socket.emit("joinRace",this.raceName)},computed:a({},Object(r.d)({isConnected:function(t){return t.isConnected},tags:function(t){return t.tags},sortBy:function(t){return t.sortBy},sortDi:function(t){return t.di},needInitRaceName:function(t){return t.needInitRaceName}}),Object(r.c)(["sortedTags"])),watch:{needInitRaceName:function(){this.needInitRaceName&&this.$socket.emit("joinRace",this.raceName),this.$store.commit("doneInitRaceName")}},components:{}}},"5yWD":function(t,e){},"9DDJ":function(t,e,n){"use strict";function r(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(a,s){try{var o=e[a](s),i=o.value}catch(t){return void n(t)}if(!o.done)return Promise.resolve(i).then(function(t){r("next",t)},function(t){r("throw",t)});t(i)}return r("next")})}}function a(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var s=n("7+uW"),o=n("NYxO"),i=n("hMcO"),c=n.n(i),u=n("YwQ6");s.a.use(o.a);var d,v=new o.a.Store({state:{isConnected:!1,needInitRaceName:!1,sortBy:2,di:1,updatedAt:0,tags:[]},getters:{sortedTags:function(t){var e=t.sortBy;return t.tags.sort(function(n,r){return n[e]===r[e]?0:n[e]<r[e]?1*t.di:-1*t.di})}},mutations:{SOCKET_CONNECT:function(t,e){t.isConnected=!0,t.needInitRaceName=!0},SOCKET_DISCONNECT:function(t,e){t.isConnected=!1},SOCKET_TAGS:function(t,e){t.tags=[].concat(a(t.tags),a(e))},SOCKET_CLEARTAGS:function(t,e){t.tags=[]},SOCKET_CURRTAGS:function(t,e){t.tags=e},doneInitRaceName:function(t){t.needInitRaceName=!1},sortByMatId:function(t){0!=t.sortBy?(t.sortBy=0,t.di=1):t.di=-1*t.di},sortByTagId:function(t){1!=t.sortBy?(t.sortBy=1,t.di=1):t.di=-1*t.di},sortBytStamp:function(t){2!=t.sortBy?(t.sortBy=2,t.di=1):t.di=-1*t.di}},actions:{initDb:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:d=new u.a("MyDatabase"),d.version(1).stores({runners:"tagId, &bibNo, raceCat, updatedAt"}),d.open().then(function(){return Promise.resolve()}).catch(function(t){alert("error !")});case 3:case"end":return t.stop()}},t,this)}));return t}(),init:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){var n=e.dispatch,r=e.state;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n("initDb");case 2:d.runners.where("updatedAt").above(0).desc().limit(1).each(function(t){t&&(r.updatedAt=t.updatedAt)}).then(function(){return n("initData")});case 3:case"end":return t.stop()}},t,this)}));return t}(),initData:function(t){console.log("initData");var e=[{tagId:73,bibNo:80,bibName:"Lhongg",name:"พีระพจน์ เดียวจิตเจริญ",raceCat:"30m",updatedAt:1513156713285}];d.runners.bulkPut(e).then(function(t){console.log("success ",t)}).catch(function(t){console.log("error ",t)}),d.runners.each(function(t){console.log(t)})},bar:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){var n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("bar",e),t.next=3,d.runners.where("updatedAt").above(0).desc().limit(1);case 3:n=t.sent,console.log("aaaa",n.count()),d.runners.where("bibNo").equals(80).modify({bibName:"Lhong",raceCat:"30m"}),d.runners.get({bibNo:80}).then(function(t){console.log(t)});case 7:case"end":return t.stop()}},t,this)}));return t}()}});s.a.use(c.a,"http://localhost:3000",v),e.a=v},AyOd:function(t,e,n){"use strict";function r(t){n("F4IQ")}var a=n("uEzm"),s=n("2jmq"),o=n("VU/8"),i=r,c=o(a.a,s.a,!1,i,null,null);e.a=c.exports},BTy9:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("router-view")],1)},a=[],s={render:r,staticRenderFns:a};e.a=s},F4IQ:function(t,e){},OzJ6:function(t,e,n){"use strict";var r=n("7+uW"),a=n("/ocq"),s=n("ZuMv"),o=n("AyOd");r.a.use(a.a),e.a=new a.a({mode:"history",base:"/",routes:[{path:"/:raceName/",name:"raceViewer",component:s.a,props:!0},{path:"/",name:"howTo",component:o.a},{path:"*",redirect:"/"}]})},ZuMv:function(t,e,n){"use strict";function r(t){n("5yWD")}var a=n("4vft"),s=n("aC5R"),o=n("VU/8"),i=r,c=o(a.a,s.a,!1,i,null,null);e.a=c.exports},aC5R:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"raceViewer"}},[n("h3",{class:t.isConnected?"connected":""},[t._v("raceName : "+t._s(t.raceName))]),n("br"),t._v(" tags : "+t._s(t.tags.length)+"\r\n  "),n("br"),n("br"),t._v(" "),n("button",{on:{click:t.addTags}},[t._v("addTags")]),t._v(" "),n("button",{on:{click:t.resetData}},[t._v("resetData")]),t._v(" "),n("br"),t._v(" "),n("table",{attrs:{border:"1"}},[n("thead",[n("tr",[n("td",[n("span",{class:t.sortByMatIdClass(),on:{click:t.sortByMatId}},[t._v("matId")])]),t._v(" "),n("td",[n("span",{class:t.sortByTagIdClass(),on:{click:t.sortByTagId}},[t._v("tagId")])]),t._v(" "),n("td",[n("span",{class:t.sortBytStampClass(),on:{click:t.sortBytStamp}},[t._v("tStamp")])])])]),t._v(" "),n("tbody",t._l(t.sortedTags,function(e,r){return n("tr",{key:r},[n("td",[t._v(t._s(e[0]))]),t._v(" "),n("td",[t._v(t._s(e[1]))]),t._v(" "),n("td",[t._v(t._s(e[2]))])])}))])])},a=[],s={render:r,staticRenderFns:a};e.a=s},bicQ:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("mtWM"),a=n.n(r),s=n("7+uW"),o=n("NYxO"),i=n("OzJ6"),c=n("9DDJ"),u=n("creg"),d=n("hMcO");n.n(d);s.a.use(o.a),s.a.prototype.$http=a.a,new s.a({el:"#app",store:c.a,router:i.a,template:"<App/>",sockets:{},components:{App:u.a},created:function(){console.log("app created"),this.$store.dispatch("init")}})},creg:function(t,e,n){"use strict";var r=n("wCqm"),a=n("BTy9"),s=n("VU/8"),o=s(r.a,a.a,!1,null,null,null);e.a=o.exports},uEzm:function(t,e,n){"use strict";e.a={name:"raceViewer"}},wCqm:function(t,e,n){"use strict";n("NYxO");e.a={name:"app",data:function(){return{}},methods:{},computed:{foo:function(){return"bar"}}}}},[0]);
//# sourceMappingURL=main.js.map?125ed567383dfed99d95