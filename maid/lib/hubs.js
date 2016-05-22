!function(exports){
	var subscribers = {};

	var Hubs = {
		sub: function(channel,handler,priovity){//subscribe
			if(channel in subscribers){
				if(subscribers[channel].indexOf(handler)==-1){
					subscribers[channel].push(handler);
				}
			}else{
				subscribers[channel] = [handler];
			}
		},
		unsub: function(channel,handler){
			if(channel in subscribers){
				var idx = subscribers[channel].indexOf(handler);
				if(idx>-1){
					subscribers[channel].splice(idx,1);
				}
			}
		},
		pub: function(channel,param){//publish
			if(channel in subscribers){
				for(var i=0;i<subscribers[channel].length;i++){
					subscribers[channel][i](param);
				}
			}
		}
	};

	exports.Hubs = Hubs;
}(window);