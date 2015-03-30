// js to fetch and display knowledge articles.

document.getElementById("content").textContent = getParameter("p1");
console.log('LOADED');

chrome.runtime.sendMessage({action:"clearBadge"});

function getParameter(theParameter) { 
	  var params = window.location.search.substr(1).split('&');
	 
	  for (var i = 0; i < params.length; i++) {
	    var p=params[i].split('=');
		if (p[0] == theParameter) {
		  return decodeURIComponent(p[1]);
		}
	  }
	  return false;
}