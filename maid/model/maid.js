!function(exports){
	var fFashion = 0,
		fFashionMax = 1,
		fPure = 2,
		fPureMax = 3,
		fSexy = 4,
		fSexyMax = 5,
		fTechnic = 6,
		fHealth = 7,
		fExperience = 8,
		fExperienceNext = 9;

	function Maid(parse){
		this._id = 0;
		this._scope = new Array(10);
		this.name = 'NoName';
		this.pic = 0;
		this.wage = 0;
		this.age = 0;
		this.job = 0;
		this._nextRecovery = undefined;
		this.tags = new TagSet();

		if(parse!=undefined){
			this.parse(parse);
		}
	}

	function _valueToRankText(value){
		if(value==0){
			return 'D';
		}
		if(value<10){
			return 'C-';
		}
		if(value<20){
			return 'C';
		}
		if(value<30){
			return 'C+';
		}
		if(value<40){
			return 'B-';
		}
		if(value<50){
			return 'B';
		}
		if(value<60){
			return 'B+';
		}
		if(value<70){
			return 'A-';
		}
		if(value<80){
			return 'A';
		}
		if(value<90){
			return 'A+';
		}
		if(value<100){
			return 'S';
		}
		if(value<110){
			return 'SS';
		}
		return 'SSS';
	}

	Maid.prototype.getValueByElement = function(element){
		switch(element){
			case ELEMENT_FASHION: return this.fashionValue;
			case ELEMENT_PURE: return this.pureValue;
			case ELEMENT_SEXY: return this.sexyValue;
		}
	};

	Maid.prototype.__defineGetter__('fashion',function(){
		return _valueToRankText(this._scope[fFashion]);
	});

	Maid.prototype.__defineGetter__('fashionValue',function(){
		return this._scope[fFashion];
	});

	Maid.prototype.__defineGetter__('fashionMax',function(){
		return this._scope[fFashionMax];
	});

	Maid.prototype.__defineGetter__('pure',function(){
		return _valueToRankText(this._scope[fPure]);
	});

	Maid.prototype.__defineGetter__('pureValue',function(){
		return this._scope[fPure];
	});

	Maid.prototype.__defineGetter__('pureMax',function(){
		return this._scope[fPureMax];
	});

	Maid.prototype.__defineGetter__('sexy',function(){
		return _valueToRankText(this._scope[fSexy]);
	});

	Maid.prototype.__defineGetter__('sexyValue',function(){
		return this._scope[fSexy];
	});

	Maid.prototype.__defineGetter__('sexyMax',function(){
		return this._scope[fSexyMax];
	});

	Maid.prototype.__defineGetter__('element',function(){
		return ['','fashion','pure','sexy'][this.elementValue];
	});

	Maid.prototype.__defineGetter__('elementValue',function(){
		if(this.fashionValue>this.pureValue && this.fashionValue>this.sexyValue){
			return ELEMENT_FASHION;
		}else if(this.pureValue>this.fashionValue && this.pureValue>this.sexyValue){
			return ELEMENT_PURE;
		}else if(this.sexyValue>this.fashionValue && this.sexyValue>this.pureValue){
			return ELEMENT_SEXY;
		}
	});

	Maid.prototype.__defineGetter__('technic',function(){
		return _valueToRankText(this._scope[fTechnic]);
	});

	Maid.prototype.__defineGetter__('technicValue',function(){
		return this._scope[fTechnic];
	});

	Maid.prototype.__defineGetter__('health',function(){
		return _valueToRankText(this._scope[fHealth]);
	});

	Maid.prototype.__defineGetter__('healthValue',function(){
		if(this._nextRecovery!=undefined){
			debulog(this.name,'will recovery at',new Date(this._nextRecovery+1000*60*5));
			var diff = new Date().getTime()-this._nextRecovery;
			var recoveriedPoint = Math.floor(diff/1000/60/5);
			if(this._scope[fHealth]+recoveriedPoint>=100){
				this._scope[fHealth]=100;
				this._nextRecovery=undefined;
			}else{
				this._scope[fHealth]+=recoveriedPoint;
				this._nextRecovery+=recoveriedPoint*1000*60*5;
			}
		}
		return this._scope[fHealth];
	});

	Maid.prototype.__defineGetter__('experience',function(){
		return this._scope[fExperience];
	});

	Maid.prototype.__defineGetter__('experienceNext',function(){
		return this._scope[fExperienceNext];
	});

	Maid.prototype.__defineSetter__('fashionValue',function(v){
		this._scope[fFashion] = Math.min(Math.max(v,0),this._scope[fFashionMax]);
		this._prepareLimit();
	});

	Maid.prototype.__defineSetter__('pureValue',function(v){
		this._scope[fPure] = Math.min(Math.max(v,0),this._scope[fPureMax]);
		this._prepareLimit();
	});

	Maid.prototype.__defineSetter__('sexyValue',function(v){
		this._scope[fSexy] = Math.min(Math.max(v,0),this._scope[fSexyMax]);
		this._prepareLimit();
	});

	Maid.prototype.__defineSetter__('health',function(v){
		this._scope[fHealth] = Math.min(Math.max(v,0),this._scope[fHealth]);
		if(this._scope[fHealth]!=100 && this._nextRecovery==undefined){
			this._nextRecovery = new Date().getTime();
		}
	});

	Maid.prototype.__defineSetter__('experience',function(v){
		this._scope[fExperience] = Math.min(Math.max(v,0),this._scope[fExperienceNext]);
	});

	Maid.prototype.serialize = function(){
		var t = [this._id,this.name,this.pic].concat(this._scope);
		t.push(this.age);
		t.push(this.job);
		t.push(this.tags.serialize());
		return t.join(',');
	}

	Maid.prototype.parse = function(data){
		var t = data.split(','), i = 0;
		this._id = ~~t[i++];
		this.name = t[i++];
		this.pic = t[i++];
		this._scope[fFashion] = ~~t[i++];
		this._scope[fFashionMax] = ~~t[i++];
		this._scope[fPure] = ~~t[i++];
		this._scope[fPureMax] = ~~t[i++];
		this._scope[fSexy] = ~~t[i++];
		this._scope[fSexyMax] = ~~t[i++];
		this._scope[fTechnic] = ~~t[i++];
		this._scope[fHealth] = ~~t[i++];
		this._scope[fExperience] = ~~t[i++];
		this._scope[fExperienceNext] = ~~t[i++];
		this.age = ~~t[i++];
		this.job = ~~t[i++];
		this.tags.parse(t[i++]);
	}

	exports.Maid = Maid;
}(window);