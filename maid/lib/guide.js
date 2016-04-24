!function(exports){
	var Guide = {
		start: function(sce){
			guideLayer = document.createElement('div');
			guideLayer.id = 'guide';
			guideLayer.innerHTML = '<div class="lightup"></div><div class="desc"></div><div class="tour" data-anim="init"><i></i><div></div></div><div class="area"></div>';
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

	var guideLayer,scenario=[],fixForMobile=true;

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
		var param = scenario.shift();
		var cmd = param.shift(), block = false;
		console.log(cmd);
		switch(cmd){
			case 'simTouchElement':
				simTouchElement.apply(null,param);
				break;
			case 'clipRect':
				clipRect.apply(null,param);
				break;
			case 'clearClipRect':
				clearClipRect.apply(null,param);
				break;
			case 'typeText':
				typeText.apply(null,param);
				break;
			case 'clearText':
				clearText.apply(null,param);
				break;
			case 'tourAnim':
				tourAnim.apply(null,param);
				break;
			case 'tourEmotion':
				tourEmotion.apply(null,param);
				break;
			case 'tourSerifShow':
				tourSerifShow.apply(null,param);
				break;
			case 'tourSerifHide':
				tourSerifHide.apply(null,param);
				break;
			case 'tourSerifSay':
				block = true;
				tourSerifSay.apply(null,param);
				break;
			case 'tourSerifAddLine':
				block = true;
				tourSerifAddLine.apply(null,param);
				break;
			case 'pauseUntilTapRect':
				block = true;
				pauseUntilTapRect.apply(null,param);
				break;
			case 'pauseUntilTapScreen':
				block = true;
				pauseUntilTapScreen.apply(null,param);
				break;
			case 'pauseByTime':
				block = true;
				pauseByTime.apply(null,param);
				break;
		}
		if(!block){
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
		lightupLayer.style.webkitClipPath = cssText;
		if(fixForMobile){
			lightupLayer.style.display = 'none';
			lightupLayer.offsetHeight;
			lightupLayer.style.display = '';
		}
	}

	function clearClipRect(){
		var lightupLayer = guideLayer.querySelector('.lightup');
		lightupLayer.style.webkitClipPath = '';
		if(fixForMobile){
			lightupLayer.style.display = 'none';
			lightupLayer.offsetHeight;
			lightupLayer.style.display = '';
		}
	}

	function typeText(str,x,y){
		guideLayer.querySelector('.desc').style.webkitTransform = 'translate3d('+x+'px,'+y+'px,0)';
		guideLayer.querySelector('.desc').innerHTML = str;
	}

	function clearText(){
		guideLayer.querySelector('.desc').innerHTML = '';
	}

	function tourAnim(anim){
		if(guideLayer.querySelector('.tour').dataset.anim == anim){
			anim+='2';
		}
		guideLayer.querySelector('.tour').dataset.anim = anim;
	}

	function tourEmotion(emotion){
		guideLayer.querySelector('.tour').dataset.emotion = emotion;
	}

	function tourSerifShow(){
		guideLayer.querySelector('.tour div').style.opacity = 1;
	}

	function tourSerifHide(){
		guideLayer.querySelector('.tour div').style.opacity = 0;
	}

	function tourSerifSay(serif){
		var buf = serif.split(''), serifLayer = guideLayer.querySelector('.tour div');
		serifLayer.dataset.ready = '';
		serifLayer.innerHTML = '';
		!(function l(){
			if(buf.length>0){
				serifLayer.innerHTML += buf.splice(0,1)[0];
				setTimeout(l,50);
			}else{
				serifLayer.dataset.ready = '1';
				nextStep();
			}
		})();
	}

	function tourSerifAddLine(serif){
		var buf = serif.split(''), serifLayer = guideLayer.querySelector('.tour div');
		serifLayer.dataset.ready = '';
		serifLayer.innerHTML += '<br />';
		!(function l(){
			if(buf.length>0){
				serifLayer.innerHTML += buf.splice(0,1)[0];
				setTimeout(l,50);
			}else{
				serifLayer.dataset.ready = '1';
				nextStep();
			}
		})();
	}

	function pauseUntilTapRect(x,y,w,h){
		var area = guideLayer.querySelector('.area');
		area.style.left = x+'px';
		area.style.top = y+'px';
		area.style.width = w+'px';
		area.style.height = h+'px';
		setTimeout(function(){
			area.style.display = 'block';
		},100);
	}

	function pauseUntilTapScreen(){
		pauseUntilTapRect(0,0,320,document.body.scrollHeight);
	}

	function pauseByTime(time){
		setTimeout(nextStep,time);
	}

	exports.Guide = Guide;
}(window);