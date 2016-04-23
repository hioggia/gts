!function(exports){
	var Guide = {
		start: function(sce){
			guideLayer = document.createElement('div');
			guideLayer.id = 'guide';
			guideLayer.innerHTML = '<div class="lightup"></div><span class="desc"></span><div class="tour"><i></i><div></div></div><div class="area"></div>';
			guideLayer.style.height = document.body.scrollHeight +'px';
			document.body.appendChild(guideLayer);
			guideLayer.querySelector('.area').addEventListener('touchend',areaTouched,false);
			scenario = sce;
			nextStep();
		},
		end: function(){
			document.body.removeChild(guideLayer);
		}
	};

	var guideLayer,scenario=[];

	function areaTouched(){
		guideLayer.querySelector('.area').style.display = '';
		nextStep();
	}

	function nextStep(){
		if(scenario.length==0){
			console.log('guide end');
			Guide.end();
			return;
		}
		var curr = scenario.shift();
		console.log(curr.cmd);
		switch(curr.cmd){
			case 'simTouchElement':
				simTouchElement.apply(null,curr.param);
				break;
			case 'clipRect':
				clipRect.apply(null,curr.param);
				break;
			case 'clearClipRect':
				clearClipRect.apply(null,curr.param);
				break;
			case 'typeText':
				typeText.apply(null,curr.param);
				break;
			case 'clearText':
				clearText.apply(null,curr.param);
				break;
			case 'tapRectToContinue':
				tapRectToContinue.apply(null,curr.param);
				break;
			case 'waitingForTap':
				waitingForTap.apply(null,curr.param);
				break;
			case 'pauseForTime':
				pauseForTime.apply(null,curr.param);
				break;
		}
		if(!curr.block){
			nextStep();
		}
	}

	function simTouchElement(target){
		if(typeof target == 'string'){
			target = document.querySelector(target);
		}
		try{
			var evt = new TouchEvent('touchend');
			target.dispatchEvent(evt);
		}catch(ex){
			var evt = document.createEvent('TouchEvent');
			evt.initUIEvent('touchend',true,true);
			target.dispatchEvent(evt);
		}
	}

	function clipRect(x,y,w,h){
		var cssText = 'polygon(0 0,100% 0,100% 100%,0 100%,0 '+y+'px,'+x+'px '+y+'px,'+x+'px '+(y+h)+'px,'+(x+w)+'px '+(y+h)+'px,'+(x+w)+'px '+y+'px,0 '+y+'px)';
		var lightupLayer = guideLayer.querySelector('.lightup');
		lightupLayer.style.display = 'none';
		lightupLayer.style.webkitClipPath = cssText;
		lightupLayer.offsetHeight;
		lightupLayer.style.display = '';
	}

	function clearClipRect(){
		var lightupLayer = guideLayer.querySelector('.lightup');
		lightupLayer.style.display = 'none';
		lightupLayer.style.webkitClipPath = '';
		lightupLayer.offsetHeight;
		lightupLayer.style.display = '';
	}

	function typeText(str,x,y){
		guideLayer.querySelector('.desc').style.webkitTransform = 'translate3d('+x+'px,'+y+'px,0)';
		guideLayer.querySelector('.desc').innerHTML = str;
	}

	function clearText(){
		guideLayer.querySelector('.desc').innerHTML = '';
	}

	function tapRectToContinue(x,y,w,h){
		var area = guideLayer.querySelector('.area');
		area.style.left = x+'px';
		area.style.top = y+'px';
		area.style.width = w+'px';
		area.style.height = h+'px';
		setTimeout(function(){
			area.style.display = 'block';
		},100);
	}

	function waitingForTap(){
		tapRectToContinue(0,0,document.body.scrollWidth,document.body.scrollHeight);
	}

	function pauseForTime(time){
		setTimeout(nextStep,time);
	}

	exports.Guide = Guide;
}(window);