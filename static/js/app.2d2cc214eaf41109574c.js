webpackJsonp([1],{"07W3":function(t,n){},"2Y8q":function(t,n){},"3TDT":function(t,n){},"9M+g":function(t,n){},B7mH:function(t,n){},IVfm:function(t,n){},Jmt5:function(t,n){},NHnr:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("7+uW"),s=e("YnPe"),i={name:"HelloWorld",props:{msg:String},components:{Multipane:s.a,MultipaneResizer:s.b}},r={render:function(){var t=this.$createElement,n=this._self._c||t;return n("multipane",{staticClass:"vertical-panes",attrs:{layout:"vertical",id:"root"}},[n("div",{staticClass:"pane",style:{minWidth:"100px",width:"25%",maxWidth:"200px"}},[n("div",[n("img",{attrs:{id:"profile",src:e("a9a6")}}),this._v(" "),n("b-nav-item",{attrs:{to:"/"}},[this._v("About Me")]),this._v(" "),n("b-nav-item",{attrs:{to:"/blog"}},[this._v("Blogs")])],1)]),this._v(" "),n("multipane-resizer"),this._v(" "),n("div",{staticClass:"pane",style:{flexGrow:1},attrs:{id:"content-pane"}},[n("div",[n("router-view")],1)])],1)},staticRenderFns:[]};var l={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{attrs:{id:"root"}},[n("b-navbar",{attrs:{toggleable:"lg",type:"dark",variant:"info"}},[n("b-navbar-brand",{attrs:{href:"#",id:"title"}},[this._v("Sway007的个人网站\n    ")])],1)],1)},staticRenderFns:[]};var o={name:"app",components:{Base:e("VU/8")(i,r,!1,function(t){e("PBxY"),e("07W3")},"data-v-7e62510f",null).exports,NavBar:e("VU/8")(null,l,!1,function(t){e("2Y8q")},"data-v-191d971a",null).exports}},v={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{attrs:{id:"app"}},[n("nav-bar"),this._v(" "),n("Base",{attrs:{msg:"个人网站"}})],1)},staticRenderFns:[]};var c=e("VU/8")(o,v,!1,function(t){e("3TDT")},null,null).exports,_=e("/ocq"),u={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("footer",[e("div",{attrs:{align:"center"}},[e("a",{attrs:{href:"mailto:yansw007@gmail.com"}},[t._v("yansw007@gmail.com")]),t._v(" or \n    "),e("a",{attrs:{href:"mailto:swayyan007@qq.com"}},[t._v("swayyan007@qq.com")])]),t._v(" "),e("div",{attrs:{align:"center"}},[e("span",[t._v("Powered by")]),t._v(" "),e("a",{attrs:{href:"https://vuejs.org/"}},[t._v("Vue.js")]),t._v(" and "),e("a",{attrs:{href:"https://www.djangoproject.com/"}},[t._v("django")])])])}]};var p={name:"footer",components:{MyFooter:e("VU/8")(null,u,!1,function(t){e("B7mH")},"data-v-28c6606f",null).exports}},d={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"root"}},[t._m(0),t._v(" "),e("hr"),t._v(" "),t._m(1),t._v(" "),e("hr"),t._v(" "),t._m(2),t._v(" "),e("hr"),t._v(" "),e("my-footer")],1)},staticRenderFns:[function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"education"}},[e("h3",[t._v("Education")]),t._v(" "),e("ul",[e("li",[t._v("本科：华中科技大学 "),e("span",{staticClass:"time"},[t._v("(2010.9~2014.7)")]),t._v(" "),e("br"),t._v("\n            数学与统计学院 信息与计算科学系\n            ")]),t._v(" "),e("li",[t._v("硕士：哈尔滨工业大学 "),e("span",{staticClass:"time"},[t._v("(2017.9~2019.7)")]),t._v(" "),e("br"),t._v("\n            计算机科学与工程系 计算机技术专业\n            ")])])])},function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"skills"}},[e("h3",[t._v("Skills")]),t._v(" "),e("ul",[e("li",[e("span",{staticClass:"skill-li"},[t._v("Coding Laguages")]),t._v(": C++, Python, Javascript ")]),t._v(" "),e("li",[e("span",{staticClass:"skill-li"},[t._v("Frameworks")]),t._v(": Cocos2d, Tensorflow, Django, Vue")]),t._v(" "),e("li",[e("span",{staticClass:"skill-li"},[t._v("Others")]),t._v(": Linux, IOS, Regular expression")])])])},function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"working-experience"}},[e("h3",[t._v("Working Experience")]),t._v(" "),e("ul",[e("li",[t._v("深圳市掌中灵科技有限公司 "),e("span",{staticClass:"time"},[t._v("(2014.7~2015.10)")])]),t._v("\n            Cocos2d游戏客户端开发工程师\n            "),e("li",[t._v("广州市游爱网络技术有限公司 "),e("span",{staticClass:"time"},[t._v("(2015.11~2016.3)")])]),t._v("\n            Cocos2d游戏客户端开发工程师\n            "),e("li",[t._v("华为 "),e("span",{staticClass:"note"},[t._v("实习")]),e("span",{staticClass:"time"},[t._v("(2018.4~2018.6)")])]),t._v("\n            骨干路由器部门 软件开发助理工程师\n            "),e("li",[t._v("VIVO "),e("span",{staticClass:"note"},[t._v("实习")]),e("span",{staticClass:"time"},[t._v("(2018.7~2018.9)")])]),t._v("\n            互联网开发部 软件开发助理工程师\n            "),e("li",[t._v("腾讯 "),e("span",{staticClass:"note"},[t._v("实习")]),e("span",{staticClass:"time"},[t._v("(2018.10~2019.1)")])]),t._v("\n            腾讯游戏蓝鲸产品中心 运营开发助理工程师\n        ")])])}]};var f=e("VU/8")(p,d,!1,function(t){e("IVfm")},"data-v-38af8a1b",null).exports,m={render:function(){var t=this.$createElement;return(this._self._c||t)("div",[this._v("\n    Under Construction...\n")])},staticRenderFns:[]},h=e("VU/8")(null,m,!1,null,null,null).exports;a.default.use(_.a);var g=new _.a({routes:[{path:"/",component:f},{path:"/blog",component:h}]}),C=e("e6fC"),b=e.n(C);e("Jmt5"),e("9M+g");a.default.config.productionTip=!1,a.default.use(b.a),new a.default({el:"#app",router:g,components:{App:c},template:"<App/>"})},PBxY:function(t,n){},a9a6:function(t,n,e){t.exports=e.p+"static/img/me.dbff9d9.jpg"}},["NHnr"]);
//# sourceMappingURL=app.2d2cc214eaf41109574c.js.map