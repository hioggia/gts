!function(exports){
	function Customer(){
		this.name = 'NoName';
		this.desc = '...';
		this.pic = 0;
		this.priceValue = 0;
		this.likeValue = 0;//[null,f,p,s];
		this.specValue = {type:0,value:0};//type[null,tag,job,age];
		this.affectValue = {type:0,value:0};//type[null,f,p,s,t,h,tag];
	}

	Customer.prototype.__defineGetter__('price',function(){
		return this.priceValue.toString().replace(/(\d)(?=(\d{3})+($|\.))/g,'$1,');
	});

	Customer.prototype.__defineGetter__('like',function(){
		return ['','时尚','纯洁','性感'][this.likeValue];
	});

	Customer.prototype.__defineGetter__('spec',function(){
		switch(this.specValue.type){
			case SPECTYPE_TAG: return TAG[this.specValue.value].text;
			case SPECTYPE_JOB: return JOB[this.specValue.value].text;
			case SPECTYPE_AGE: return this.specValue.value + '岁';
			default: return '无';
		}
	});

	Customer.prototype.__defineGetter__('affect',function(){
		switch(this.affectValue.type){
			case AFFECTTYPE_FASHION: return '时尚'+(this.affectValue.value>0?'up':'down');
			case AFFECTTYPE_PURE: return '纯洁'+(this.affectValue.value>0?'up':'down');
			case AFFECTTYPE_SEXY: return '性感'+(this.affectValue.value>0?'up':'down');
			case AFFECTTYPE_TECHNIC: return '技术'+(this.affectValue.value>0?'up':'down');
			case AFFECTTYPE_HEALTH: return '健康'+(this.affectValue.value>0?'up':'down');
			case AFFECTTYPE_TAG: return '+'+TAG[this.affectValue.value].text;
			default: return '无';
		}
	});

	exports.Customer = Customer;
}(window);