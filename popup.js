document.addEventListener('DOMContentLoaded', function() {
    function getQueryVariable(query,variable) {
        if(!query) query = "";
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }
    document.querySelector("#reset").addEventListener('click', function(){
        chrome.storage.sync.remove('pumpo');
        window.close();
    },false);
    chrome.storage.sync.get(['pumpo'], function(result) {
        console.log(result);
        if(!result.pumpo){
            chrome.tabs.getSelected(function(tab){
                var salt = "f7f4bfe315e49ea255950b05635c82f1";
                var query = tab.url.split("?")[1];
                var c_salt = getQueryVariable(query, 'salt');
                if(c_salt != salt) {
                    var client_id = "439763550870.438322247635";
                    var scope = "incoming-webhook";
                    var redirect_uri = "https://pumpo-server-side.firebaseapp.com/completed.html";
                    var querystring = "?client_id="+client_id+"&scope="+scope+"&redirect_uri="+redirect_uri;
                    chrome.tabs.create({
                        url: "https://slack.com/oauth/authorize"+querystring
                    });
                } else {
                    var team_name = getQueryVariable(query, 't'); 
                    var url = getQueryVariable(query, 'u'); 
                    var channel = getQueryVariable(query, 'c'); 
                    var configuration_url = getQueryVariable(query, 'cu'); 
                    chrome.storage.sync.set({'pumpo': {team_name: team_name, url: url, channel: channel, configuration_url:configuration_url}});
                }
            });
        } else {
            document.getElementById("team").innerText = result.pumpo.team_name; 
            document.getElementById("channel").innerText = result.pumpo.channel; 
            chrome.tabs.getSelected(function(tab){
                var title = encodeURIComponent(tab.title); 
                var url = encodeURIComponent(tab.url);
                var urlbase = encodeURIComponent(result.pumpo.url);
                var src = 'https://pumpo-server-side.firebaseapp.com/?rand=' + Math.round(Math.random() * 10000000) 
                src += '&title='+title; 
                src += '&url='+url; 
                src += '&urlbase='+urlbase;
                document.getElementById('pumpo-server').src = src;
            });        
        }
    });    
});
