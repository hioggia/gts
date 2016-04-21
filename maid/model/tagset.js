!function(exports){
	function TagSet(maxOrParse){
		this.max = 1;
		if(typeof maxOrParse == 'string'){
			this.parse(maxOrParse);
		}else{
			this.max = maxOrParse || 1;
		}
		this._scope = {};
	}

	//code => key*1000+level*10+side
	function _readCode(code){
		if(typeof code!='number'){
			throw '_readCode(code) argument error: not a number!';
			return null;
		}
		//level的值必须大于0
		var key = Math.floor(code/1000),
			side = code%10,
			level = code%1000-side;
		if(level<=0){
			throw '_readCode(code) explanation error: code level must be great than 0';
		}
		return {code:code,key:key,level:level,side:side};
	}

	//插入或更新tag
	TagSet.prototype.addTag = function(code){
		//检查这个tag的key是否已存在
		var tag = _readCode(code);
		if(tag.key in this._scope){
			//key存在，如果为同一个side并且level更大，则更新
			if(this._scope[tag.key].side==tag.side && tag.level>this._scope[tag.key].level){
				this._scope[tag.key] = tag;
			}
		}else{
			//key不存在，如果这个set还有空间，则添加这个tag
			var size = 0;
			for(var key in this._scope){
				size++
			}
			if(size<max){
				this._scope[tag.key] = tag;
			}
		}
	};

	//迭代器iter将收到这样的对象作为参数：tag{code,key,level,side}
	TagSet.prototype.each = function(iter){
		for(var key in this._scope){
			iter(this._scope[key]);
		}
	};

	//返回一个评分，100表示完全匹配，等级每高1评分加1，每低1评分减1，如果不存在，将返回0，如果不在同一个side，则返回的评分为负数
	TagSet.prototype.match = function(code){
		var tag = _readCode(code);
		if(tag.key in this._scope){
			if(tag.side==this._scope[tag.key].side){
				return 100 + this._scope[tag.key].level - tag.level;
			}else{
				return this._scope[tag.key].level + tag.level - 200;
			}
		}
		return 0;
	};

	//将这个set输出为文字
	TagSet.prototype.desc = function(){
		var text = [];
		this.each(function(tag){
			if(tag.code in TAG){
				text.push( TAG[tag.code].text );
			}
		});
		if(text.length==0){
			text.push('无');
		}
		return text.join(',');
	};

	TagSet.prototype.serialize = function(){
		var t = [this.max];
		this.each(function(tag){
			t.push(tag.code);
		});
		return t.join('-');
	};

	TagSet.prototype.parse = function(string){
		var t = string.split('-');
		this.max = ~~t[0]||1;
		for(var i=1;i<t.length;i++){
			this.addTag(~~t[i]);
		}
	};

	exports.TagSet = TagSet;
}(window);