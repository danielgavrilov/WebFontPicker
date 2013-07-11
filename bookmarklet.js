javascript:(function(){

	var url = 'http://gavrilov.co.uk/gfp';

	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = url + '/picker.css';

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.src = url + '/picker.min.js';

	document.head.appendChild(link);
	document.head.appendChild(script);
	
})();
