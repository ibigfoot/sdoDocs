
var url = '';
var forceDotCom = /force.com/;
var tabId = '';
chrome.tabs.onActivated.addListener(function(evt){ 
	chrome.tabs.get(evt.tabId, function(tab){
		if(url != tab.url) {
			processTab(tab);
		}
	});
});

chrome.tabs.onUpdated.addListener(function(evt){
	chrome.tabs.get(evt, function(tab) {
		if(url != tab.url) {
			processTab(tab)
		}
	});
});

function processTab(tab) {
	url = tab.url;
	console.log('TAB ID ['+tab.id+']');
	if(tab.id != null) {
		tabId = tab.id;
	}
	if(forceDotCom.exec(tab.url) != null){
		chrome.pageAction.show(tabId);
	} else {
		chrome.pageAction.hide(tabId);
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.hasOwnProperty('action')) {
		if(request.action == 'clearBadge') {
			chrome.pageAction.setIcon({tabId:tabId, path:'qbranchLogo.png'});
		}
		if(request.action == 'setKnowledge') {
			chrome.pageAction.setPopup({popup: "kbDetails.html?p1="+request.greeting, tabId:tabId});
			chrome.pageAction.setIcon({tabId:tabId, path:'qbranchLogoKB.png'});	
		}
		
	}
});
