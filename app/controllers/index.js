function doClick(e) {
    alert($.label.text);
}

$.navigationWindow.open();
/*var items = [
	{properties: {title: "Music 1"}},
	{properties: {title: "Music 2"}},
	{properties: {title: "Music 3"}}
];*/
function updateList(url){
	var client = Ti.Network.createHTTPClient({
                       onload : function(e) {
                          addressesText = this.responseText;
                          parts = addressesText.split(";");
                          songs = [];
                          for(i=2;i<parts.length;i+=4){
                          	songs.push({properties: {title: parts[i]}});
                          }
                          $.songsList.sections[0].setItems(songs);
                          
                       },
                       onerror : function(e) {
                           Ti.API.debug(e.error);
                           alert('error');
                       },
                       timeout : 5000
                   });
                   client.open("GET", url);
                   client.send();
}
var items = [];
var playerWindow = Alloy.createController('playerWindow');
for(i=0; i<Object.keys(Alloy.Globals.originalPlaylist).length;i++ ){ // Loop songs array, get song names and store them on musics array
	items.push({properties: {title: Alloy.Globals.originalPlaylist[i].title}});
}
$.songsList.sections[0].setItems(items);
nowPlayingButton = Titanium.UI.createButton({
	title: 'Now Playing'
});
resetButton = Ti.UI.createButton({
	title: 'Load from Web'
});
$.indexWindow.setRightNavButton(nowPlayingButton);
$.indexWindow.setLeftNavButton(resetButton);
resetButton.addEventListener('click', function(e){
	if(vwAlert.visible){
		vwAlert.setVisible(false);
		vwAlert.hide();
	}else{
		vwAlert.show();
		vwAlert.setVisible(true);
	}
});
nowPlayingButton.addEventListener('click',function(e) {
	$.navigationWindow.openWindow(playerWindow.getView());
});
$.songsList.addEventListener('itemclick',function(e){
	playerWindow.changeSong(e);
	$.navigationWindow.openWindow(playerWindow.getView());
});
var vwAlert = Ti.UI.createView({
    backgroundColor : '#999999',
    width       : '90%',
    height      : '40%',
    layout      : 'vertical',
    borderWidth: '5px',
    borderRadius: 5
}); 

var lblMessage = Ti.UI.createLabel({
    text        : 'Enter info file address:',
    top         : 10,
    color       : 'white',
    font        : {fontWeight : 'bold', fontSize : '16'}
});

var textField = Ti.UI.createTextField({
    width       :  '90%',
    top         :  '20',
        passwordMask: false,
    hintText    : 'Enter address',
    borderStyle     : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    returnKeyType   : Ti.UI.RETURNKEY_RETURN,
    maxLength       : 70
});

var btnOK = Ti.UI.createButton({
    title   : 'OK',
    width   : '43%',
    top     : '25',
    left:'20%' ,
    font    : {fontWeight : 'bold', fontSize : '16'}
});
var btnCancel = Ti.UI.createButton({
    title   : 'Cancel',
    width   : '43%',
    top     : '0',
    right:'20%' ,
    font    : {fontWeight : 'bold', fontSize : '16'}
});
vwAlert.add(lblMessage);
vwAlert.add(textField);
vwAlert.add(btnOK);
vwAlert.add(btnCancel);
$.indexWindow.add(vwAlert);
vwAlert.hide();
vwAlert.setVisible(false);
btnCancel.addEventListener('click',function(e){
	vwAlert.hide();
	vwAlert.setVisible(false);
});
btnOK.addEventListener('click', function(e){
	vwAlert.hide();
	vwAlert.setVisible(false);
	playerWindow.readText(textField.getValue());
	updateList(textField.getValue());
});
/*
$.songsList.addEventListener('itemclick', function(e){ // Event Listener for clicking on a song on listView
	if($.shuffle==false) musicindex2 = e.itemIndex;
	else{
		already = false;
		for(i = 0;i<Object.keys(songs).length;i++){
			if(songs[i].title == originalPlaylist[e.itemIndex].title && already==false){
				musicindex2 = i;
				already = true;
			}
		}
	}
	if(musicindex!=musicindex2){
		player.stop();
		player = Ti.Media.createSound(songs[musicindex2].file);
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		playButton.backgroundImage = "UIImages/pause.png";
		musicindex = musicindex2;
		setTitle();
		if(shuffle==true){
		already = false;
		for(i =0;i<Object.keys(songs).length;i++){
			if(songs[musicindex].title==originalPlaylist[i].title && already==false){
				musicindex = i;
				already = true;
			} 
		}
		songs = null;
		songs = originalPlaylist.slice();
		createRandomPlaylist();
		musicindex = 0;
		}
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") win3.openWindow(win1, {animated:true});
		else win1.show();
	} else {
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		playButton.backgroundImage = "UIImages/pause.png";
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") win3.openWindow(win1, {animated:true});
		else win1.show();
	}
});*/