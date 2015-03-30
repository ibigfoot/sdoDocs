console.log('~~background.js');

var url = '';
var forceDotCom = /salesforce.com/;
	
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
	console.log(JSON.stringify(tab));
	if(forceDotCom.exec(tab.url) != null){
		chrome.browserAction.enable();
		console.log('have sfdc URL');
	} else {
		chrome.browserAction.disable();
	}
}
