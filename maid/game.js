function debulog(){
	console.log.apply(console,Array.prototype.slice.call(arguments,0));
}

!function(){
	var data={},currShop=0,lastIdx=0,rivalData=[],customerData=[],currCustomer=0,cleanUpList=[];

	function loadData(){
		if('data' in localStorage){
			data = JSON.parse(localStorage['data']);
			return true;
		}
		return false;
	}

	function saveData(){
		localStorage['data'] = JSON.stringify(data);
	}

	if(!loadData()){
		//初始化游戏
		data.gold = 20000;
		data.tool = 5;
		data.fame = 0;
		data.city = {total:400,f:4,p:5,s:6};
		data.shop = [new Shop()];
		data.shop[0].addStaff(new Maid(NAMES[Math.floor(Math.random()*NAMES.length)],
			Math.round(Math.random()*70),
			100,
			Math.round(Math.random()*40+60),
			100,
			Math.round(Math.random()*40),
			100,
			Math.round(Math.random()*40+20),
			100,
			0,
			100,
			50,
			18,3));
		document.querySelector('#m_first_maid').innerHTML = data.shop[0].staff[0].description();
	}else{
		initToMain();
	}

	function startTimer(){
		var gainGold = 0;
		for(var i=0;i<data.shop.length;i++){
			gainGold+=data.shop[i].getGainPreSecond(data.city);
		}
		data.gold+=gainGold;
		document.querySelector('#my_gold').innerHTML = data.gold;
		setTimeout(startTimer,1000);
	}

	function createRival(size){
		rivalData = new Array(size);
		for(var i=0;i<size;i++){
			reCreateRival(i);
		}
	}

	function reCreateRival(idx){
		var a1 = undefined;
		if(Math.random()>0.8){
			a1 = ATTRIBUTE_KEYS[Math.floor(Math.random()*ATTRIBUTE_KEYS.length)];
		}
		rivalData[idx] = new Maid(NAMES[Math.floor(Math.random()*NAMES.length)],
			Math.round(Math.random()*100),
			100,
			Math.round(Math.random()*100),
			100,
			Math.round(Math.random()*100),
			100,
			Math.round(Math.random()*100),
			Math.round(Math.random()*100),
			0,
			100,
			50,
			Math.round(Math.random()*27+12),
			3,ATTRIBUTE_KEYS[Math.floor(Math.random()*ATTRIBUTE_KEYS.length)],a1)
	}

	function createCustomers(size){
		customerData = new Array(size);
		for(var i=0;i<size;i++){
			var a = {t:0,v:ATTRIBUTE_KEYS[Math.floor(Math.random()*ATTRIBUTE_KEYS.length)]};
			if(Math.random()>0.4){
				a.t=Math.ceil(Math.random()*3);
				a.v=Math.random()>0.4?1:Math.random()>0.4?2:3;
			}
			customerData[i] = {
				name:NAMES[Math.floor(Math.random()*NAMES.length)],
				lookfor:Math.floor(Math.random()*3),
				pay:Math.floor(Math.random()*90)*10+100,
				favourite:ATTRIBUTE_KEYS[Math.floor(Math.random()*ATTRIBUTE_KEYS.length)],
				affect:a
			};
		}
	}

	window.initToMain = function(){
		document.querySelector('#prologue').style.display = 'none';
		document.querySelector('#main').style.display = 'block';
		document.querySelector('#my_tool').innerHTML = data.tool;
		document.querySelector('#my_fame').innerHTML = data.fame;
		startTimer();
		gotoTab(0);
	}

	window.gotoTab = function(idx){
		document.querySelector('#tab_'+lastIdx).style.display = 'none';
		document.querySelector('#tab_'+idx).style.display = 'block';
		lastIdx = idx;
		if(idx==0){
			document.querySelector('#m_working_maid').innerHTML = data.shop[currShop].staff.length;
			document.querySelector('#m_gain_speed').innerHTML = data.shop[currShop].getGainPreSecond(data.city);
			document.querySelector('#m_customer_size').innerHTML = data.shop[currShop].wait;
			document.querySelector('#m_serve_level').innerHTML = data.shop[currShop].serveLevel;
			document.querySelector('#m_staff_room').innerHTML = data.shop[currShop].staffRoomSize;
			document.querySelector('#m_cost_cs').innerHTML = Math.floor(data.shop[currShop].waitLevel/2)*1000+1000;
			document.querySelector('#m_cost_sl').innerHTML = Math.floor(data.shop[currShop].serveLevel/5)*2000+3000;
			document.querySelector('#m_cost_sr').innerHTML = Math.floor(data.shop[currShop].staffRoomLevel/1)*10000+10000;
		}else if(idx==4){
			document.querySelector('#m_city_total').innerHTML = data.city.total;
			document.querySelector('#m_city_f').innerHTML = data.city.f;
			document.querySelector('#m_city_p').innerHTML = data.city.p;
			document.querySelector('#m_city_s').innerHTML = data.city.s;
		}else if(idx==2){
			document.querySelector('#m_cost_rm').innerHTML = data.shop[currShop].staff.length*500;
			document.querySelector('#pre_recruit').style.display = 'block';
			document.querySelector('#recruit_result').style.display = 'none';
			document.querySelector('#recruit_error').style.display = 'none';
		}else if(idx==1){
			document.querySelector('#m_staff_list').style.display = 'block';
			document.querySelector('#m_staff_detail').style.display = 'none';
			var t = '';
			for(var i=0;i<data.shop[currShop].staff.length;i++){
				t+='<br />'+data.shop[currShop].staff[i].description()+' <a href="javascript:showStaff('+i+')">选择</a>';
			}
			document.querySelector('#m_staff_list>span').innerHTML = t;
		}
	}

	window.gotoMain = function(){
		document.querySelector('#main').style.display = 'block';
		document.querySelector('#shop_event').style.display = 'none';
	}

	window.recruit = function(){
		if(data.gold>=data.shop[currShop].staff.length*500 && data.shop[currShop].staffRoomSize>data.shop[currShop].staff.length){
			data.gold-=data.shop[currShop].staff.length*500;
			var m = new Maid(NAMES[Math.floor(Math.random()*NAMES.length)],
				Math.round(Math.random()*70),
				100,
				Math.round(Math.random()*40+60),
				100,
				Math.round(Math.random()*40),
				100,
				Math.round(Math.random()*40+20),
				100,
				0,
				100,
				50,
				Math.round(Math.random()*10+15),
				3,ATTRIBUTE_KEYS[Math.floor(Math.random()*ATTRIBUTE_KEYS.length)]);
			data.shop[currShop].addStaff(m);
			document.querySelector('#pre_recruit').style.display = 'none';
			document.querySelector('#recruit_result').style.display = 'block';
			document.querySelector('#m_cost_ra').innerHTML = data.shop[currShop].staff.length*500;
			document.querySelector('#m_recruit_staff').innerHTML = m.description();
		}else{
			document.querySelector('#pre_recruit').style.display = 'none';
			document.querySelector('#recruit_result').style.display = 'none';
			document.querySelector('#recruit_error').style.display = 'block';
			var r='未知的原因';
			if(data.gold<500){
				r='你的钱不够';
			}else{
				r='你的店没有更多的Staff Room';
			}
			document.querySelector('#recruit_error').innerHTML = '无法招募，因为'+r;
		}
	}

	window.showStaff = function(idx){
		var m = data.shop[currShop].staff[idx];
		document.querySelector('#m_maid_name').innerHTML = m.name;
		document.querySelector('#m_maid_age').innerHTML = m.age;
		document.querySelector('#m_maid_fashion').innerHTML = m.fashion;
		document.querySelector('#m_maid_pure').innerHTML = m.pure;
		document.querySelector('#m_maid_sexy').innerHTML = m.sexy;
		document.querySelector('#m_maid_technic').innerHTML = m.technic;
		document.querySelector('#m_maid_health').innerHTML = m.health;
		document.querySelector('#m_maid_experience').innerHTML = m.experience+'/'+m.experienceNext;
		document.querySelector('#m_maid_attributes').innerHTML = m.attribute.description();
		document.querySelector('#m_staff_list').style.display = 'none';
		document.querySelector('#m_staff_detail').style.display = 'block';
	}

	window.startShopEvent = function(){
		document.querySelector('#main').style.display = 'none';
		document.querySelector('#shop_event').style.display = 'block';

		createCustomers(Math.random()>0.3?3:Math.random()>0.3?4:5);
		createRival(Math.random()>0.3?1:Math.random()>0.3?2:3);
		currCustomer = 0;
		cleanUpList=[];
		document.querySelector('#result').innerHTML = '';
		var t = '<p>客户'+(currCustomer+1)+'/'+customerData.length+'：'+customerData[currCustomer].name+'<br />支付：'+customerData[currCustomer].pay+'<br />注目：'+['Fashion','Pure','Sexy'][customerData[currCustomer].lookfor]+'<br />喜好：'+ATTRIBUTE[customerData[currCustomer].favourite].text+'<br />影响：';
		if(customerData[currCustomer].affect.t==0){
			t+='+'+ATTRIBUTE[customerData[currCustomer].affect.v].text;
		}else{
			for(var i=0;i<customerData[currCustomer].affect.v;i++){t+='+'}
			t+=['Fashion','Pure','Sexy'][customerData[currCustomer].affect.t-1];
		}
		document.querySelector('#target').innerHTML = t;

		t = '';
		for(var i=0;i<rivalData.length;i++){
			t+='<p>竟争对手派出：'+rivalData[i].description(true)+'<br />属性：'+rivalData[i].attribute.description();
		}
		document.querySelector('#rivals').innerHTML = t;

		t = '';
		for(var i=0;i<data.shop[currShop].staff.length;i++){
			t+='<br />'+data.shop[currShop].staff[i].description()+'<br />属性：'+data.shop[currShop].staff[i].attribute.description()+' <a';
			if(data.shop[currShop].staff[i].health>=10){
				t+=' href="javascript:choice('+i+')"';
			}
			t+='>选择</a>';
		}
		document.querySelector('#m_choice_staff>span').innerHTML = t;
	}

	window.choice = function(idx){
		var m = data.shop[currShop].staff[idx],
			c = customerData[currCustomer];
		var highScore = {score:0,pos:0,idx:0};
		for(var i=0;i<rivalData.length;i++){
			var score = rivalData[i][ ['fashion','pure','sexy'][c.lookfor] ];
			if(rivalData[i].attribute.matching(c.favourite)){
				score+=100;
			}
			if(score>highScore.score){
				highScore={score:score,pos:0,idx:i}
			}
		}
		var score = m[ ['fashion','pure','sexy'][c.lookfor] ];
		if(m.attribute.matching(c.favourite)){
			score+=100;
		}
		if(score>highScore.score){
			highScore={score:score,pos:1,idx:idx}
		}
		if(currCustomer!=0){
			document.querySelector('#result').innerHTML += '<br />';
		}
		document.querySelector('#result').innerHTML += '['+(currCustomer+1)+'/'+customerData.length+']';
		if(highScore.pos==0){
			document.querySelector('#result').innerHTML += rivalData[highScore.idx].name +'<=>' + c.name;
			reCreateRival(highScore.idx);
			cleanUpList.push(null);
		}else{
			document.querySelector('#result').innerHTML += m.name +'<=>' + c.name;
			document.querySelectorAll('#m_choice_staff>span a')[idx].removeAttribute('href');
			cleanUpList.push(idx);
		}
		if(++currCustomer<customerData.length && document.querySelectorAll('#m_choice_staff>span a[href]').length>0){
			var t = '<p>客户'+(currCustomer+1)+'/'+customerData.length+'：'+customerData[currCustomer].name+'<br />支付：'+customerData[currCustomer].pay+'<br />注目：'+['Fashion','Pure','Sexy'][customerData[currCustomer].lookfor]+'<br />喜好：'+ATTRIBUTE[customerData[currCustomer].favourite].text+'<br />影响：';
			if(customerData[currCustomer].affect.t==0){
				t+='+'+ATTRIBUTE[customerData[currCustomer].affect.v].text;
			}else{
				for(var i=0;i<customerData[currCustomer].affect.v;i++){t+='+'}
				t+=['Fashion','Pure','Sexy'][customerData[currCustomer].affect.t-1];
			}
			document.querySelector('#target').innerHTML = t;

			t = '';
			for(var i=0;i<rivalData.length;i++){
				t+='<p>竟争对手派出：'+rivalData[i].description(true)+'<br />属性：'+rivalData[i].attribute.description();
			}
			document.querySelector('#rivals').innerHTML = t;
		}else{
			var totalGain = 0;
			for(var i=0;i<cleanUpList.length;i++){
				if(cleanUpList[i]!=null){
					var m = data.shop[currShop].staff[cleanUpList[i]],
						t = m.health>=50?m.technic:m.technic*m.health/100,
						g = Math.floor(t/100*customerData[i].pay);
					alert('通过活动，'+m.name+'赚了'+g+'钱！');
					totalGain += g;
					m.health-=10;
					m.experience+=5;
					if(customerData[i].affect.t==0){
						m.attribute.add(customerData[i].affect.v);
					}else{
						m[ ['fashion','pure','sexy'][customerData[i].affect.t-1] ] += customerData[i].affect.v;
					}
				}
			}
			alert('你获得了 '+totalGain+' 钱');
			data.gold+=totalGain;
			gotoMain();
		}
	}

	window.updateWaitLevel = function(){
		if(data.gold>=Math.floor(data.shop[currShop].waitLevel/3)*1000+1000){
			data.gold-=Math.floor(data.shop[currShop].waitLevel/3)*1000+1000;
			data.shop[currShop].waitLevel+=1;
			document.querySelector('#m_customer_size').innerHTML = data.shop[currShop].wait;
			document.querySelector('#m_cost_cs').innerHTML = Math.floor(data.shop[currShop].waitLevel/3)*1000+1000;
			document.querySelector('#m_gain_speed').innerHTML = data.shop[currShop].getGainPreSecond(data.city);
		}
	}

	window.updateServeLevel = function(){
		if(data.gold>=Math.floor(data.shop[currShop].serveLevel/5)*2000+3000){
			data.gold-=Math.floor(data.shop[currShop].serveLevel/5)*2000+3000;
			data.shop[currShop].serveLevel+=1;
			document.querySelector('#m_serve_level').innerHTML = data.shop[currShop].serveLevel;
			document.querySelector('#m_cost_sl').innerHTML = Math.floor(data.shop[currShop].serveLevel/5)*2000+3000;
			document.querySelector('#m_gain_speed').innerHTML = data.shop[currShop].getGainPreSecond(data.city);
		}
	}

	window.updateStaffRoom = function(){
		if(data.gold>=Math.floor(data.shop[currShop].staffRoomLevel/1)*10000+10000){
			data.gold-=Math.floor(data.shop[currShop].staffRoomLevel/1)*10000+10000;
			data.shop[currShop].staffRoomLevel+=1;
			document.querySelector('#m_staff_room').innerHTML = data.shop[currShop].staffRoomSize;
			document.querySelector('#m_cost_sr').innerHTML = Math.floor(data.shop[currShop].staffRoomLevel/1)*10000+10000;
		}
	}
}();