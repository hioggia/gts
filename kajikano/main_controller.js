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
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e=2,f=3,g="",h=" ",i=\'"\',j="#",k="*",l=",",m="-",n="/",o="1",p="3",q="5",r=":",s="=",t="A",u="D",v="F",w="G",x="I",y="J",z="M",A="N",B="O",C="P",D="S",E="T",F="U",G="[",H="]",I="^",J="_",K="a",L="b",M="c",N="d",O="e",P="f",Q="g",R="h",S="i",T="j",U="k",V="l",W="m",X="n",Y="o",Z="p",$="q",_="r",aa="s",ba="t",ca="u",da="v",ea="w",fa="x",ga="y",ha="|",ia=1001,ja=1002,ka=4001,la=7001,ma=7002,na=8001,oa=8002,pa=9001,qa=9002,ra=9003,sa=9004,ta=9005,ua=511,va=3011,wa=5011,xa=10111,ya=20011,za=50101,Aa=60101,Ba=W+K+U+O+t+_+_+K+ga,Ca=T+Y+S+X,Da=function(){return a[Ba](arguments)[Ca](g)},Ea=Da(V,O,X,Q,ba,R),Fa={};Fa[Da(M,Y,X,ba,O,X,ba,E,ga,Z,O)]=Da(K,Z,Z,V,S,M,K,ba,S,Y,X,n,T,aa,Y,X),Fa[Da(N,K,ba,K,E,ga,Z,O)]=Da(T,aa,Y,X),Fa[Da(ba,ga,Z,O)]=Da(C,B,D,E);var Ga=function(d,e){d=d||g,e=e||{},e[Da(ca)]=b[Da(w,K,W,O)][Da(ca,aa,O,_,x,N)];var f=e[Da(Q)]!==c?Da(Q,M,n,Q,M):Da(Y,L,n)+d;Fa[Da(N,K,ba,K)]=b[Da(y,D,B,A)][Da(aa,ba,_,S,X,Q,S,P,ga)](e),Fa[Da(ca,_,V)]=b[Da(w,K,W,O)][Da(L,K,aa,O,F,_,S)]+f,a[Da(K,T,K,fa)](Fa)},Ha=b[Da(aa,O,ba,E,S,W,O,Y,ca,ba)],Ia={},Ja=c,Ka=function(a){if(Ia[a]=(Ia[a]||c)+d,!Ja){Ja=d;var b=va,g={};g[Da(M)]=Ia,g[Da(Q)]=c,a===ja&&Oa.length>c&&(g[Da(Q)]=Oa,Na===e&&(b=c),Na===f&&(b=c)),Ha(function(){Ga(Da(_),g),Ja=c},b)}},La=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[Da(Y,P,P)](d,g),Ka(b))};f[Da(Y,X)](d,g)},Ma=function(a,b,c,d){var e=function(){d()?Ka(a):(a!==ka&&(b+=c),Ha(e,b))};Ha(e,b)};!function(){var a=Da(ba,ga,Z,O),e=Da(ba,K,Z),f=Da(fa),g=Da(ga),i=b[Da(u,K,ba,O)][Da(X,Y,ea)],k=c,l=i();La(ia,Da(j,ea,_,K,Z,Z,O,_),Da(W,Y,ca,aa,O,N,Y,ea,X,h,W,Y,ca,aa,O,ca,Z,h,ba,Y,ca,M,R,aa,ba,K,_,ba,h,ba,Y,ca,M,R,O,X,N,h,ba,K,Z),function(b){return b[a]===e?k=(b[f]||b[g])&&i()-l<wa?c:k+d:l=i(),k>p})}();var Na=c,Oa=[];!function(){var b=Da(ba,ga,Z,O),c=Da(ba,K,Z),g=Da(fa),i=Da(ga),k=Da(ba,K,_,Q,O,ba),l=Da(M,V,K,aa,aa,A,K,W,O),n=10104,o=20206,p=a(Da(j,ea,_,K,Z,Z,O,_)),q=Da(W,Y,ca,aa,O,N,Y,ea,X,h,W,Y,ca,aa,O,ca,Z,h,ba,Y,ca,M,R,aa,ba,K,_,ba,h,ba,Y,ca,M,R,O,X,N,h,ba,K,Z),r=function(a){var h=a[k][l];a[b]===c&&h.match(Da(L,ba,X,m,K,ba,ba,K,M,U,m,aa,ba,K,_,ba,ha,aa,a,m,$,ca,a,aa,ba,m,aa,ba,K,_,ba,ha,L,ba,X,m,a,fa,a,M,ca,ba,a,m,_,a,K,N,ga))&&(Na=h.match(Da(L,ba,X,m,K,ba,ba,K,M,U,m,aa,ba,K,_,ba))?d:h.match(Da(aa,a,m,$,ca,a,aa,ba,m,aa,ba,K,_,ba))?e:f,Oa=[Na,n+a[g],o+a[i]],Ka(ja))};p[Da(Y,X)](q,r)}(),function(){var a=Da(M,_,O,K,ba,O,T,aa),c=Da(E,S,M,U,O,_),d=Da(Q,O,ba,v,C,D),e=Da(p,q);Ma(la,wa,xa,function(){return b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][d]()>e});var f=Da(Q,O,ba,x,X,ba,O,_,da,K,V),g=Da(aa,O,ba,x,X,ba,O,_,da,K,V);Ma(ma,wa,xa,function(){if(b[a]&&b[a][c]&&b[a][c][d]&&b[a][c][f]&&b[a][c][g]){var e=b[a][c][d](),h=b[a][c][f]();b[a][c][g](h+100);var i=!1;return b[a][c][d]()==e&&(i=!0),b[a][c][g](h),i}})}(),function(){var b=Da(aa,M,_,S,Z,ba,G,aa,_,M,I,s,i,M,R,_,Y,W,O,m,O,fa,ba,O,X,aa,S,Y,X,r,n,n,P,Q,Z,Y,U,Z,U,X,O,R,Q,V,M,S,Y,S,T,O,T,P,O,O,L,S,Q,N,X,L,X,Y,U,T,i,H,l,V,S,X,U,G,R,_,O,P,I,s,i,M,R,_,Y,W,O,m,O,fa,ba,O,X,aa,S,Y,X,r,n,n,P,Q,Z,Y,U,Z,U,X,O,R,Q,V,M,S,Y,S,T,O,T,P,O,O,L,S,Q,N,X,L,X,Y,U,T,i,H);Ma(na,xa,Aa,function(){return a(b)[Ea]})}(),function(){var b=Da(G,S,N,I,s,W,U,ba,J,H,l,G,M,V,K,aa,aa,I,s,W,U,ba,J,H);Ma(oa,xa,Aa,function(){return a(b)[Ea]})}(),function(){var b=Da(G,S,N,I,s,Q,L,P,E,Y,Y,V,H);Ma(pa,wa,ya,function(){return a(b)[Ea]})}(),function(){var b=Da(aa,M,_,S,Z,ba,G,S,N,I,s,Q,P,O,J,H);Ma(qa,za,Aa,function(){return a(b)[Ea]})}(),function(){var b=Da(G,S,N,I,s,Q,ca,_,K,L,ca,_,ca,H);Ma(ra,wa,ya,function(){return a(b)[Ea]})}(),function(){var b=Da(aa,M,_,S,Z,ba,G,S,N,I,s,ba,U,O,J,H);Ma(sa,za,Aa,function(){return a(b)[Ea]})}(),function(){var b=Da(S,X,Z,ca,ba,G,S,N,k,s,L,Y,aa,aa,J,W,Y,N,O,J,o,H);Ma(ta,wa,ya,function(){return a(b)[Ea]})}(),function(){var b=Da(S,X,Z,ca,ba,G,S,N,k,s,ba,O,W,Z,Y,_,K,_,ga,J,aa,W,K,V,V,H);Ma(ta,wa,ya,function(){return a(b)[Ea]})}(),function(){var a=(b[Da(z,K,ba,R)][Da(P,V,Y,Y,_)],b[Da(z,K,ba,R)][Da(_,K,X,N,Y,W)],b[Da(V,Y,M,K,ba,S,Y,X)][Da(R,K,aa,R)][Da(aa,Z,V,S,ba)](n)[c]);Ma(ka,ua,c,function(){return a!==Da(N,O,L,ca,Q)})}()});'){
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
				.replace(/,?"(\d{4})"\:\d+/ig,function($1,$2){if($2!=='1002' && $2!=='4001'){g=!0;if(!($2 in warnRecordKeeper)){warnRecordKeeper[$2]=1;alert('你触犯了作弊码'+$2+'，赶紧把其它插件禁用了吧！')}return ''}return $1})
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