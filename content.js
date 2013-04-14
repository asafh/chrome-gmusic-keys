chrome.runtime.sendMessage(true); //Notify of new tab, true is an arbitrary value

function fireSJBEvent(name) {
	var script = document.createElement("script");
	script.innerHTML = "SJBpost('"+name+"')";
	document.body.appendChild(script); //Content scripts are sandboxed, so we to invoke SJBpost from the regular context we inject a SCRIPT element to the DOM 
}

var COMMANDS = {
	// "play": function() {
		// // document.getElementById(":0").playSong(); //This only causes the flash to play, doesn't update UI etc
	// },
	"stop": function() {
		fireSJBEvent('stopPlay')
	},
	"pause": function() {
		// document.getElementById(":0").pauseSong();
		fireSJBEvent('pauseSong')
	},
	"playPause": function() {
		fireSJBEvent('playPause')
	},
	"shuffleAll": function() {
		fireSJBEvent('shuffleAll')
	},
	"next": function() {
		fireSJBEvent('nextSong')
	},
	"prev": function() {
		fireSJBEvent('prevSong')
	}
}
chrome.runtime.onMessage.addListener(
  function(command, sender, sendResponse) {
    var cmd = COMMANDS[command.name];
    cmd.apply(cmd,command.args);
  }
);
