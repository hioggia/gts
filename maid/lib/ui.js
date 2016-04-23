!function(exports){
	var UI = {
		createEmptyCharaBoxS: function createCharaBoxS(band){
			var container = document.createElement('div');
			if(band!=undefined){
				container.innerHTML = '<div class="chara_band"><span>'+band+'</span></div>';
			}
			container.innerHTML += '<div class="chara_box_s" data-chara-pic="0" data-bg-type="4">\
				<b class="chara_face"></b>\
				<b class="tag_back"></b>\
			</div>';
			return container;
		},
		createCharaBoxS: function createCharaBoxS(charaData,bgType,band){
			var container = document.createElement('div');
			if(band!=undefined){
				container.innerHTML = '<div class="chara_band"><span>'+band+'</span></div>';
			}
			container.innerHTML += '<div class="chara_box_s" data-chara-pic="'+charaData.pic+'" data-bg-type="'+bgType+'">\
				<div class="data_lay">\
					<span class="name">'+charaData.name+'</span>\
					<span class="age">'+charaData.age+'</span>\
					<span class="fashion">'+charaData.fashion+'</span>\
					<span class="pure">'+charaData.pure+'</span>\
					<span class="sexy">'+charaData.sexy+'</span>\
					<span class="technic">'+charaData.technic+'</span>\
					<span class="health">'+charaData.health+'</span>\
				</div>\
				<div class="tag_lay"></div>\
				<b class="chara_face"></b>\
				<b class="tag_back"></b>\
			</div>';
			charaData.tags.each(function(tag){
				container.querySelector('.tag_lay').innerHTML += '<span>'+TAG[tag.code].text+'</span>';
			});
			return container;
		},
		createCustomBoxC: function createCustomBoxC(customerData){
			var container = document.createElement('div');
			container.innerHTML = '<div class="custom_box_c" data-custom-pic="'+customerData.pic+'">\
				<div class="price">'+customerData.price+'</div>\
				<div class="name">'+customerData.name+'</div>\
				<div class="desc">'+customerData.desc+'</div>\
				<div class="data_lay">\
					<span class="like">'+customerData.like+'</span>\
					<span class="spec">'+customerData.spec+'</span>\
					<span class="affect">'+customerData.affect+'</span>\
				</div>\
				<b class="chara_face"></b>\
			</div>';
			return container;
		},
		createCutinHead: function createCutinHead(charaPic,pos,borderType){
			var head = document.createElement('div');
			head.className = 'head';
			head.dataset.charaPic = charaPic;
			head.dataset.pos = pos;
			head.dataset.borderType = borderType;
			return head;
		},
		makeScroller: function makeScroller(panelNode,pointNode,prevBtn,nextBtn,maxSize){
			var nIndex = 0, recordingX = undefined, lockTime = 0;

			function gotoLastPage(){
				if(--nIndex>0){
					nIndex=0;
				}else{
					tweenScrolling();
				}
			}
			function gotoNextPage(){
				if(++nIndex>=maxSize){
					nIndex=maxSize-1;
				}else{
					tweenScrolling();
				}
			}
			function tweenScrolling(){
				if(lockTime==0){
					lockTime = new Date().getTime();
					checkEdge();
				}
				var delta = new Date().getTime() - lockTime;
				if(delta>=300){
					panelNode.scrollLeft = nIndex*320;
					lockTime = 0;
				}else{
					panelNode.scrollLeft += (nIndex*320 - panelNode.scrollLeft)*0.6;
					setTimeout(tweenScrolling,30);
				}
			}
			function recordMouseTouch(ev){
				ev.stopPropagation();
				ev.preventDefault();
				if(ev.type == 'touchstart'){
					if(lockTime>0){
						return;
					}
					recordingX = ev.touches[0].pageX;
				}else if(ev.type == 'touchmove'){
					if(recordingX!=undefined){
						panelNode.scrollLeft = nIndex*320+recordingX-ev.touches[0].pageX;
					}
				}else{
					var shift = panelNode.scrollLeft-nIndex*320;
					if(shift>=128){
						nIndex+=1;
					}else if(shift<=-128){
						nIndex-=1;
					}
					tweenScrolling();
					recordingX = undefined;
					pointNode.querySelector('.curr').className = '';
					pointNode.childNodes[nIndex].className = 'curr';
				}
			}
			function checkEdge(){
				if(nIndex==0){
					prevBtn.style.display = 'none';
				}else{
					prevBtn.style.display = '';
				}
				if(nIndex==maxSize-1){
					nextBtn.style.display = 'none';
				}else{
					nextBtn.style.display = '';
				}
			}
			panelNode.addEventListener('touchstart',recordMouseTouch,false);
			panelNode.addEventListener('touchmove',recordMouseTouch,false);
			panelNode.addEventListener('touchend',recordMouseTouch,false);
			panelNode.addEventListener('touchcancel',recordMouseTouch,false);
			prevBtn.addEventListener('touchend',gotoLastPage,false);
			nextBtn.addEventListener('touchend',gotoNextPage,false);
			checkEdge();

			var obj = {};
			Object.defineProperty(obj,'currentIndex',{get:function(){return nIndex}})
			return obj;
		}
	};

	exports.UI = UI;
}(window);