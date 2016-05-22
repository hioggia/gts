!function(Page){

	var obj = {
		install: function(){
			console.log('service install');
			writeHTML();
		},
		uninstall: function(){
			console.log('service uninstall');
		}
	};
	Page.instanct(obj);

	function writeHTML(){
		document.querySelector('#main_container').innerHTML = '';
	}
}(window.Page);