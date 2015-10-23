function setHp(index){$('.btn-enemy-gauge[target='+ (index+1)+']').html('<span class="wg_hpshow">'+stage.pJsnData.boss.param[index].hp+'/'+stage.pJsnData.boss.param[index].hpmax)}
function setHpAll(){if(window.stage &&stage.pJsnData){for(var l=stage.pJsnData.boss.param.length;l>0;l--){setHp(l-1)}}else{setTimeout(setHpAll,500)}}
function setStyle(){$('<style>.wg_hpshow{position:absolute;color:#f2eee2;text-shadow:0 0 1px #0c320d,0 0 1px #0c320d,0 0 1px #0c320d,0 0 1px #0c320d,0 0 2px #0c320d,0 0 2px #0c320d,0 0 2px #0c320d,0 0 2px #0c320d;font-size:0.7em;bottom:-5px;right:5px;}.wg_bzswch{position:absolute;top:450px;left:-3px;width:36px;height:16px;z-index:20;padding:0;font-size:0.75em;margin:0;border:1px solid #fff;border-radius:3px;background-color:#208820;color:#fff;font-weight:400;outline:none}.wg_bzswch.on{background-color:#ADAD94;}.wg_bzswch::before{content:"闪电中"}.wg_bzswch.on::before{content:"快充电"}.wg_lightup{position:absolute;top:0px;left:0px;z-index:1;width:44px;height:44px;background:#FFF;opacity:0.4;transition:opacity 0.5s ease-out}</style>').appendTo(document.body);}

//var m_bghf = require('lib/raid/display').mBossGaugeHpForLog;
function hpvis(){
	//try{
	if(require && require.specified('lib/raid/display')){
		require('lib/raid/display').mBossGaugeHp = function(a,b,c,d){
			a.call(function(a, b, c) {
		        require('lib/raid/display').mBossGaugeHpForLog(a, b, c);
				setHpAll();
		    },
		    [b, c, d]);
		};

		setStyle();
		setHpAll();
		console.info('血量显示已启用。');
	}else{
		setTimeout(hpvis,1000);
	}
	//}catch(ex){
	//	console.log('hpvis',ex);
	//}
}

var wg_raid_rate = wg_raid_rate || 3;


function blitz(playtime){
	return playtime/wg_raid_rate;
}

function appbz(){
	if(require && $ && require.specified('lib/raid/motion') && $('.btn-attack-start').size()>0){
		var motion = require('lib/raid/motion');

		var hookWaitAll = motion.mWaitAll;
		motion.mWaitAll = function(a, b) {
			b.playtime = blitz(b.playtime || 10);
            return hookWaitAll.call(motion,a,b);
        };
        var hookMoveToInstantry = motion.mMoveToInstantry;
        motion.mMoveToInstantry = function(a, b){
        	b.playtime = blitz(b.playtime || 0);
        	return hookMoveToInstantry.call(motion,a,b);
        };
        var hookMoveTo = motion.mMoveTo;
        motion.mMoveTo = function(b, c, d, e){
        	d.playtime = blitz(d.playtime || 0);
        	return hookMoveTo.call(motion,b,c,d,e);
        };
        var hookChangeMotionAll = motion.mChangeMotionAll;
        motion.mChangeMotionAll = function(b, d, e, f){
        	e.wait = blitz(e.wait || 0);
        	return hookChangeMotionAll.call(motion,b,d,e,f);
        };
        var hookChangeMotion = motion.mChangeMotion;
        motion.mChangeMotion = function(d, e, f){
        	e.delay = blitz(e.delay || 0);
        	return hookChangeMotion.call(motion,d,e,f);
        };
        var hookResetMotion = motion.mResetMotion;
        motion.mResetMotion = function(a, b){
        	b.delay = blitz(b.delay || 0);
        	return hookResetMotion.call(motion,a,b);
        };
        var hookChangeMotionInstantly = motion.mChangeMotionInstantly;
        motion.mChangeMotionInstantly = function(a){
        	a.delay = blitz(a.delay || 0);
        	return hookChangeMotionInstantly.call(motion,a);
        };

        var hookSetFPS = createjs.Ticker.setFPS;
        createjs.Ticker.setFPS = function(a){
        	return hookSetFPS(30*wg_raid_rate);
        };
        var cmd = $('<button class="wg_bzswch"></button>').appendTo('#wrapper');
        if(wg_raid_rate==1){
        	cmd.toggleClass('on');
        }
        cmd.on('tap',function(){
        	cmd.toggleClass('on');
        	wg_raid_rate = 4-wg_raid_rate;
			//console.log('speed rate change to',wg_raid_rate);
        });
		if(!getWGConfig('kBlitzDefault')){
			cmd.addClass('on');
			wg_raid_rate = 1;
		}
        console.info('闪电战术已启用。');
	}else{
		setTimeout(appbz,1000);
	}
}

getWGConfig('kBloodEnable')&&hpvis();
appbz();

function commandToFight(type,cmd1,cmd2,cmd3,cmd4){
	if(type=='attack'){
		$('.btn-attack-start.display-on').trigger('tap');
		$('.btn-result:visible').trigger('tap');
		$('.btn-command-forward:not(.disable)').trigger('tap')
	}else if(type=='ability'){
		//if($('.prt-command .prt-member .invisible').size()==0){return}
		//var chara = ~~$('.prt-command .prt-member .invisible').attr('pos')+1;
		//$('.prt-command .prt-command-chara[pos='+chara+'] .prt-ability-list div:nth-child('+cmd1+').btn-ability-available').trigger('tap');
		$('.prt-command .prt-command-chara:visible .prt-ability-list div:nth-child('+cmd1+').btn-ability-available').trigger('tap');
		var wg_lightUP = $('<div class="wg_lightup"></div>').appendTo('.prt-command .prt-command-chara:visible .prt-ability-list div:nth-child('+cmd1+').btn-ability-available');
		setTimeout(function(){wg_lightUP.css('opacity','0')},50);
		setTimeout(function(){wg_lightUP.remove()},550);
	}else if(type=='character'){
		$('.btn-command-back.display-on').trigger('tap');
		$('.prt-member .btn-command-character:nth-child('+cmd1+')').trigger('tap');
	}else if(type=='next'){
		$('.btn-result').trigger('tap');
	}else if(type=='ougi'){
		$('.btn-lock').trigger('tap');
	}
}

function getPressedCharCode(e){
	if(e.altKey || e.ctrlKey || e.shiftKey || e.metaKey){
		return;
	}
	var targetTag = e.target.tagName.toLowerCase();
	if(targetTag == 'textarea' || targetTag == 'input'){
		return;
	}
	var cmdChar = String.fromCharCode(e.charCode);
	switch(cmdChar){
		case 'a':
		case '工':
		case 'ち':
			commandToFight('attack',cmdChar);
			break;
		/*case '1':
		case '2':
		case '3':
		case '4':
		case '5':
			commandToFight('character',cmdChar);
			break;*/
		case 'q':
		case 'w':
		case 'e':
		case 'r':
		case '金':
		case '人':
		case '月':
		case '白':
		case 'た':
		case 'て':
		case 'い':
		case 'す':
			var cmd = {q:1,w:2,e:3,r:4,金:1,人:2,月:3,白:4,た:1,て:2,い:3,す:4};
			commandToFight('ability',cmd[cmdChar]);
			break;
		/*case 'o':
			commandToFight('ougi',cmdChar);
			break;
		case 'n':
			commandToFight('next',cmdChar);
			break;*/
	}
}

if(getWGConfig('kKBSEnable')){
	document.addEventListener('keypress',getPressedCharCode,false);
}

wgModule = {drop:function(callback){
	document.removeEventListener('keypress',getPressedCharCode,false);
	$('.wg_bzswch').remove();
	delete wgModule;
	callback();
}}