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
		console.log('areaTouched');
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
		var evt = new TouchEvent('touchend');
		target.dispatchEvent(evt);
	}

	function clipRect(x,y,w,h){
		var cssText = 'polygon(0 0,100% 0,100% 100%,0 100%,0 '+y+'px,'+x+'px '+y+'px,'+x+'px '+(y+h)+'px,'+(x+w)+'px '+(y+h)+'px,'+(x+w)+'px '+y+'px,0 '+y+'px)';
		document.querySelector('#guide .lightup').style.webkitClipPath = cssText;
	}

	function clearClipRect(){
		document.querySelector('#guide .lightup').style.webkitClipPath = '';
	}

	function typeText(str,x,y){
		document.querySelector('#guide .desc').style.webkitTransform = 'translate3d('+x+'px,'+y+'px,0)';
		document.querySelector('#guide .desc').innerHTML = str;
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