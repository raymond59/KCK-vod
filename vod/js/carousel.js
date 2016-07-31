
var currentItemNext = 3;
var currentItemPrev = 1;
$(document).ready(function() {

 navigateOwl();
  	//$(".owl-item.active").eq(2).focus();
	//alert(document.activeElement);
});



function startOwl(){
	
	
	 var owl = $("#owl-demo");
 
  owl.owlCarousel(
  {    loop: true,
    margin: 10,
    items: 5,
	stagePadding: 50
}
  );
  setItemBorder(2);
owl.on('mousewheel', '.owl-stage', function (e) {
    if (e.deltaY>0) {
        owl.trigger('next.owl.carousel');
		setItemBorder(currentItemNext);
    } else {
        owl.trigger('prev.owl.carousel');
		setItemBorder(currentItemPrev);
    }
    
	e.preventDefault();
	

	
});


	
 /*
   carousel.owlCarousel({
   items : 4,
   lazyLoad : true,
   navigation : true,
   afterAction: function(el){
   //remove class active
   this
   .$owlItems
   .removeClass('active')

   //add class active
   this
   .$owlItems //owl internal $ object containing items
   .eq(this.currentItem + 1)
   .addClass('active')    
    } 
    });
	
	*/
	
	
};

function navigateOwl(){
$(document).keydown(function(e) {
    	
	switch(e.which) {
        case 37: // left

		$("#owl-demo").trigger('prev.owl.carousel');
		setItemBorder(currentItemPrev);
        break;

        case 38: // up
        break;

        case 39: // right
		

		$("#owl-demo").trigger('next.owl.carousel');
		setItemBorder(currentItemNext);
        break;

        case 40: // down
        break;
		

		
        default: return; // exit this handler for other keys
    }
	

    e.preventDefault(); // prevent the default action (scroll / move caret)
});


}


function setItemBorder(currentItem){
	
	
			$(".owl-item").css({'border': '',
    'border-radius'
	: '0px'});
	
	$(".owl-item").attr("position","0")
	
	$(".owl-item.active").eq(currentItem).css({'border': '2px solid red',
    'border-radius'
	: '5px'});
	$(".owl-item.active").eq(currentItem).attr("position","center");
	
	
	
	}