/* global $ */
// Sidebar 
$('.sidebar').click(function(){
	$('.ui.sidebar').sidebar('toggle');  
	
}); 

$('img').mouseenter(function(){
    $(this).transition('');
});



//----------------------------------------------
$('.shape').shape();

$('.shape').click(function(){
	$('.shape').shape('flip up');
}); 



