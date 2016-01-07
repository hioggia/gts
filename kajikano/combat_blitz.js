(function(){

	var wg_rates = [1,1.2,1.33,1.5,2,5];
	if(localStorage['wg_raid_rate']==undefined){
		localStorage['wg_raid_rate'] = 2;
	}

	function blitz(playtime){
		return playtime/getRate();
	}

	function getRate(){
		var index = ~~localStorage['wg_raid_rate'];
		if(index>=wg_rates.length){
			index=0;
		}
		return wg_rates[index];
	}

	function appbz(){
		if(require && $ && require.specified('lib/raid/motion') && $('.btn-attack-start').size()>0){

			var motion = require('lib/raid/motion');

			var hookWaitAll = motion.mWaitAll;
			motion.mWaitAll = function(a, b) {
				b.playtime = blitz(b.playtime || 5);
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

	        var effect = require('lib/raid/effect');

	        var hookHitEffect = effect.mHitEffect;
	        effect.mHitEffect = function(a, c, d){
	        	//console.log('lib/raid/effect.mHitEffect',d.delay);
	        	return hookHitEffect.call(effect,a,c,d);
	        };

	        var hookEffect = effect.mEffect;
	        effect.mEffect = function(a, c, d){
	        	//console.log('lib/raid/effect.mEffect',d.delay);
	        	return hookEffect.call(effect,a,c,d);
	        };

	        var hookSetFPS = createjs.Ticker.setFPS;
	        createjs.Ticker.setFPS = function(a){
	        	return hookSetFPS(24*getRate());
	        };

	        setTimeout(function(){
		        $('.contents').off('tap','.btn-change-speed');
		        $('.btn-change-speed').removeAttr('fps').addClass('x').html('Blitz +'+localStorage['wg_raid_rate']).on('tap',function(){
		        	var index = ~~localStorage['wg_raid_rate']+1;
		        	if(index>=wg_rates.length){
		        		index=0;
		        	}
		        	localStorage['wg_raid_rate']=index;
		        	$('.btn-change-speed').html('Blitz +'+index);
		        	createjs.Ticker.setFPS();
		        });
		    },3000);
	        createjs.Ticker.setFPS();
	        console.info('闪电战术已启用。');
		}else{
			setTimeout(appbz,1000);
		}
	}

	appbz();

})();