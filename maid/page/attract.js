!function(Page){

	var obj = {
		install: function(c,r,m){
			console.log('attract install');
			writeHTML();
			customerData = c;
			rivalData = r;
			mineData = m;
			init();
		},
		uninstall: function(){
			console.log('attract uninstall');
			scroller.drop();
			document.querySelector('.action button').removeEventListener('touchend',sendOutMaid,false);
		}
	};
	Page.instanct(obj);

	function writeHTML(){
		document.querySelector('#main_container').innerHTML = '<div class="custom_head">\
			<h2>目标客户</h2>\
			<span class="queue"></span>\
		</div>\
		<div class="customer_cont"></div>\
		<div class="rival_head">\
			<h2>竟争者</h2>\
		</div>\
		<div class="rival_cont"></div>\
		<div class="self_head">\
			<h2>我</h2>\
		</div>\
		<div class="scroll_panel">\
			<div class="scroll_container"></div>\
		</div>\
		<div class="scroll_button">\
			<div class="prev"></div>\
			<div class="next"></div>\
		</div>\
		<div class="scroll_point"></div>\
		<div class="action">\
			<button class="btn_blue btn_large">派出招揽</button>\
		</div>\
		<div class="result"><div class="title">招揽结果</div><div class="cutin"></div><b class="hint_tap">TAP SCREEN</b></div>';
	}

	var currCustomer = null, currRivalIndex = {}, scroller = null;
	var isUsingMouse = false, isLockingSubmit = false;
	var customerData,rivalData,mineData;

	function init(){
		newCustomerShow();
		rivalShow();
		document.querySelector('.scroll_panel').dataset.totalChara = mineData.length;
		for(var i=0;i<mineData.length;i++){
			var node = UI.createCharaBoxS(mineData[i],1,'大正浪漫女仆咖啡屋');
			node.className = 'scroll_node';
			document.querySelector('.scroll_container').appendChild(node);
			var pt = document.createElement('b');
			if(i==0){
				pt.className = 'curr';
			}
			document.querySelector('.scroll_point').appendChild(pt);
		}
		document.querySelector('.action button').addEventListener('touchend',sendOutMaid,false);
		scroller = UI.makeScroller(document.querySelector('.scroll_panel'),document.querySelector('.scroll_point'),document.querySelector('.scroll_button .prev'),document.querySelector('.scroll_button .next'),mineData.length);
	}

	function nextRound(){
		newCustomerShow();
		if(document.querySelector('.custom_head .queue .a')){
			rivalShow();
		}else{
			ECC.trigger('attractEnd');
		}
	}

	function newCustomerShow(){
		var cont = document.querySelector('.customer_cont');
		if(cont.childNodes.length>0){
			cont.childNodes[0].className = 'out';
			setTimeout(function(){cont.removeChild(cont.childNodes[0])},300);
			document.querySelector('.custom_head .queue .a').className = 'u';
		}else{
			for(var i=0;i<customerData.length;i++){
				document.querySelector('.custom_head .queue').innerHTML += '<b class="a"></b>';
			}
		}
		if(customerData.length>0){
			currCustomer = customerData.shift();
			var cElem = UI.createCustomBoxC(currCustomer);
			cont.appendChild( cElem );
			setTimeout(function(){cElem.className='in'},10);
		}
	}

	function rivalMaidShow(shop){
		var cont = document.querySelector('.rival_cont');
		var rmIdx = currRivalIndex[shop];
		if(rmIdx>=0){
			var rElem = UI.createCharaBoxS(rivalData[shop][rmIdx],2,shop);
		}else{
			var rElem = UI.createEmptyCharaBoxS(shop);
		}
		cont.appendChild( rElem );
		setTimeout(function(){rElem.className='in'},10);
	}

	function rivalAutoSelectMaid(shop){
		var targetElement = currCustomer.likeValue;
		currRivalIndex[shop] = -1;
		for(var i=0;i<rivalData[shop].length;i++){
			if(i==0){
				currRivalIndex[shop] = i;
			}else if(rivalData[shop][i].getValueByElement(targetElement)>rivalData[shop][currRivalIndex[shop]].getValueByElement(targetElement)){
				currRivalIndex[shop] = i;
			}
		}
		rivalMaidShow(shop);
	}

	function rivalShow(){
		document.querySelector('.rival_cont').innerHTML = '';
		for(var shop in rivalData){
			rivalAutoSelectMaid(shop);
		}
	}

	function close_cutin(){
		document.querySelector('.result').style.display = 'none';
		document.querySelector('.result').removeEventListener('touchend',close_cutin,false);
		document.querySelector('.result .hint_tap').style.display = '';
		document.querySelector('.cutin').innerHTML = '';

		nextRound();
		setTimeout(function(){isLockingSubmit=false},100);
	}
	function cutin_control(stagePic,customer,rivals,mine,result){
		var pCounter = 1, cutinStage = document.querySelector('.cutin');
		document.querySelector('.result').style.display = 'block';
		cutinStage.dataset.stagePic = stagePic;

		for(var i=0;i<rivals.length;i++){
			cutinStage.appendChild( UI.createCutinHead(rivals[i],pCounter++,2) );
		}
		cutinStage.appendChild( UI.createCutinHead(mine,pCounter,1) );
		cutinStage.dataset.totalChara = pCounter;

		var c = UI.createCutinHead(customer,0,3);
		cutinStage.appendChild(c);
		c.innerHTML = '<b class="anim_ellipsis"></b>';
		setTimeout(function(){
			c.innerHTML = '';
			c.dataset.result = result;
			setTimeout(function(){
				c.innerHTML = '<b class="anim_heart"></b>';
				setTimeout(function(){
					document.querySelector('.result .hint_tap').style.display = 'block';
					document.querySelector('.result').addEventListener('touchend',close_cutin,false);
				},600);
			},250);
		},4000);
	}

	function sendOutMaid(){
		if(isLockingSubmit){
			return;
		}
		isLockingSubmit = true;
		var mineMaid = mineData[scroller.currentIndex];
		var highScore = {pos:0,score:0};
		var pos = 0;
		var rivalMaidPicArray = [];
		for(var shop in currRivalIndex){
			var idx = currRivalIndex[shop];
			if(idx<0){
				continue;
			}
			var maid = rivalData[shop][idx];
			rivalMaidPicArray.push( maid.pic );
			calcScore(maid);
		}
		calcScore(mineMaid);
		if(highScore.pos==pos){
			//mine is win;
			document.querySelectorAll('.scroll_container .scroll_node')[scroller.currentIndex].querySelector('.chara_box_s').dataset.bgType = 4;
		}else{
			//mine is lose;
			var c=1;
			for(var shop in currRivalIndex){
				if(currRivalIndex[shop]==-1){
					continue;
				}
				if(c++==highScore.pos){
					//remove winner
					var m = rivalData[shop].splice(currRivalIndex[shop],1)[0];
				}
			}
		}
		function calcScore(maid){
			pos++;
			var score = maid.getValueByElement(currCustomer.likeValue);
			if(currCustomer.specValue.type==1){
				var m = maid.tags.match(currCustomer.specValue.value);
				if(m>0){
					score*=m-96;//4倍
				}else if(m<0){
					score=0;
				}
			}
			if(score>highScore.score){
				highScore.score = score;
				highScore.pos = pos;
			}
		}
		cutin_control(1,currCustomer.pic,rivalMaidPicArray,mineMaid.pic,highScore.pos);
	}
}(window.Page);