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
	require(['util/ob'],function(){
		$('#wrapper').off('mousedown mouseup touchstart touchend tap');
	});
	//$('body').off('mousedown mouseup touchstart touchend tap');
	var anticheatPath = 'http://game-a3.granbluefantasy.jp/assets/js/lib/locallib.js';
	anticheatPath = $('[data-requiremodule="lib/locallib"]').attr('src');

	function checkModified(codeText){
		var code = codeText.match(/define\([\'\"]util\/ob[\'\"],[^\n]+/i);
		//console.info(code);
		if(code && code.length>0){
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e="",f=" ",g=\'"\',h="#",i=",",j="-",k="/",l="3",m="5",n=":",o="=",p="A",q="D",r="F",s="G",t="I",u="J",v="N",w="O",x="P",y="S",z="T",A="U",B="[",C="]",D="^",E="_",F="a",G="b",H="c",I="d",J="e",K="f",L="g",M="h",N="i",O="j",P="k",Q="l",R="m",S="n",T="o",U="p",V="r",W="s",X="t",Y="u",Z="w",$="x",_="y",aa=1001,ba=7001,ca=8001,da=8002,ea=9001,fa=9002,ga=9003,ha=9004,ia=3011,ja=5011,ka=10111,la=20011,ma=30011,na=60101,oa=R+F+P+J+p+V+V+F+_,pa=O+T+N+S,qa=function(){return a[oa](arguments)[pa](e)},ra=qa(Q,J,S,L,X,M),sa={};sa[qa(H,T,S,X,J,S,X,z,_,U,J)]=qa(F,U,U,Q,N,H,F,X,N,T,S,k,O,W,T,S),sa[qa(I,F,X,F,z,_,U,J)]=qa(O,W,T,S),sa[qa(X,_,U,J)]=qa(x,w,y,z);var ta=function(c,d){c=c||e,d=d||{},d[qa(Y)]=b[qa(s,F,R,J)][qa(Y,W,J,V,t,I)],sa[qa(Y,V,Q)]=b[qa(s,F,R,J)][qa(G,F,W,J,A,V,N)]+qa(T,G,k)+c,sa[qa(I,F,X,F)]=b[qa(u,y,w,v)][qa(W,X,V,N,S,L,N,K,_)](d),a[qa(F,O,F,$)](sa)},ua=b[qa(W,J,X,z,N,R,J,T,Y,X)],va={},wa=c,xa=function(a){va[a]=(va[a]||c)+d,wa||(wa=d,ua(function(){var a={};a[qa(H)]=va,ta(qa(V),a),wa=c},ia))},ya=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[qa(T,K,K)](d,g),xa(b))};f[qa(T,S)](d,g)},za=function(a,b,c,d){var e=function(){d()?xa(a):(b+=c,ua(e,b))};ua(e,b)};!function(){var a=qa(X,_,U,J),e=qa(X,F,U),g=qa($),i=qa(_),j=b[qa(q,F,X,J)][qa(S,T,Z)],k=c,m=j();ya(aa,qa(h,Z,V,F,U,U,J,V),qa(R,T,Y,W,J,I,T,Z,S,f,R,T,Y,W,J,Y,U,f,X,T,Y,H,M,W,X,F,V,X,f,X,T,Y,H,M,J,S,I,f,X,F,U),function(b){return b[a]===e?k=(b[g]||b[i])&&j()-m<ja?c:k+d:m=j(),k>l})}(),function(){var a=qa(H,V,J,F,X,J,O,W),c=qa(z,N,H,P,J,V),d=qa(L,J,X,r,x,y),e=qa(l,m);za(ba,ja,ka,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e})}(),function(){var b=qa(W,H,V,N,U,X,B,W,V,H,D,o,g,H,M,V,T,R,J,j,J,$,X,J,S,W,N,T,S,n,k,k,K,L,U,T,P,U,P,S,J,M,L,Q,H,N,T,N,O,J,O,K,J,J,G,N,L,I,S,G,S,T,P,O,g,C,i,Q,N,S,P,B,M,V,J,K,D,o,g,H,M,V,T,R,J,j,J,$,X,J,S,W,N,T,S,n,k,k,K,L,U,T,P,U,P,S,J,M,L,Q,H,N,T,N,O,J,O,K,J,J,G,N,L,I,S,G,S,T,P,O,g,C);za(ca,ka,na,function(){return a(b)[ra]})}(),function(){var b=qa(B,N,I,D,o,R,P,X,E,C,i,B,H,Q,F,W,W,D,o,R,P,X,E,C);za(da,ka,na,function(){return a(b)[ra]})}(),function(){var b=qa(B,N,I,D,o,L,G,K,z,T,T,Q,C);za(ea,ja,la,function(){return a(b)[ra]})}(),function(){var b=qa(W,H,V,N,U,X,B,N,I,D,o,L,K,J,E,C);za(fa,ma,na,function(){return a(b)[ra]})}(),function(){var b=qa(B,N,I,D,o,L,Y,V,F,G,Y,V,Y,C);za(ga,ja,la,function(){return a(b)[ra]})}(),function(){var b=qa(W,H,V,N,U,X,B,N,I,D,o,X,P,J,E,C);za(ha,ma,na,function(){return a(b)[ra]})}()});'){
				console.info('safe');
				return;
			}
		}
		alert('官方已更新反作弊代码，请注意！');
		createAppTeller('/report/err',JSON.stringify({msg:'官方已更新反作弊代码，请注意！'}));
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
			}
		}
	};
	xhr.send();
}else{
	setTimeout(checkAnticheat,300);
}
}();

var tapTime = Date.now();
!function rmupdate(){
	if('$' in window){
		$('body').on('mousedown mouseup touchstart touchend',function(ev){
			var n=Date.now(),d=n-tapTime;
			console.info(d);
			tapTime=n;
		});
	}else{
		setTimeout(rmupdate,300);
	}
}();
Object.defineProperty(window,'tapEvent',{get:function(){
	/*var n=Date.now(),d=n-tapTime;
	if(d<5011){
		return $.Event('none');
	}*/
	return $.Event('tap',{x:64});
}});

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
	/*textArea.style.position = "fixed";
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = "2em";
	textArea.style.height = "2em";
	textArea.style.padding = 0;
	textArea.style.border = "none";
	textArea.style.outline = "none";
	textArea.style.boxShadow = "none";
	textArea.style.background = "transparent";*/
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