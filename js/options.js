function save_options() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	chrome.storage.sync.set({
		username: username,
		password: password
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Options have been saved';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		username: '',
		password: ''
	}, function(items) {
		document.getElementById('username').value = items.username;
		document.getElementById('password').value = items.password;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);