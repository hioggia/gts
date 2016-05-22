!function(exports){
	var Page = {
		load: function(pageName,param,callback){
			var s = document.createElement('script');
			s.src = 'page/'+pageName+'.js';
			s.addEventListener('load',function complete(){
				s.removeEventListener('load',complete,false);
				currentPage.install.apply(currentPage,param);
				callback&& callback();
			},false);
			document.body.appendChild(s);
		},
		instanct: function(pageObject){
			if(currentPage!=null){
				currentPage.uninstall();
			}
			currentPage = pageObject;
		}
	};

	var currentPage = null;

	exports.Page = Page;
}(window);