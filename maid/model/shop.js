!function(exports){
	function Shop(){
		this._scope = [1,1,3,1,5,5,1,2,1,1,1];
		this.staff = [];
	}

	Shop.prototype.__defineGetter__('waitLevel',function(){
		return this._scope[0];
	});

	Shop.prototype.__defineGetter__('wait',function(){
		return this._scope[0]*this._scope[1]+this._scope[2];
	});

	Shop.prototype.__defineGetter__('serveLevel',function(){
		return this._scope[3];
	});

	Shop.prototype.__defineGetter__('serve',function(){
		return this._scope[3]*this._scope[4]+this._scope[5];
	});

	Shop.prototype.__defineGetter__('serveTime',function(){
		return this._scope[3]*this._scope[6]+this._scope[7];
	});

	Shop.prototype.__defineGetter__('staffRoomLevel',function(){
		return this._scope[8];
	});

	Shop.prototype.__defineGetter__('staffRoomSize',function(){
		return this._scope[8]*this._scope[9]+this._scope[10];
	});

	Shop.prototype.__defineSetter__('waitLevel',function(v){
		this._scope[0]=v;
	});

	Shop.prototype.__defineSetter__('serveLevel',function(v){
		this._scope[3]=v;
	});

	Shop.prototype.__defineSetter__('staffRoomLevel',function(v){
		this._scope[8]=v;
	});

	Shop.prototype.getGainPreSecond = function(city){
		var c = 0;
		for(var i=0;i<this.staff.length;i++){
			var maid = this.staff[i];
			var base = 0;
			switch(maid.element){
				case 'fashion': base=city.f; break;
				case 'pure': base=city.p; break;
				case 'sexy': base=city.s; break;
			}
			c+=Math.floor(city.total*base/100);
		}
		c = Math.min(c,this.wait*60/this.serveTime);
		return Math.floor(c*this.serve/60);
	}

	Shop.prototype.addStaff = function(staff){
		if(this.staff.length<this.staffRoomSize){
			this.staff.push(staff);
		}
	}

	exports.Shop = Shop;
}(window);