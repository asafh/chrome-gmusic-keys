var MusicPlayer = {
	tab: null,
	sendCommand: function(command) {
		if(this.tab) {
			chrome.tabs.sendMessage(this.tab.id, command);
		}
	},
	focus: function() {
		if(this.tab) {
			chrome.tabs.update(this.tab.id, {active: true});
		}
		else {
			chrome.tabs.create({url: "https://play.google.com/music/listen"}, function(tab) {
				MusicPlayer.tab = tab;
			});
		}
	}
};
chrome.tabs.onRemoved.addListener(function(tabId) {
	var mp = MusicPlayer; //Not assuming this method is bound..
	if(mp.tab && mp.tab.id == tabId) {
		mp.tab = null;
	}
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	MusicPlayer.tab = sender.tab;
});

chrome.browserAction.onClicked.addListener(function() {
	MusicPlayer.focus();
});
chrome.commands.onCommand.addListener(function(cmd) {
	cmd = cmd.substr("cmd-".length);
	MusicPlayer.sendCommand({name:cmd});
});
