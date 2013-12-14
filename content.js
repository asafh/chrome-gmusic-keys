// chrome.runtime.sendMessage(true); //Notify of new tab, true is an arbitrary value

/**
 * Runs the code given in an immediately invoked function expression in the context of the window rather of the content script.
 * The enumerable owned properties of the data argument are passed to the IIFE as arguments with matching names.
 * The values on data must be JSONisable. The keys must be valid Javascript variable names.  
 * @param {Object} code
 * @param {Object} data
 */
function executeScript(code, data) {
	//Content scripts are sandboxed, so we to run code in the window context from we inject a SCRIPT element to the DOM
	var script = document.createElement("script");
	var wrappedCode;
	var argNames = [];
	var argValues = [];
	if(data) {
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				argNames.push(key);
				argValues.push(data[key]);
			}
		}
	}
	wrappedCode = "(function("+argNames.join(",")+") {\n"+
						code + 
				  "\n}).apply(null,"+JSON.stringify(argValues)+")";
	script.innerHTML = wrappedCode;
	document.body.appendChild(script);
}


function fireSJBEvent(name) {
	executeScript("SJBpost('"+name+"')");
}

function fireClickEvent(selector) {
	//See http://stackoverflow.com/a/4176116/777203
	var code = 'debugger; var e = document.createEvent("MouseEvents"); ' +
				'e.initEvent("click", true, true); ' +
				'var target = document.querySelector(selector); ' +
				'target.dispatchEvent(e);';
	
	executeScript(code, {selector: selector});
}
function fireClickDataID(id) {
	fireClickEvent("[data-id='"+id+"']");
}

var COMMANDS = {
	"stop": function() {
		fireSJBEvent('stopPlay')
	},
	"pause": function() {
		fireSJBEvent('pauseSong')
	},
	"shuffleAll": function() {
		fireSJBEvent('shuffleAll')
	},
	
	"playPause": function() {
		fireClickDataID("play-pause");
		//fireSJBEvent('playPause')
	},
	"next": function() {
		fireClickDataID("forward");
	},
	"prev": function() {
		fireClickDataID("rewind");
	},
	"shuffle": function() {
		fireClickEvent(".player-middle > [data-id='shuffle']");
	},
	"repeat": function() {
		fireClickDataID("repeat");
	}
}
chrome.runtime.onMessage.addListener(function(command, sender, sendResponse) {
    sendResponse(true);
    var cmd = COMMANDS[command.name];
    cmd.apply(cmd,command.args);
  });
