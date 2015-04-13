
var j$ = jQuery.noConflict();

var url = '';
var forceDotCom = /force.com/;
var tabId = '';
var kbQuery = '/services/data/v32.0/query?q=select id, title, summary, hint__c, details__c from SDO_Help__kav where publishstatus = \'Online\' AND language=\'en_US\'';


var client_id = '3MVG9fMtCkV6eLhem2P._pba98PIPTkbUroTjppPisi2EeBTAEIPuru3dknJTsMEDVoLM6z4UIGFsLnMnBznj';
var client_secret = '3876085622831172519';
var redirect_uri = 'sdoInspector://success';
var username = '';
var password = ''

var session = null;

chrome.storage.sync.get({
	username: '',
	password: ''
}, function(items) {
	username = items.username;
	password = items.password;
});

/*
 * when tab is activated check for force URL and knowledge article
 */
chrome.tabs.onActivated.addListener(function(evt){ 
	chrome.tabs.get(evt.tabId, function(tab){
		if(url != tab.url) {
			processTab(tab);
		}
	});
});

/*
 * when tab is updated, check for force url and knowledge article
 */
chrome.tabs.onUpdated.addListener(function(evt){
	chrome.tabs.get(evt, function(tab) {
		if(url != tab.url) {
			processTab(tab)
		}
	});
});

/*
 * Checks for force URL and loads page action if positive
 */
function processTab(tab) {
	url = tab.url;
	console.log('TAB ID ['+tab.id+']');
	if(tab.id != null) {
		tabId = tab.id;
	}
	if(forceDotCom.exec(tab.url) != null){
		chrome.pageAction.show(tabId);
		findArticle(tab);
	} else {
		chrome.pageAction.hide(tabId);
	}
}

function findArticle(tab) {
	if(session == null) {
		console.log('Attempt to login using ['+username+']['+password+']');
		var apiCall = 'https://login.salesforce.com/services/oauth2/token?';
		apiCall += 'grant_type=password&client_id='+client_id+'&client_secret='+client_secret+'&username=tsellers@qbranch.org&password=Demo1234';
	
		var url = 'https://login.salesforce.com/services/oauth2/token';
		var data = {
			grant_type: 'password',
			client_id: client_id,
			client_secret: client_secret,
			username: username,
			password: password
		};
		postAjax(url, data).success(function(result) {
			session = result;
			kbQuery = session.instance_url + kbQuery;
			console.log(JSON.stringify(result));
			getKB(tab);
		});
	} else {
		console.log('using existing session');
		getKB(tab);
	}
}

function getKB(tab) {
	var forceURL = tab.url;
	var parts = forceURL.split(".com");
	console.log(JSON.stringify(parts[1]));
	var query = kbQuery + ' AND url__c = \''+parts[1]+'\'';
	console.log(query);
	getAjax(query).success(function(success) {
		console.log(JSON.stringify(success));
	});	
}
function postAjax(url, data) {
	return j$.ajax({
		type: 'POST',
		url: url,
		data: data,
		beforeSend: function(xhr) {
			if(session != null && session.hasOwnProperty('access_token')) {
				console.log('setting tokens');
				xhr.setRequestHeader('Authorization','Bearer '+session.access_token);
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR.status + ': ' + errorThrown);
		}
	})
}
function getAjax(url) {
	return j$.ajax({
		type: 'GET',
		url: url,
		beforeSend: function(xhr) {
			if(session != null && session.hasOwnProperty('access_token')) {
				console.log('setting tokens');
				xhr.setRequestHeader('Authorization','Bearer '+session.access_token);
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR.status + ': ' + errorThrown);
		}
	})
}
/*
 * Message published from content.js. 
 */
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
