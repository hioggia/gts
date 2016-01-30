!function(){

	var tmp = $('<div class="btn-usual-ok"></div>').appendTo('body');
	$('.prt-get-all .btn-get-all').css({
		'background-position': tmp.css('background-position'),
		'width': tmp.css('width')
	});
	tmp.remove();

	var btn = $('<button>疯狂一括</button>').appendTo('.prt-get-all'), k=true, taco=0, taokp=0;
	btn.on('tap',toggleAutoTapGetAll);

	function oneKeyPickup(){$('.btn-get-all:visible').trigger('tap')}
	function safeCheck(){
		if(!$('.prt-get-all .btn-get-all').is(':visible')){
			toggleAutoTapGetAll()
		}
		if($('.prt-3tabs .infinite').is('.active')){
			toggleAutoTapGetAll(true);
		}
	}
	function confirmOk(){
		$('#pop .pop-confirm .btn-usual-ok').trigger('tap');
		$('#pop .pop-confirm-none .btn-usual-ok').trigger('tap');
	}
	function aco(){ confirmOk(); taco=setTimeout(aco,1000); }
	function aokp(){ safeCheck(); oneKeyPickup(); taokp=setTimeout(aokp, 10000) }

	function toggleAutoTapGetAll(forceClose){
		if(forceClose){
			k=false;
		}
		if(k){
			aco();
			aokp();
			btn.text('我想静静');
		}else{
			clearTimeout(taco);
			clearTimeout(taokp);
			btn.text('疯狂一括');
		}
		k=!k;
	}

	registerRouteChangeDestroyer(function(callback){
		clearTimeout(taco);
		clearTimeout(taokp);
		btn.off('tap',toggleAutoTapGetAll);
		callback();
	});

}();