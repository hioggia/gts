!function(exports){
	function Attributes(max,data){
		this.max = max||1;
		this._scope = {};
		if(!!data){
			this.set(data);
		}
	}

	function _getSlotFromKey(key){
		return ~~key-Math.floor(~~key/100)*100;
	}

	function _readCode(code){
		if(typeof code!='number'){
			return null;
		}
		var key = Math.floor(code/100),
			level = code-key*100,
			kind = Math.floor(key/100),
			slot = key-kind*100;
		return {key:key,kind:kind,slot:slot,level:level};
	}

	Attributes.prototype.set = function(max,data){
		this.max = max||1;
		if(data instanceof Array){
			this._scope={};
			for(var i=0;i<data.length;i++){
				if(typeof data[i] == 'number'){
					var attr = _readCode(data[i]);
					this._scope[attr.key] = attr.level;
				}
			}
		}
	}

	Attributes.prototype.add = function(code){
		var attr = _readCode(code);
		if(attr.kind>0){
			if(attr.key in this._scope){
				if(attr.level > this._scope[attr.key]){
					this._scope[attr.key] = attr.level;
				}
			}else{
				var total=this.max;
				for(var key in this._scope){
					if(_getSlotFromKey(key)==attr.slot){
						total=0;
						break;
					}
					total--;
				}
				if(total>0){
					this._scope[attr.key] = attr.level;
				}
			}
		}
	}

	Attributes.prototype.each = function(iter){
		for(var key in this._scope){
			var level = this._scope[key],
				code = key*100+level,
				attr = _readCode(code);
			iter(code,attr);
		}
	}

	Attributes.prototype.matching = function(code){
		var attr = _readCode(code);
		if(attr && attr.key in this._scope){
			return this._scope[attr.key];
		}
		return 0;
	}

	Attributes.prototype.description = function(){
		var text = [];
		for(var key in this._scope){
			var code = key*100+this._scope[key];
			if(code in ATTRIBUTE){
				text.push(ATTRIBUTE[code].text);
			}
		}
		if(text.length==0){
			text.push('无');
		}
		return text.join(',');
	}

	exports.Attributes = Attributes;
}(window);