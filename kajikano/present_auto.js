$('<style>.prt-get-all .btn-get-all{background-position:0 -2200px;width:116px}</style>').appendTo('body');
var btn = $('<button>疯狂一括</button>').appendTo('.prt-get-all');

btn.on('tap',startAutoTapGetAll);

function startAutoTapGetAll(){
	if(!$('#loading').is(':visible')){
		if($('.btn-usual-ok').is(':visible')){
			$('.btn-usual-ok').trigger('tap');
		}else{
			$('.btn-get-all:visible').trigger('tap');
		}
	}
	setTimeout(startAutoTapGetAll,1000);
}