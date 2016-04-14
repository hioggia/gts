
var SoundPlayer = function(){

	var atx = new (window.AudioContext || window.webkitAudioContext)();
	var buffs = {}, playingBgm = null;

	function loadUrl(url,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET',url,true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function(){
			atx.decodeAudioData(xhr.response,function(buffer){
				buffs[url] = buffer;
				callback&&callback();
			});
		};
		xhr.send();
	}

	function createSource(url){
		var gain = atx.createGain();
		var src = atx.createBufferSource();
		src.connect(gain);
		src.buffer = buffs[url];
		gain.connect(atx.destination);
		return {src:src,gain:gain.gain};
	}

	function swapBGM(url,loopStart,loopEnd){
		if(playingBgm!=null){
			var oldBgm = playingBgm;
			//oldBgm.gain.linearRampToValueAtTime(0,atx.currentTime+2);
			oldBgm.src.stop(atx.currentTime);
		}

		var newBgm = createSource(url);
		newBgm.src.loop = true;
		newBgm.src.loopStart = loopStart;
		newBgm.src.loopEnd = loopEnd;
		//src.playbackRate.value=1;
		newBgm.src.start(atx.currentTime,0);
		/*if(oldBgm){
			newBgm.gain.value = 0;
			newBgm.gain.linearRampToValueAtTime(1,atx.currentTime+2);
		}*/
		playingBgm = newBgm;
	}

	return {
		checkUnlockState: function(callback){
			// create empty buffer and play it
			var buffer = atx.createBuffer(1, 1, 22050);
			var source = atx.createBufferSource();
			source.buffer = buffer;
			source.connect(atx.destination);
			source.start(0,0);

			// by checking the play state after some time, we know if we're really unlocked
			setTimeout(function() {
				if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
					callback(true);
				}else{
					callback(false);
				}
			}, 0);
		},
		playBGM: function(url,loopStart,loopEnd){
			if(url in buffs){
				swapBGM(url,loopStart,loopEnd);
			}else{
				loadUrl(url,function(){
					swapBGM(url,loopStart,loopEnd);
				});
			}
		},
		playSE: function(url){
			if(url in buffs){
				var src = createSource(url).src;
				src.start(atx.currentTime,0);
			}else{
				loadUrl(url,function(){
					var src = createSource(url).src;
					src.start(atx.currentTime,0);
				});
			}
		}
	};

}();

SoundPlayer.checkUnlockState(function(result){
	if(!result){
		document.body.addEventListener('touchend',function bb(){
			SoundPlayer.playBGM('bgm.mp3',0,158);
			document.body.removeEventListener('touchend',bb,false);
		},false);
	}else{
		SoundPlayer.playBGM('bgm.mp3',0,158);
	}
});

document.querySelector('button').addEventListener('click',function(){
	SoundPlayer.playSE('btn.mp3');
	//SoundPlayer.playBGM('bgm.mp3',0,158);
},false);