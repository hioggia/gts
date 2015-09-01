var act={};

act[0] = function(){
	location.hash='#quest/supporter/705631/0';
};

act[1] = function(){
	$('.prt-supporter-attribute .btn-supporter').eq(0).trigger('tap');
};

act[2] = function(){
	$('.btn-usual-ok').trigger('tap');
};

act[3] = function(){
	$('.btn-skip').trigger('tap');
};

act[4] = function(){
	$('.btn-usual-ok').trigger('tap');
};

act[5] = function(){
	if($('.enemy-2 .name').html()=='Lv7 ホワイトラビット'){
		$('.enemy-2').trigger('tap');
		$('.btn-ability-available').eq(8).trigger('tap');
		$('.btn-ability-available').eq(8).trigger('tap');
		$('.btn-ability-available').eq(3).trigger('tap');
		$('.btn-ability-available').eq(1).trigger('tap');
		$('.btn-ability-available').eq(3).trigger('tap');
	}
};

act[6] = function(){
	$('.btn-raid-menu').trigger('tap');
	$('.btn-withdrow').trigger('tap');
	$('.btn-usual-ok').trigger('tap');
};