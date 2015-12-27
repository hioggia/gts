(function(){function tp(s){if($('#pop-captcha').children().size()==0){$(s).trigger('tap')}};
function tz(s){
	var _=$('div',s),__=_.size()-1,___=0;
	_.each(function(i,____){
		___+=~~____.className.split('_')[1]*Math.pow(10,__-i)
	});
	return ___
}
function m(p,g){
	if(new Date().getTime()>=nextStopTime){k(p,g);return}
	if(tz('.prt-medal')<=p || tz('.prt-medal')>=g){console.info('end');return}
	if(tz('.prt-bet')==0){
		ela.html('累计：'+l+'次，成绩：'+a);
		var r=tz('.prt-won');
		o=0,l++,a+=r-b;
		tp('.prt-bet-max');
	}else if(o++>30){
		location.reload()
	}
	setTimeout(m,1000*2)
}
var l=0,a=0,o=0,b=300,ela,nextStopTime;
function k(p,g){
	setTimeout(function(){
		nextStopTime=new Date().getTime()+1000*60*60*2;m(p,g)
	},1000*60*30)
};
function g(){ela=$('<div></div>').appendTo('.prt-controller').css({position:'absolute',top:'100%',left:'0',color:'white'});createjs.Ticker.setFPS(300);nextStopTime=new Date().getTime()+1000*60*60*2;m(1000000,Infinity)}
setTimeout(g,1000*5);})();