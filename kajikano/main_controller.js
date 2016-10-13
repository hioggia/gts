var host = '',
	mode = 'extensions',
	appURL = '',
	lastHash = '';

var defaultWGConfig = {
	version:1,
	content:{
		kStaminaEnable:{title:"体力回复倒计时","default":true},
		kPokerEnable:{title:"启用扑克助手","default":true},
		kSlotEnable:{title:"启用拉霸助手","default":true},
		kBingoEnable:{title:"启用宾果助手","default":true},
		kBloodEnable:{title:"显示怪物血量","default":true},
		kBlitzEnable:{title:"开启闪电战斗","default":true},
		kWRTEnable:{title:"战斗时间显示到秒","default":true},
		kKBSEnable:{title:"战斗按键支持","default":true},
		kQAREnable:{title:"援助列表刷新","default":true},
		kCoopEnable:{title:"启用共斗助手","default":true}
	}
};

delete window.onerror;
//delete console.log;
//delete console.warn;

if(document.getElementById('wg_script_host')){
	host = document.getElementById('wg_script_host').innerHTML;
	mode = document.getElementById('wg_script_host').dataset.mode;
	appURL = document.getElementById('wg_script_host').dataset.appUrl;
}else{
	console.info('please update your kajikano extensions.');
	//return;
}

if(!('bind' in Function.prototype)){
	Function.prototype.bind = function(ctx){
		var fn = this;
		return function(){
			var args = Array.prototype.slice.call(arguments,1);
			fn.apply(ctx,args);
		}
	}
}

if(!('MutationObserver' in window)){
	window.MutationObserver = function(callback){
		this._callback = callback;
		this._elem = null;
		this._innerHTML = '';
		this._timer = 0;
	};
	MutationObserver.prototype.observe = function(elem,option){
		this._innerHTML = elem.innerHTML;
		this._elem = elem;
		this.polling();
	};
	MutationObserver.prototype.polling = function(){
		var innerHTML = this._elem.innerHTML;
		if(innerHTML != this._innerHTML){
			this._innerHTML = innerHTML;
			this._callback();
		}
		this._timer = setTimeout(this.polling.bind(this),500);
	};
	MutationObserver.prototype.disconnect = function(){
		clearTimeout(this._timer);
		this._elem = null;
		this._innerHTML = '';
	};
}


Game.reportError = function(msg, url, line, column, err, callback){
	createAppTeller('/report/err',JSON.stringify({msg:msg,url:url,line:line,column:column,err:err}));
	console.log(msg, url, line, column, err, callback)
};

var createAppTeller = function(method,data){
	if(mode=='app'){
		var s = document.createElement('script');
		s.src = appURL+method+'/'+data;
		document.body.appendChild(s);
	}
};

var wgModules = {};

var defineWGModule = function(name,context){};

var createScriptLoader = function(file,readySerif){
	console.log('loading '+file+' ...');
	var s = document.createElement('script'), r = ~~(Math.random()*10000);
	if(readySerif==undefined){readySerif='请稍后。'}
	var t = "function mp"+r+"(){\
		var s=document.createElement('script');\
		s.onerror=function(){location.reload()};\
		s.src='"+host+file+"';\
		document.body.appendChild(s)\
	};\
	function sb"+r+"(){\
		if(window.$ && $('#ready').size()>0 && !$('#ready').is(':visible')){\
			setTimeout(mp"+r+",100);\
			console.info('"+readySerif+"')\
		}else{\
			setTimeout(sb"+r+",100)\
		}\
	}sb"+r+"()";
	s.innerHTML = t;
	document.body.appendChild(s);
};

var getWGConfig = function(key){
	var values = localStorage['wg_global_config'];
	if(values){
		values = JSON.parse(values);
		if(key in values){
			return values[key];
		}
	}
	if(key in defaultWGConfig.content){
		return defaultWGConfig.content[key].default;
	}
	console.error('key',key,'is not exist in wgconfig');
	return false;
};

var setWGConfig = function(key,value){
	var values = localStorage['wg_global_config'];
	if(!values){
		values = {};
	}else{
		values = JSON.parse(values);
	}
	values[key] = value;
	localStorage['wg_global_config'] = JSON.stringify(values);
};

var tellWebviewAppSetting = function(){
	var sJson = {};
	for(var key in defaultWGConfig.content){
		//console.log(key);
		sJson[key]={title:defaultWGConfig.content[key].title,value:getWGConfig(key)};
	}
	createAppTeller('/menu/add',JSON.stringify(sJson));
};
if(mode=='app'){
	tellWebviewAppSetting();
}

!function checkAnticheat(){
if(require && require.specified('lib/locallib')){
	var cs=0,addcs=function(){if(++cs>=3){$('body').get(0).dataset.safeguard='safeguard'}}
	require('util/ob'),!function bt(){

		//$.Finger.preventDefault = true;
		//console.info('offing');
		//$('#wrapper').off('mousedown mouseup touchstart touchend tap');
		var es=$._data($('#wrapper').get(0)).events,rs={tap:1,mouseup:2,mousedown:3,touchstart:4,touchend:5},guid=-1,count=0;
		if(!es){
			return setTimeout(bt,200)
		}
		for(var key in es){
			for(var i=0;i<es[key].length;i++){
				if(es[key][i].selector==undefined && es[key][i].origType in rs){
					if(guid===-1){
						guid=es[key][i].guid;
					}else if(guid!==es[key][i].guid){
						continue;
					}
					count++;
					//console.info(es[key][i]);
					var handler=es[key][i].handler;
					es[key][i].handler=function(ev){
						if(ev.type!=='tap'){
							//console.info(ev.type,ev.x,ev.y);
						}
						/*if(ev.type==='tap' && ev.x>0 && ev.y>0){
							handler(ev);
						}*/
						//console.info('hacked');
					}
					//$('#wrapper').off(key,es[key][i].handler);
				}
			}
		}
		//console.info(count);
		if(count!==5){
			setTimeout(bt,200);
		}else{
			console.info('bye 1001');
			addcs();
		}
	}();
	//$('body').off('mousedown mouseup touchstart touchend tap');
	var anticheatPath = 'http://game-a3.granbluefantasy.jp/assets/js/lib/locallib.js';
	anticheatPath = $('[data-requiremodule="lib/locallib"]').attr('src');

	function checkModified(codeText){
		var code = codeText.match(/define\([\'\"]util\/ob[\'\"],[^\n]+/i);
		//console.info(code);
		if(code && code.length>0){
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e=2,f=3,g="",h=" ",i=\'"\',j="#",k="*",l=",",m="-",n="/",o="0",p="1",q="2",r="3",s="4",t="5",u=":",v="=",w="A",x="D",y="F",z="G",A="I",B="J",C="M",D="N",E="O",F="P",G="S",H="T",I="U",J="[",K="]",L="^",M="_",N="a",O="b",P="c",Q="d",R="e",S="f",T="g",U="h",V="i",W="j",X="k",Y="l",Z="m",$="n",_="o",aa="p",ba="q",ca="r",da="s",ea="t",fa="u",ga="v",ha="w",ia="x",ja="y",ka="|",la=1001,ma=1002,na=1003,oa=4001,pa=7001,qa=7002,ra=8001,sa=8002,ta=9001,ua=9002,va=9003,wa=9004,xa=9005,ya=511,za=3011,Aa=5011,Ba=10111,Ca=20011,Da=50101,Ea=60101,Fa=Z+N+X+R+w+ca+ca+N+ja,Ga=W+_+V+$,Ha=function(){return a[Fa](arguments)[Ga](g)},Ia=Ha(Y,R,$,T,ea,U),Ja={};Ja[Ha(P,_,$,ea,R,$,ea,H,ja,aa,R)]=Ha(N,aa,aa,Y,V,P,N,ea,V,_,$,n,W,da,_,$),Ja[Ha(Q,N,ea,N,H,ja,aa,R)]=Ha(W,da,_,$),Ja[Ha(ea,ja,aa,R)]=Ha(F,E,G,H);var Ka=function(d,e){d=d||g,e=e||{},e[Ha(fa)]=b[Ha(z,N,Z,R)][Ha(fa,da,R,ca,A,Q)];var f=e[Ha(T)]!==c?Ha(T,P,n,T,P):Ha(_,O,n)+d;Ja[Ha(Q,N,ea,N)]=b[Ha(B,G,E,D)][Ha(da,ea,ca,V,$,T,V,S,ja)](e),Ja[Ha(fa,ca,Y)]=b[Ha(z,N,Z,R)][Ha(O,N,da,R,I,ca,V)]+f,a[Ha(N,W,N,ia)](Ja)},La=b[Ha(da,R,ea,H,V,Z,R,_,fa,ea)],Ma={},Na=c,Oa=function(a){if(Ma[a]=(Ma[a]||c)+d,!Na){Na=d;var b=za,g={};g[Ha(P)]=Ma,g[Ha(T)]=c,a===ma&&Sa.length>c?(g[Ha(T)]=Sa,Ra===e&&(b=c),Ra===f&&(b=c)):a===na&&Sa.length>c&&(g[Ha(T)]=Sa,b=c),La(function(){Ka(Ha(ca),g),Na=c},b)}},Pa=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[Ha(_,S,S)](d,g),Oa(b))};f[Ha(_,$)](d,g)},Qa=function(a,b,c,d){var e=function(){d()?Oa(a):(a!==oa&&(b+=c),La(e,b))};La(e,b)};!function(){var a=Ha(ea,ja,aa,R),e=Ha(ea,N,aa),f=Ha(ia),g=Ha(ja),i=b[Ha(x,N,ea,R)][Ha($,_,ha)],k=c,l=i();Pa(la,Ha(j,ha,ca,N,aa,aa,R,ca),Ha(Z,_,fa,da,R,Q,_,ha,$,h,Z,_,fa,da,R,fa,aa,h,ea,_,fa,P,U,da,ea,N,ca,ea,h,ea,_,fa,P,U,R,$,Q,h,ea,N,aa),function(b){return b[a]===e?k=(b[f]||b[g])&&i()-l<Aa?c:k+d:l=i(),k>r})}();var Ra=c,Sa=[];!function(){var b=Ha(ea,ja,aa,R),c=Ha(ea,N,aa),g=Ha(ia),i=Ha(ja),k=Ha(ea,N,ca,T,R,ea),l=Ha(P,Y,N,da,da,D,N,Z,R),n=10104,u=20206,v=a(Ha(j,ha,ca,N,aa,aa,R,ca)),w=Ha(Z,_,fa,da,R,Q,_,ha,$,h,Z,_,fa,da,R,fa,aa,h,ea,_,fa,P,U,da,ea,N,ca,ea,h,ea,_,fa,P,U,R,$,Q,h,ea,N,aa),x=function(a){var h=a[k][l];a[b]===c&&(h.match(Ha(O,ea,$,m,N,ea,ea,N,P,X,m,da,ea,N,ca,ea,ka,da,a,m,ba,fa,a,da,ea,m,da,ea,N,ca,ea,ka,O,ea,$,m,a,ia,a,P,fa,ea,a,m,ca,a,N,Q,ja))&&(Ra=h.match(Ha(O,ea,$,m,N,ea,ea,N,P,X,m,da,ea,N,ca,ea))?d:h.match(Ha(da,a,m,ba,fa,a,da,ea,m,da,ea,N,ca,ea))?e:f,Sa=[Ra,n+a[g],u+a[i]],Oa(ma)),h.match(Ha(aa,ca,ea,m,da,ea,N,ca,ea,m,da,U,V,$,a,ka,aa,ca,ea,m,ja,a,da,m,da,U,V,$,a,ka,aa,ca,ea,m,$,_,m,da,U,V,$,a,ka,aa,ca,ea,m,U,V,T,U,m,da,U,V,$,a,ka,aa,ca,ea,m,Y,_,ha,m,da,U,V,$,a,ka,aa,ca,ea,m,_,X,m,da,U,V,$,a))&&(Ra=h.match(Ha(aa,ca,ea,m,da,ea,N,ca,ea,m,da,U,V,$,a))?Ha(p,o):h.match(Ha(aa,ca,ea,m,ja,a,da,m,da,U,V,$,a))?Ha(p,p):h.match(Ha(aa,ca,ea,m,$,_,m,da,U,V,$,a))?Ha(p,q):h.match(Ha(aa,ca,ea,m,U,V,T,U,m,da,U,V,$,a))?Ha(p,r):h.match(Ha(aa,ca,ea,m,Y,_,ha,m,da,U,V,$,a))?Ha(p,s):Ha(p,t),Sa=[Ra,n+a[g],u+a[i]],Oa(na)))};v[Ha(_,$)](w,x)}(),function(){var a=Ha(P,ca,R,N,ea,R,W,da),c=Ha(H,V,P,X,R,ca),d=Ha(T,R,ea,y,F,G),e=Ha(r,t);Qa(pa,Aa,Ba,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e});var f=Ha(T,R,ea,A,$,ea,R,ca,ga,N,Y),g=Ha(da,R,ea,A,$,ea,R,ca,ga,N,Y);Qa(qa,Aa,Ba,function(){if(b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][f]&&b[a][c][g]){var e=b[a][c][d](),h=b[a][c][f]();b[a][c][g](h+100);var i=!1;return b[a][c][d]()==e&&(i=!0),b[a][c][g](h),i}})}(),function(){var b=Ha(da,P,ca,V,aa,ea,J,da,ca,P,L,v,i,P,U,ca,_,Z,R,m,R,ia,ea,R,$,da,V,_,$,u,n,n,S,T,aa,_,X,aa,X,$,R,U,T,Y,P,V,_,V,W,R,W,S,R,R,O,V,T,Q,$,O,$,_,X,W,i,K,l,Y,V,$,X,J,U,ca,R,S,L,v,i,P,U,ca,_,Z,R,m,R,ia,ea,R,$,da,V,_,$,u,n,n,S,T,aa,_,X,aa,X,$,R,U,T,Y,P,V,_,V,W,R,W,S,R,R,O,V,T,Q,$,O,$,_,X,W,i,K);Qa(ra,Ba,Ea,function(){return a(b)[Ia]})}(),function(){var b=Ha(J,V,Q,L,v,Z,X,ea,M,K,l,J,P,Y,N,da,da,L,v,Z,X,ea,M,K);Qa(sa,Ba,Ea,function(){return a(b)[Ia]})}(),function(){var b=Ha(J,V,Q,L,v,T,O,S,H,_,_,Y,K);Qa(ta,Aa,Ca,function(){return a(b)[Ia]})}(),function(){var b=Ha(da,P,ca,V,aa,ea,J,V,Q,L,v,T,S,R,M,K);Qa(ua,Da,Ea,function(){return a(b)[Ia]})}(),function(){var b=Ha(J,V,Q,L,v,T,fa,ca,N,O,fa,ca,fa,K);Qa(va,Aa,Ca,function(){return a(b)[Ia]})}(),function(){var b=Ha(da,P,ca,V,aa,ea,J,V,Q,L,v,ea,X,R,M,K);Qa(wa,Da,Ea,function(){return a(b)[Ia]})}(),function(){var b=Ha(V,$,aa,fa,ea,J,V,Q,k,v,O,_,da,da,M,Z,_,Q,R,M,p,K);Qa(xa,Aa,Ca,function(){return a(b)[Ia]})}(),function(){var b=Ha(V,$,aa,fa,ea,J,V,Q,k,v,ea,R,Z,aa,_,ca,N,ca,ja,M,da,Z,N,Y,Y,K);Qa(xa,Aa,Ca,function(){return a(b)[Ia]})}(),function(){var a=(b[Ha(C,N,ea,U)][Ha(S,Y,_,_,ca)],b[Ha(C,N,ea,U)][Ha(ca,N,$,Q,_,Z)],b[Ha(Y,_,P,N,ea,V,_,$)][Ha(U,N,da,U)][Ha(da,aa,Y,V,ea)](n)[c]);Qa(oa,ya,c,function(){return a!==Ha(Q,R,O,fa,T)})}()});'){
				console.info('ob version safe');
				addcs();
				return;
			}
		}
		alert('官方已更新反作弊代码，请注意！');
		createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'官方已更新反作弊代码，请注意！'}));
		//window.codeText = codeText;
		//define('util/anticheat',["jquery"],function(a){var b=1001,c=7001,d=9001,e=9002,f=5011,g=10111,h=20011,i=30011,j=60101,k={contentType:"application/json",dataType:"json",type:"POST",url:"ob"},l=function(b){var c={u:Game.userId,c:b};k.data=JSON.stringify(c),a.ajax(k)},m=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f.off(d,g),l(b))};f.on(d,g)},n=function(a,b,c,d){var e=function(){d()?l(a):(b+=c,setTimeout(e,b))};setTimeout(e,b)};!function(){var a=0,c=Date.now();m(b,"body","mousedown mouseup touchstart touchend tap",function(b){return"tap"===b.type?a=(b.x||b.y)&&Date.now()-c<f?0:a+1:c=Date.now(),a>3})}(),function(){n(c,g,g,function(){return createjs&&createjs.Ticker&&createjs.Ticker.getFPS&&createjs.Ticker.getFPS()>35})}(),function(){n(d,f,h,function(){return a("[id^=gbfTool]").length})}(),function(){n(e,i,j,function(){return a("script[id^=gfe_]").length})}()});
	}

	var xhr = new XMLHttpRequest();
	xhr.open('get',anticheatPath,true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState===4){
			if(xhr.status===200){
				//console.info(xhr.responseText);
				checkModified(xhr.responseText);
			}else{
				alert('反作弊代码检查失败，请注意！');
				createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'反作弊代码检查失败，请注意！'}));
			}
		}
	};
	xhr.send();

	var warnRecordKeeper={},hookJQueryAjaxBeforeSend = $.ajaxSettings.beforeSend;
	$.ajaxSettings.beforeSend = function(a,b){
		if(/\/ob\/r|\/gc\/gc/.test(b.url)){
			var p=b.url.split('/').splice(3,2).join('/'),
				g=false,
				m=b.data;
			b.data = m
				.replace(/,?"(\d{4})"\:\d+/ig,function($1,$2){if($2!=='1002' && $2!=='1003' && $2!=='4001'){g=!0;if(!($2 in warnRecordKeeper)){warnRecordKeeper[$2]=1;alert('你触犯了作弊码'+$2+'，赶紧把其它插件禁用了吧！')}return ''}return $1})
                .replace('{,','{')
                .replace(',}','}');
            if(g){
            	console.info(p,m,b.data);
            }
		}
		hookJQueryAjaxBeforeSend.call($.ajaxSettings,a,b);
	};
	addcs();
}else{
	setTimeout(checkAnticheat,300);
}
}();

Object.defineProperty(window,'tapEvent',{get:function(){
	return createRangeTapEvent(360,366,146,50);
}});

var createRangeTapEvent = function(x,y,w,h){
	return $.Event('tap',{x:x+Math.round(Math.random()*w),y:y+Math.round(Math.random()*h)});
}

var receiveAppSetupMenu = function(key,value){
	//console.log(key,value);
	setWGConfig(key,value);
};

var destroyers = [], registerRouteChangeDestroyer = function(fn){
	destroyers.push(fn);
}, routeChangedDestroy = function(){
	if(destroyers.length>0){
		var fn = destroyers.shift();
		fn(routeChangedDestroy);
	}else{
		checkLoadModule();
	}
};

var copyTextToClipboard = function(text){
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	var ret = document.execCommand('copy');
	document.body.removeChild(textArea);
	return ret;
};

var routeChanged = function(){
	if(lastHash==location.hash){
		return;
	}
	lastHash = location.hash;
	routeChangedDestroy();
};

var checkLoadModule = function(){
	//console.log(location.hash);
	
	if(/mypage/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/casino\/game\/slot/i.test(location.hash)){
		if(getWGConfig('kSlotEnable')){
			createScriptLoader('casino_slot.js?v=2','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/poker/i.test(location.hash)){
		if(getWGConfig('kPokerEnable')){
			createScriptLoader('casino_poker.js?v=3','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/bingo/i.test(location.hash)){
		if(getWGConfig('kBingoEnable')){
			createScriptLoader('casino_bingo.js?v=1');
		}
	}

	else if(/event\/teamraid\d+\/ranking_guild\/detail/i.test(location.hash) || /event\/teamraid\d+\/ranking\/detail/i.test(location.hash)){
		createScriptLoader('teamraid_ranker.js?v=1');
	}

	else if(/raid\/\d+/i.test(location.hash) || /raid_multi\/\d+/i.test(location.hash) || /raid_semi\/\d+/i.test(location.hash)){
		if(getWGConfig('kBloodEnable')){
			createScriptLoader('monster_hp.js?v=1');
		}
		if(getWGConfig('kBlitzEnable')){
			createScriptLoader('combat_blitz.js?v=1');
		}
		if(getWGConfig('kKBSEnable')){
			createScriptLoader('combat_hotkey.js?v=1');
		}
		if(getWGConfig('kWRTEnable')){
			createScriptLoader('raid_timer.js?v=1');
		}
		createScriptLoader('raid_copy_number.js?v=1');
	}

	else if(/coopraid\/room\/\d+/i.test(location.hash)){
		createScriptLoader('coopraid_copy_number.js');
	}

	else if(/coopraid\/offer/i.test(location.hash)){
		if(getWGConfig('kCoopEnable')){
			createScriptLoader('coopraid_offer.js?v=2');
		}
	}

	else if(/quest\/assist/i.test(location.hash)){
		if(getWGConfig('kQAREnable')){
			//createScriptLoader('quest_assist.js?v=1');
		}
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/index/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/stage/i.test(location.hash)){
		createScriptLoader('quest_stage.js?v=1');
	}

	else if(/event\/teamraid\d+\/top/i.test(location.hash) || /event\/teamraid\d+$/i.test(location.hash)){
		createScriptLoader('teamraid_copy_rival.js?v=1');
	}

	else if(/event\/[\w\d]+\/gacha\//i.test(location.hash)){
		createScriptLoader('event_gacha.js?v=1');
	}

	else if(/present/i.test(location.hash)){
		createScriptLoader('present_auto.js?v=1');
	}
};