var MusicPlayer = {
	tabs: [],
	getTab: function() {
		return this.tabs.length ? this.tabs[0] : null;
	},
	removeTab: function(tabId) {
		this.tabs = this.tabs.filter(function(tab) {
			return tab.id !== tabId;
		});
	},
	queryTabs: function(tabId, info, tab) {
		var me = this;
		chrome.tabs.query({"url":"https://play.google.com/music/*"}, function(tabs) {
			me.tabs = tabs;
		});
	},
	sendCommand: function(command) {
		var tab = this.getTab();
		if(tab) {
			var ok = false;
			function die() {
				if(!ok) {
					chrome.tabs.remove(tab.id);
					MusicPlayer.sendCommand(command); //Retry
				}
			}
			setTimeout(die, 150);
			chrome.tabs.sendMessage(tab.id, command, function(resp) {
				ok = resp;
			});
		} else {
			this.createMusicTab();
		}
	},
	createMusicTab: function() {
		chrome.tabs.create({url: "https://play.google.com/music/listen"});
	},
	focus: function() {
		var tab = this.getTab();
		if(tab) {
			chrome.tabs.update(tab.id, {active: true});
		}
		else {
			this.createMusicTab();
		}
	}
};
chrome.tabs.onRemoved.addListener(MusicPlayer.removeTab.bind(MusicPlayer));
chrome.tabs.onUpdated.addListener(MusicPlayer.queryTabs.bind(MusicPlayer));

chrome.browserAction.onClicked.addListener(function() {
	 MusicPlayer.focus();
});
chrome.commands.onCommand.addListener(function(cmd) {
	cmd = cmd.substr("cmd-".length);
	MusicPlayer.sendCommand({name:cmd});
});
