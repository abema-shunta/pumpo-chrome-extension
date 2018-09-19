document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(function(tab){
        console.log(tab);
        var title = encodeURIComponent(tab.title); 
        var url = encodeURIComponent(tab.url);
        var src = 'https://pumpo-server-side.firebaseapp.com/?rand=' + Math.round(Math.random() * 10000000) 
        src += '&title='+title; 
        src += '&url='+url; 
        document.getElementById('pumpo-server').src = src;
    });
});
