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
	require('util/ob'),!function bt(){
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
						if(ev.type==='tap'){
							console.info(ev.type,ev.x,ev.y);
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
			console.info('hacked!');
		}
	}();
	//$('body').off('mousedown mouseup touchstart touchend tap');
	var anticheatPath = 'http://game-a3.granbluefantasy.jp/assets/js/lib/locallib.js';
	anticheatPath = $('[data-requiremodule="lib/locallib"]').attr('src');

	function checkModified(codeText){
		var code = codeText.match(/define\([\'\"]util\/ob[\'\"],[^\n]+/i);
		//console.info(code);
		if(code && code.length>0){
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e=2,f="",g=" ",h=\'"\',i="#",j="*",k=",",l="-",m="/",n="3",o="5",p=":",q="=",r="A",s="D",t="F",u="G",v="I",w="J",x="M",y="N",z="O",A="P",B="S",C="T",D="U",E="[",F="]",G="^",H="_",I="a",J="b",K="c",L="d",M="e",N="f",O="g",P="h",Q="i",R="j",S="k",T="l",U="m",V="n",W="o",X="p",Y="q",Z="r",$="s",_="t",aa="u",ba="w",ca="x",da="y",ea="|",fa=1001,ga=1002,ha=4001,ia=7001,ja=8001,ka=8002,la=9001,ma=9002,na=9003,oa=9004,pa=9005,qa=3011,ra=5011,sa=10111,ta=20011,ua=30011,va=60101,wa=U+I+S+M+r+Z+Z+I+da,xa=R+W+Q+V,ya=function(){return a[wa](arguments)[xa](f)},za=ya(T,M,V,O,_,P),Aa={};Aa[ya(K,W,V,_,M,V,_,C,da,X,M)]=ya(I,X,X,T,Q,K,I,_,Q,W,V,m,R,$,W,V),Aa[ya(L,I,_,I,C,da,X,M)]=ya(R,$,W,V),Aa[ya(_,da,X,M)]=ya(A,z,B,C);var Ba=function(d,e){d=d||f,e=e||{},e[ya(aa)]=b[ya(u,I,U,M)][ya(aa,$,M,Z,v,L)];var g=e[ya(O)]!==c?ya(O,K,m,O,K):ya(W,J,m)+d;Aa[ya(L,I,_,I)]=b[ya(w,B,z,y)][ya($,_,Z,Q,V,O,Q,N,da)](e),Aa[ya(aa,Z,T)]=b[ya(u,I,U,M)][ya(J,I,$,M,D,Z,Q)]+g,a[ya(I,R,I,ca)](Aa)},Ca=b[ya($,M,_,C,Q,U,M,W,aa,_)],Da={},Ea=c,Fa=function(a){if(Da[a]=(Da[a]||c)+d,!Ea){Ea=d;var b=qa,f={};f[ya(K)]=Da,f[ya(O)]=c,a===ga&&Ja.length>c&&(f[ya(O)]=Ja,Ia===e&&(b=c)),Ca(function(){Ba(ya(Z),f),Ea=c},b)}},Ga=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[ya(W,N,N)](d,g),Fa(b))};f[ya(W,V)](d,g)},Ha=function(a,b,c,d){var e=function(){d()?Fa(a):(a!==ha&&(b+=c),Ca(e,b))};Ca(e,b)};!function(){var a=ya(_,da,X,M),e=ya(_,I,X),f=ya(ca),h=ya(da),j=b[ya(s,I,_,M)][ya(V,W,ba)],k=c,l=j();Ga(fa,ya(i,ba,Z,I,X,X,M,Z),ya(U,W,aa,$,M,L,W,ba,V,g,U,W,aa,$,M,aa,X,g,_,W,aa,K,P,$,_,I,Z,_,g,_,W,aa,K,P,M,V,L,g,_,I,X),function(b){return b[a]===e?k=(b[f]||b[h])&&j()-l<ra?c:k+d:l=j(),k>n})}();var Ia=c,Ja=[];!function(){var b=ya(_,da,X,M),c=ya(_,I,X),f=ya(ca),h=ya(da),j=ya(_,I,Z,O,M,_),k=ya(K,T,I,$,$,y,I,U,M),m=10104,n=20206,o=a(ya(i,ba,Z,I,X,X,M,Z)),p=ya(U,W,aa,$,M,L,W,ba,V,g,U,W,aa,$,M,aa,X,g,_,W,aa,K,P,$,_,I,Z,_,g,_,W,aa,K,P,M,V,L,g,_,I,X),q=function(a){var g=a[j][k];a[b]===c&&g.match(ya(J,_,V,l,I,_,_,I,K,S,l,$,_,I,Z,_,ea,$,a,l,Y,aa,a,$,_,l,$,_,I,Z,_))&&(Ia=g.match(ya(J,_,V,l,I,_,_,I,K,S,l,$,_,I,Z,_))?d:e,Ja=[Ia,m+a[f],n+a[h]],Fa(ga))};o[ya(W,V)](p,q)}(),function(){var a=ya(K,Z,M,I,_,M,R,$),c=ya(C,Q,K,S,M,Z),d=ya(O,M,_,t,A,B),e=ya(n,o);Ha(ia,ra,sa,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e})}(),function(){var b=ya($,K,Z,Q,X,_,E,$,Z,K,G,q,h,K,P,Z,W,U,M,l,M,ca,_,M,V,$,Q,W,V,p,m,m,N,O,X,W,S,X,S,V,M,P,O,T,K,Q,W,Q,R,M,R,N,M,M,J,Q,O,L,V,J,V,W,S,R,h,F,k,T,Q,V,S,E,P,Z,M,N,G,q,h,K,P,Z,W,U,M,l,M,ca,_,M,V,$,Q,W,V,p,m,m,N,O,X,W,S,X,S,V,M,P,O,T,K,Q,W,Q,R,M,R,N,M,M,J,Q,O,L,V,J,V,W,S,R,h,F);Ha(ja,sa,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,U,S,_,H,F,k,E,K,T,I,$,$,G,q,U,S,_,H,F);Ha(ka,sa,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,O,J,N,C,W,W,T,F);Ha(la,ra,ta,function(){return a(b)[za]})}(),function(){var b=ya($,K,Z,Q,X,_,E,Q,L,G,q,O,N,M,H,F);Ha(ma,ua,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,O,aa,Z,I,J,aa,Z,aa,F);Ha(na,ra,ta,function(){return a(b)[za]})}(),function(){var b=ya($,K,Z,Q,X,_,E,Q,L,G,q,_,S,M,H,F);Ha(oa,ua,va,function(){return a(b)[za]})}(),function(){var b=ya(Q,V,X,aa,_,E,Q,L,j,q,_,M,U,X,W,Z,I,Z,da,H,$,U,I,T,T,F);Ha(pa,ra,ta,function(){return a(b)[za]})}(),function(){var a=(b[ya(x,I,_,P)][ya(N,T,W,W,Z)],b[ya(x,I,_,P)][ya(Z,I,V,L,W,U)],b[ya(T,W,K,I,_,Q,W,V)][ya(P,I,$,P)][ya($,X,T,Q,_)](m)[c]);Ha(ha,sa,c,function(){return a!==ya(L,M,J,aa,O)})}()});'){
				console.info('safe');
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
			}
		}
	};
	xhr.send();
}else{
	setTimeout(checkAnticheat,300);
}
}();

Object.defineProperty(window,'tapEvent',{get:function(){
	return $.Event('tap',{x:506-Math.round(Math.random()*146),y:416-Math.round(Math.random()*50)});
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