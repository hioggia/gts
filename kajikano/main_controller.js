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
delete console.log;
delete console.warn;

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

	else if(/event\/[\w\d]+\/gacha\//i.test(location.hash)){
		createScriptLoader('event_gacha.js?v=1');
	}

	else if(/present/i.test(location.hash)){
		createScriptLoader('present_auto.js?v=1');
	}
};