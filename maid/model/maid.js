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

	function Maid(){
		this._scope = new Array(10);
		this.name = 'NoName';
		this.wage = 0;
		this.age = 0;
		this._nextRecovery = undefined;
		this.attribute = new Attributes();

		this._init(Array.prototype.slice.call(arguments,0));
	}

	Maid.prototype._init = function(args){
		if(args.length==1){
			this.load(args[0]);
		}else if(args.length>=13){
			this.name = args[0];
			this._scope = args.slice(1,11);
			this.wage = args[11];
			this.age = args[12];
			if(args[13]!=undefined){
				this.attribute.set(args[13],args.slice(14));
			}
		}else if(args.length==0){
			this._scope = [0,100,0,100,0,100,0,100,0,100];
		}
	}

	Maid.prototype.__defineGetter__('fashion',function(){
		return this._scope[fFashion];
	});

	Maid.prototype.__defineGetter__('fashionMax',function(){
		return this._scope[fFashionMax];
	});

	Maid.prototype.__defineGetter__('pure',function(){
		return this._scope[fPure];
	});

	Maid.prototype.__defineGetter__('pureMax',function(){
		return this._scope[fPureMax];
	});

	Maid.prototype.__defineGetter__('sexy',function(){
		return this._scope[fSexy];
	});

	Maid.prototype.__defineGetter__('sexyMax',function(){
		return this._scope[fSexyMax];
	});

	Maid.prototype.__defineGetter__('element',function(){
		if(this.fashion>this.pure && this.fashion>this.sexy){
			return 'fashion';
		}else if(this.pure>this.fashion && this.pure>this.sexy){
			return 'pure';
		}else if(this.sexy>this.fashion && this.sexy>this.pure){
			return 'sexy';
		}
	});

	Maid.prototype.__defineGetter__('technic',function(){
		return this._scope[fTechnic];
	});

	Maid.prototype.__defineGetter__('health',function(){
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

	Maid.prototype.__defineSetter__('fashion',function(v){
		this._scope[fFashion] = Math.min(Math.max(v,0),this._scope[fFashionMax]);
		this._prepareLimit();
	});

	Maid.prototype.__defineSetter__('pure',function(v){
		this._scope[fPure] = Math.min(Math.max(v,0),this._scope[fPureMax]);
		this._prepareLimit();
	});

	Maid.prototype.__defineSetter__('sexy',function(v){
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

	Maid.prototype._prepareLimit = function(){
		return;
		/*fashion低于50时，sexy最大只能达到80%;fashion为0时，sexy最大只能到达50%*/
		if(this._scope[fFashion]<50){
			this._scope[fSexy] = Math.min(this._scope[fSexy],Math.ceil((this._scope[fFashion]/50*0.3+0.2)*this._scope[fSexyMax]));
		}
		/*sexy大于75时，pure最大只能达到80%;sexy等于100时，pure最大只能达到50%*/
		if(this._scope[fSexyMax]-this._scope[fSexy]<25){
			this._scope[fPure] = Math.min(this._scope[fPure],Math.ceil(((this._scope[fSexyMax]-this._scope[fSexy])/25*0.3+0.5)*this._scope[fPureMax]));
		}
	}

	Maid.prototype.description = function(isBreakLine,lightup){
		var t = [this.name+' '+this.age+'岁'];
		if(isBreakLine){
			t.push('<br />');
		}else{
			t.push(' (');
		}
		if(lightup=='fashion'){t.push('<strong>')}
		t.push('F '+this.fashion);
		if(lightup=='fashion'){t.push('</strong>')}
		t.push('/');
		if(lightup=='pure'){t.push('<strong>')}
		t.push('P '+this.pure);
		if(lightup=='pure'){t.push('</strong>')}
		t.push('/');
		if(lightup=='sexy'){t.push('<strong>')}
		t.push('S '+this.sexy);
		if(lightup=='sexy'){t.push('</strong>')}
		t.push('/T '+this.technic+'/H '+this.health);
		if(!isBreakLine){
			t.push(')');
		}
		return t.join('');
	}

	Maid.prototype.load = function(data){

	}

	Maid.prototype.serialize = function(){

	}

	exports.Maid = Maid;
}(window);