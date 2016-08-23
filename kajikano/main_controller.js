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
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e=2,f="",g=" ",h=\'"\',i="#",j="*",k=",",l="-",m="/",n="1",o="3",p="5",q=":",r="=",s="A",t="D",u="F",v="G",w="I",x="J",y="M",z="N",A="O",B="P",C="S",D="T",E="U",F="[",G="]",H="^",I="_",J="a",K="b",L="c",M="d",N="e",O="f",P="g",Q="h",R="i",S="j",T="k",U="l",V="m",W="n",X="o",Y="p",Z="q",$="r",_="s",aa="t",ba="u",ca="w",da="x",ea="y",fa="|",ga=1001,ha=1002,ia=4001,ja=7001,ka=8001,la=8002,ma=9001,na=9002,oa=9003,pa=9004,qa=9005,ra=511,sa=3011,ta=5011,ua=10111,va=20011,wa=50101,xa=60101,ya=V+J+T+N+s+$+$+J+ea,za=S+X+R+W,Aa=function(){return a[ya](arguments)[za](f)},Ba=Aa(U,N,W,P,aa,Q),Ca={};Ca[Aa(L,X,W,aa,N,W,aa,D,ea,Y,N)]=Aa(J,Y,Y,U,R,L,J,aa,R,X,W,m,S,_,X,W),Ca[Aa(M,J,aa,J,D,ea,Y,N)]=Aa(S,_,X,W),Ca[Aa(aa,ea,Y,N)]=Aa(B,A,C,D);var Da=function(d,e){d=d||f,e=e||{},e[Aa(ba)]=b[Aa(v,J,V,N)][Aa(ba,_,N,$,w,M)];var g=e[Aa(P)]!==c?Aa(P,L,m,P,L):Aa(X,K,m)+d;Ca[Aa(M,J,aa,J)]=b[Aa(x,C,A,z)][Aa(_,aa,$,R,W,P,R,O,ea)](e),Ca[Aa(ba,$,U)]=b[Aa(v,J,V,N)][Aa(K,J,_,N,E,$,R)]+g,a[Aa(J,S,J,da)](Ca)},Ea=b[Aa(_,N,aa,D,R,V,N,X,ba,aa)],Fa={},Ga=c,Ha=function(a){if(Fa[a]=(Fa[a]||c)+d,!Ga){Ga=d;var b=sa,f={};f[Aa(L)]=Fa,f[Aa(P)]=c,a===ha&&La.length>c&&(f[Aa(P)]=La,Ka===e&&(b=c)),Ea(function(){Da(Aa($),f),Ga=c},b)}},Ia=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[Aa(X,O,O)](d,g),Ha(b))};f[Aa(X,W)](d,g)},Ja=function(a,b,c,d){var e=function(){d()?Ha(a):(a!==ia&&(b+=c),Ea(e,b))};Ea(e,b)};!function(){var a=Aa(aa,ea,Y,N),e=Aa(aa,J,Y),f=Aa(da),h=Aa(ea),j=b[Aa(t,J,aa,N)][Aa(W,X,ca)],k=c,l=j();Ia(ga,Aa(i,ca,$,J,Y,Y,N,$),Aa(V,X,ba,_,N,M,X,ca,W,g,V,X,ba,_,N,ba,Y,g,aa,X,ba,L,Q,_,aa,J,$,aa,g,aa,X,ba,L,Q,N,W,M,g,aa,J,Y),function(b){return b[a]===e?k=(b[f]||b[h])&&j()-l<ta?c:k+d:l=j(),k>o})}();var Ka=c,La=[];!function(){var b=Aa(aa,ea,Y,N),c=Aa(aa,J,Y),f=Aa(da),h=Aa(ea),j=Aa(aa,J,$,P,N,aa),k=Aa(L,U,J,_,_,z,J,V,N),m=10104,n=20206,o=a(Aa(i,ca,$,J,Y,Y,N,$)),p=Aa(V,X,ba,_,N,M,X,ca,W,g,V,X,ba,_,N,ba,Y,g,aa,X,ba,L,Q,_,aa,J,$,aa,g,aa,X,ba,L,Q,N,W,M,g,aa,J,Y),q=function(a){var g=a[j][k];a[b]===c&&g.match(Aa(K,aa,W,l,J,aa,aa,J,L,T,l,_,aa,J,$,aa,fa,_,a,l,Z,ba,a,_,aa,l,_,aa,J,$,aa))&&(Ka=g.match(Aa(K,aa,W,l,J,aa,aa,J,L,T,l,_,aa,J,$,aa))?d:e,La=[Ka,m+a[f],n+a[h]],Ha(ha))};o[Aa(X,W)](p,q)}(),function(){var a=Aa(L,$,N,J,aa,N,S,_),c=Aa(D,R,L,T,N,$),d=Aa(P,N,aa,u,B,C),e=Aa(o,p);Ja(ja,ta,ua,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e})}(),function(){var b=Aa(_,L,$,R,Y,aa,F,_,$,L,H,r,h,L,Q,$,X,V,N,l,N,da,aa,N,W,_,R,X,W,q,m,m,O,P,Y,X,T,Y,T,W,N,Q,P,U,L,R,X,R,S,N,S,O,N,N,K,R,P,M,W,K,W,X,T,S,h,G,k,U,R,W,T,F,Q,$,N,O,H,r,h,L,Q,$,X,V,N,l,N,da,aa,N,W,_,R,X,W,q,m,m,O,P,Y,X,T,Y,T,W,N,Q,P,U,L,R,X,R,S,N,S,O,N,N,K,R,P,M,W,K,W,X,T,S,h,G);Ja(ka,ua,xa,function(){return a(b)[Ba]})}(),function(){var b=Aa(F,R,M,H,r,V,T,aa,I,G,k,F,L,U,J,_,_,H,r,V,T,aa,I,G);Ja(la,ua,xa,function(){return a(b)[Ba]})}(),function(){var b=Aa(F,R,M,H,r,P,K,O,D,X,X,U,G);Ja(ma,ta,va,function(){return a(b)[Ba]})}(),function(){var b=Aa(_,L,$,R,Y,aa,F,R,M,H,r,P,O,N,I,G);Ja(na,wa,xa,function(){return a(b)[Ba]})}(),function(){var b=Aa(F,R,M,H,r,P,ba,$,J,K,ba,$,ba,G);Ja(oa,ta,va,function(){return a(b)[Ba]})}(),function(){var b=Aa(_,L,$,R,Y,aa,F,R,M,H,r,aa,T,N,I,G);Ja(pa,wa,xa,function(){return a(b)[Ba]})}(),function(){var b=Aa(R,W,Y,ba,aa,F,R,M,j,r,K,X,_,_,I,V,X,M,N,I,n,G);Ja(qa,ta,va,function(){return a(b)[Ba]})}(),function(){var b=Aa(R,W,Y,ba,aa,F,R,M,j,r,aa,N,V,Y,X,$,J,$,ea,I,_,V,J,U,U,G);Ja(qa,ta,va,function(){return a(b)[Ba]})}(),function(){var a=(b[Aa(y,J,aa,Q)][Aa(O,U,X,X,$)],b[Aa(y,J,aa,Q)][Aa($,J,W,M,X,V)],b[Aa(U,X,L,J,aa,R,X,W)][Aa(Q,J,_,Q)][Aa(_,Y,U,R,aa)](m)[c]);Ja(ia,ra,c,function(){return a!==Aa(M,N,K,ba,P)})}()});'){
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

	var warnRecordKeeper={},hookJQueryAjaxBeforeSend = $.ajaxSettings.beforeSend;
	$.ajaxSettings.beforeSend = function(a,b){
		if(/\/ob\/r|\/gc\/gc/.test(b.url)){
			var p=b.url.split('/').splice(3,2).join('/'),
				m=b.data;
			b.data = m
				.replace(/,?"(\d{4})"\:\d+/ig,function($1,$2){if($2!=='1002' && $2!=='4001'){if(!($2 in warnRecordKeeper)){warnRecordKeeper[$2]=1;alert('你触犯了作弊码'+$2+'，赶紧把其它插件禁用了吧！')}return ''}return $1})
                .replace('{,','{')
                .replace(',}','}');
			//console.info(p,m,b.data);
		}
		hookJQueryAjaxBeforeSend.call($.ajaxSettings,a,b);
	};
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