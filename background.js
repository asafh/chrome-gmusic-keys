var MusicPlayer = {
	tabs: [],
	tabLoaded: function(tab) {
		this.tabs.push(tab);
	},
	getTab: function() {
		return this.tabs.length ? this.tabs[0] : null;
	},
	removeTab: function(tabId) {
		this.tabs = this.tabs.filter(function(tab) {
			return tab.id !== tabId;
		});
	},
	sendCommand: function(command) {
		var tab = this.getTab();
		if(tab) {
			chrome.tabs.sendMessage(tab.id, command);
		}
	},
	focus: function() {
		var tab = this.getTab();
		if(tab) {
			chrome.tabs.update(tab.id, {active: true});
		}
		else {
			chrome.tabs.create({url: "https://play.google.com/music/listen"});
			// , function(tab) {
				// MusicPlayer.tab = tab;
			// }
		}
	}
};
chrome.tabs.onRemoved.addListener(MusicPlayer.removeTab.bind(MusicPlayer));
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(sender.tab) {
  		MusicPlayer.tabLoaded(sender.tab);
  	}
});

chrome.browserAction.onClicked.addListener(function() {
	MusicPlayer.focus();
});
chrome.commands.onCommand.addListener(function(cmd) {
	cmd = cmd.substr("cmd-".length);
	MusicPlayer.sendCommand({name:cmd});
});
