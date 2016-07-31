function onEnded(){

	var self = angular.element(document.getElementById('MainController')).scope();
	self.$apply(self.setCarou());
	
}

function onPlay(){
	
	//$("#vodPlayer").get(0).play();
        $(".playpause").fadeOut();
	
	
	
}

function onPause(){
	
 //$("#vodPlayer").get(0).pause();
        $(".playpause").fadeIn();
	
}


function playPause(){
$('.wrapper').click(function () {
    if($("#vodPlayer").get(0).paused){
        $("#vodPlayer").get(0).play();
        $(".playpause").fadeOut();
    }else{
       $("#vodPlayer").get(0).pause();
        $(".playpause").fadeIn();
    }
});
}

function setVideoSize(){
	
	
  	  	 var videoHeight = $(window).height() * 0.7;
	     var videoWidth = $(window).width() * 0.7;
	
	  $("#vodPlayer").css("width", videoWidth);
	  $("#vodPlayer").css("height", videoHeight);

	
	
}

function onWindowsSizeChange(){
$( window ).resize(function() {
setVideoSize();
});
}