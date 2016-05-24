// Custom functions


//Slider Thumb
function animateThumb(){
	//Thumb animation when touching
	for(i=0;i<5;i++){
		$.slider.thumbImage = "/thumbAnimation/thumbanimation"+(i+1)+".png";
		setTimeout(function(){},100);
	}
}
function thumbReverse(){
	//Reverse Thumb Animation
	for(i=5;i>0;i--){
		$.slider.thumbImage = "/thumbAnimation/thumbanimation"+i+".png";
		setTimeout(function(){},100);
	}
	$.slider.thumbImage = "UIImages/thumb2.png";
}


//Music transport
function nextSong(){ //Skips current song
	if(musicindex==Object.keys(songs).length-1){
		//If is last song, goes back to first
		player.stop();
		player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[0].file,allowBackground:true});
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		$.playButton.backgroundImage = "UIImages/pause.png";
		musicindex = 0;
		setTitle();
	}else{
		//If it is not last song, goes to the next one
		player.stop();
		player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[musicindex+1].file,allowBackground:true});
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		$.playButton.backgroundImage = "UIImages/pause.png";
		musicindex += 1;
		setTitle();
	}
}
function previous(){ //Goes to previous soung
	if(player.getTime()<5000 || !player.isPlaying()){
		//Less than 5s, previous song
		if(musicindex==0){
			//first song, play last song
			player.stop();
			player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[Object.keys(songs).length-1].file,allowBackground:true});
			player.allowBackground = true;
			player.setTime = 0;
			player.play();
			if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
			addplayerEventListener();
			$.playButton.backgroundImage = "UIImages/pause.png";
			musicindex = Object.keys(songs).length-1;
			//songTitle.text = songs[musicindex].title;
			setTitle();
		}else{
			//not first song, play previous
			player.stop();
			player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[musicindex-1].file,allowBackground:true});
			player.allowBackground = true;
			player.setTime = 0;
			player.play();
			if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
			addplayerEventListener();
			$.playButton.backgroundImage = "UIImages/pause.png";
			musicindex -= 1;
			//songTitle.text = songs[musicindex].title;
			setTitle();
		}
	}else{
		//More than 5s, rewind the song
		player.stop();
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
	}
}
function addplayerEventListener(){ // Function to add complete event listener to player
	player.addEventListener('complete', function(e){
	// Called when the song ends
	if(musicindex<(Object.keys(songs).length-1) || repeat==true ){
		nextSong();
	}else{
		musicindex = 0;
		player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[0].file,allowBackground:true});
		player.allowBackground = true;
		$.playButton.backgroundImage = "UIImages/play.png";
		$.songTitle.text = songs[0].title;
		setTitle();
	}
	clearInterval(nextinterval);
});	
}


//Labels
function convertToMinutes(seconds){ //Convert from seconds to minutes:seconds
	minutes = 0;
	secondsf= 0;
	if(seconds !=0){
	minutes = Math.round(seconds/60.0-(seconds%60)/60);
	secondsf = Math.round(seconds - minutes*60);
	}
	if(secondsf.toString().length==1){
		return (minutes+":0"+secondsf);
	}else{
		return (minutes+":"+secondsf);
	}
}
function setTitle(){ //Actually sets more than just the title
	//Set Music Title
	$.songTitle.text = songs[musicindex].title;
	if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS"){
		nowPlayingInfo.setTitle(songs[musicindex].title);
		nowPlayingInfo.setArtist(songs[musicindex].artist);
		nowPlayingInfo.setPlaybackDuration(player.getDuration());
		nowPlayingInfo.setArtwork(songs[musicindex].image);
	}
	$.songTitle.width = Ti.Platform.displayCaps.platformWidth*0.6;
	$.songTitle.height = 30;
	$.albumImage.image = songs[musicindex].image;
	$.artistTitle.text = songs[musicindex].artist;
	if(musicindex==Object.keys(songs).length-1){
		$.nextAlbumImage.image = songs[0].image;
	}else{
		$.nextAlbumImage.image = songs[musicindex+1].image;
	}
	if(musicindex==0){
		$.prevAlbumImage.image = songs[Object.keys(songs).length-1].image;
	}else{
		$.prevAlbumImage.image = songs[musicindex-1].image;
	}
}


//Misc
function getRandomInt(min, max) { //Returns a random integer between given values
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomPlaylist(){
	//Create a random array containing the songs in a random order
	size = Object.keys(originalPlaylist).length;
	randomPlaylist = null;
	randomPlaylist = [];
	value = 0;
	copyPlaylist = originalPlaylist.slice();
	randomPlaylist[0] = copyPlaylist[musicindex];
	copyPlaylist.splice(musicindex,1);
	for(i=0;i<size-1;i++){
		value = Math.round(Math.random()*(Object.keys(copyPlaylist).length-1));
		randomPlaylist.push(copyPlaylist[value]);
		copyPlaylist.splice(value,1);
	}
	
	songs = null;
	songs = randomPlaylist;
	
}
//Change songs according to selected item on listView
exports.changeSong = function(e) {
	if(shuffle==false) musicindex2 = e.itemIndex;
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
		player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,url:songs[musicindex2].file,allowBackground:true});
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		$.playButton.backgroundImage = "UIImages/pause.png";
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
	} else {
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
		$.playButton.backgroundImage = "UIImages/pause.png";
	}
};
var addressesText;
exports.readText = function(url){
                   var client = Ti.Network.createHTTPClient({
                       onload : function(e) {
                          addressesText = this.responseText;
                          feedPlaylist(addressesText);
                       },
                       onerror : function(e) {
                           Ti.API.debug(e.error);
                           alert('error');
                       },
                       timeout : 5000
                   });
                   client.open("GET", url);
                   client.send();
};
var parts;
var get_file = function(url) {
  var xhr = Ti.Network.createHTTPClient({
		onload: function(e){
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,current_download+".mp3");
		f.write(this.responseData); // write to the file
	current_download++;
	Ti.API.info( 'Downloading '+current_download+' of '+ files_arr.length);
	if(current_download==files_arr.length) downloadImages();
	if ( current_download < files_arr.length) {
			get_file(files_arr[current_download]);
		}
	},
		onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			console.log('error '+ url);
		},
		timeout: 5000
		/* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send(); // request is actually sent with this statement
};
var get_image = function(url) {
  var xhr = Ti.Network.createHTTPClient({
		onload: function(e){
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,current_image+".png");
		f.write(this.responseData); // write to the file
	current_image++;
	Ti.API.info( 'Downloading '+current_image+' of '+ images_arr.length);
	if(current_image==images_arr.length) downloaded();
	if ( current_image < images_arr.length) {
			get_image(images_arr[current_image]);
		}
	},
		onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			console.log('error '+ url);
		},
		timeout: 5000
		/* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send(); // request is actually sent with this statement
};
var current_download = 0;
var current_image = 0;
var files_arr = [];
var images_arr = [];
function downloadImages(){
	for(i=1;i<parts.length;i+=4){
		images_arr.push(parts[i]);
	}
	get_image(images_arr[current_image]);
}
function feedPlaylist(adressesText){
	parts = addressesText.split(";");
	for(i=0;i<parts.length;i+=4){
		files_arr.push(parts[i]);
	}
	get_file(files_arr[current_download]);
}
function downloaded(){
	originalPlaylist = null;
	originalPlaylist = [];
	for(i=0;i<parts.length;i+=4){
		originalPlaylist.push({
			title: String(parts[i+2]),
			artist: String(parts[i+3]),
			file: Ti.Filesystem.applicationDataDirectory+"/"+i/4+".mp3",
			image: Ti.Filesystem.applicationDataDirectory+"/"+i/4+".png"
		});
	}
	alert("Ready");
	songs = originalPlaylist.slice();
	musicindex = 0;
	setTitle();
	player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK, url: songs[0].file,allowBackground:true});
}
// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

//Event Listeners
$.slider.addEventListener('touchstart', function(e){ // Event Listener for start touching slider thumb, animate thumb going to selected state and set touching to true
	touching = true;
	animateThumb();
});
$.slider.addEventListener('touchend', function(e){ // Event Listener for releasing slider thumb, animate thumb going back to normal and set touching to false
	touching = false;
	thumbReverse();
});
$.albumImage.addEventListener('swipe',function(e){
	if(e.direction=='left'){
		//Next song
		nextSong();
	}else if(e.direction=='right'){
		//Previous song
		previous();
	}else if(e.direction=='down'){
		$.playerWindow.close();
	}
});
$.repeatButton.addEventListener('click', function(e){ // Repeat on/off event listener
	// Activate/Deactivate repeat
	if(repeat==false){
		//repeatButton.title = 'Repeat: ON';
		$.repeatButton.backgroundImage = "UIImages/repeatactivate.png";
		repeat = true;
	}else{
		//repeatButton.title = 'Repeat: OFF';
		$.repeatButton.backgroundImage = "UIImages/repeat.png";
		repeat = false;
	}
});
$.shuffleButton.addEventListener('click',function(e){ // Activate/Deactivate shuffle
	if(shuffle==false){
		createRandomPlaylist();
		musicindex = 0;
		shuffle = true;
		//shuffleButton.title = "Shuffle: ON";
		$.shuffleButton.backgroundImage = "UIImages/shuffleactivate.png";
		setTitle();
	}else{
		already = false;
		for(i =0;i<Object.keys(songs).length;i++){
			if(songs[musicindex].title==originalPlaylist[i].title && already==false){
				musicindex = i;
				already = true;
			} 
		}
		songs = null;
		songs = originalPlaylist.slice();
		shuffle = false;
		//shuffleButton.title = "Shuffle: OFF";
		$.shuffleButton.backgroundImage = "UIImages/shuffle.png";
		setTitle();
	}
});
$.nextButton.addEventListener('singletap', function(e){ // Next song button event listener
	nextSong();
});
$.prevButton.addEventListener('singletap', function(e){ // Previous song button event listener
	previous();
});
$.nextButton.addEventListener('longpress', function(e){ // Event Listener for long press of nextButton, increases playing speed
		count = 0; 
		value = 1000;
		nextinterval = setInterval(function(){
			if(count>=10){
				value = 10000; 
			}
			if(player.getDuration()*1000-player.getTime()>value){
				player.setTime(player.getTime()+value);
			}else{
				if(musicindex<Object.keys(songs).length-1 || repeat==true){
					nextSong();
				}else{
					musicindex = 0;
					player = Ti.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK, url: songs[0].file,allowBackground:true});
					player.allowBackground = true;
					$.playButton.backgroundImage = "UIImages/play.png";
					setTitle();
				}
				clearInterval(nextinterval);
			}
			count += 1;
		},100);
});
$.nextButton.addEventListener('touchend', function(e){ // Event Listener for releasing nextButton, clear the looping interval
	clearInterval(nextinterval);
});
$.prevButton.addEventListener('longpress', function(e){ // Event Listener for long press of prevButton, rewinds the song
	count = 0;
	value = 1200;
	previnterval = setInterval(function(){
		if(count>=10) value = 10200;
		if(player.getTime()>value){
			player.setTime(player.getTime()-value);
		}else{
			player.setTime(0);
		}
		count +=1;
	},100);	
});
$.prevButton.addEventListener('touchend', function(e){ // Event Listener for releasing prevButton, clear the looping interval
	clearInterval(previnterval);
});
$.playButton.addEventListener('click', function(e){ // Add event listener to play/pause button
	// Play/Stop the song
	if(player.isPlaying()){
		$.playButton.backgroundImage = "UIImages/play.png";
		player.pause();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(0);
	} else{
		$.playButton.backgroundImage = "UIImages/pause.png";
		player.play();
		if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setPlaybackRate(1);
	}
});
//Media control
if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS"){
var mediaControls = require("de.codewave.ti.mediacontrols");
var mediaControlsView = mediaControls.createView({left:0,top:0,right:0,bottom:0});
var nowPlayingInfo = mediaControls.createNowPlayingInfo();
mediaControlsView.addEventListener("remoteControlPlay", function() {
	Titanium.API.info("Remote control 'play'.");
	player.play();
	nowPlayingInfo.setPlaybackRate(1);
	$.playButton.backgroundImage = "UIImages/pause.png";
});
mediaControlsView.addEventListener("remoteControlPause", function() {
	Titanium.API.info("Remote control 'pause'.");
	$.playButton.backgroundImage = "UIImages/play.png";
	player.pause();
	nowPlayingInfo.setPlaybackRate(0);
}); 
mediaControlsView.addEventListener("remoteControlStop", function() {
	Titanium.API.info("Remote control 'stop'.");
	player.stop();
    nowPlayingInfo.clear();
}); 
mediaControlsView.addEventListener("remoteControlPreviousTrack", function() {
	Titanium.API.info("Remote control 'previous track'.");
	previous();
});
mediaControlsView.addEventListener("remoteControlNextTrack", function() {
	Titanium.API.info("Remote control 'next track'.");
	nextSong();
}); 
}else{
	mediaControls = "";
}





//Initialization
/*var songsDirectory = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory+'songs');
var filesList = songsDirectory.getDirectoryListing();
var id3Module = require('ID3/src/id3');
for(i=0;i<filesList.length;i++){
	id3Module.loadTags(Ti.Filesystem.resourcesDirectory+'songs/'+filesList[i]);
	var tags = id3Module.getAllTags(Ti.Filesystem.resourcesDirectory+'songs/'+filesList[i]);
	alert(tags);
}*/

var randomPlaylist = [];
var originalPlaylist = [];
/*originalPlaylist.push({
	title: "Bidolibido",
	artist: "Vintage Culture, Shapeless",
	file: "songs/sound.wav",
	image: "Img/bidolibido.png"
});*/
originalPlaylist.push({
	title: "Running Wild (Project 46 Remix)",
	artist: "Morgan Page ft. The Oddictions, Britt Daley",
	file: "songs/sound2.mp3",
	image: "Img/rw.png"
});
originalPlaylist.push({
	title: "Hands to Myself (Ftampa Bootleg)",
	artist: "Selena Gomez",
	file: "songs/sound3.mp3",
	image: "Img/Htm.png"
});
originalPlaylist.push({
	title: "S.I.D.H.A.N.",
	artist: "FTampa",
	file:"songs/SIDHAN.mp3",
	image: "Img/Sidhan.png"
});
originalPlaylist.push({
	title: "Feels (KSHMR Remix)",
	artist: "Kiara",
	file:"songs/Feels RMX.mp3",
	image: "Img/Feels.png"
});

Alloy.Globals.originalPlaylist = originalPlaylist;
var songs = originalPlaylist.slice(); // Create an array of songs based on the originalPlaylist array
var repeat = false; // Repeat is off by default
var shuffle = false; // Shuffle is off for default
var musicindex = 0; // This variable is the current song index
var player = Titanium.Media.createSound({audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK, url: "songs/sound2.mp3", allowBackground: true}); // Create a new sound called player
Titanium.Media.audioSessionCategory = Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK; // Set audioSessionCategory
Titanium.Media.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK; // Set audioSessionMode
player.allowBackground = true; // Theoretically allows background, but not working
addplayerEventListener(); // Calls the addplayerEventListener
var touching = false; // Feedback variable if user is touching slider thumb or not
var lastPosition = 0; // lastPosition variable is used to check if the slider position changed, and if not, let the music keep playing 
time=setInterval(function(){ // Update the elapsed ,remaining time and slider position, if user change the slider position, it changes the song elapsed time
$.elapsedTime.text = convertToMinutes(Math.round(player.getTime()/1000.0));
$.remaining.text = "-"+convertToMinutes(Math.round(player.getDuration()-player.getTime()/1000.0));
if(Ti.Platform.name == "iPhone OS" || Ti.Platform.name == "iPad OS") nowPlayingInfo.setElapsedPlaybackTime(Math.round(player.getTime()/1000.0));

if(touching==false){// If user is not touching, set slider value to elapsed time/ duration
	$.slider.value = player.getTime()/(player.getDuration()*1000)*100;
}
if(touching==true){// If user is touching, set the song elapsed time to slider value*duration
	if(lastPosition!=$.slider.value){
		player.setTime($.slider.value*10.0*player.getDuration());
		//label.text = convertToMinutes(Math.round(player.getTime()/1000.0));
		//remaining.text = "-"+convertToMinutes(Math.round(player.getDuration()-player.getTime()/1000.0)); 
		lastPosition = $.slider.value;
	}
}
},200);
nextinterval = 0; // Next interval will be used as a looping event to increase playing speed when holding nextButton, it is declared here so it can be acessed outside the event listener *SCOPE
previnterval = 0; // prev interval will be used as a looping event to rewind song when holding prevButton, it is declared here so it can be acessed outside the event listener *SCOPE
setTitle(); // Set title and other relevant information according to now playing song