
var ok=false;
var backarrow = false;
function responsive(){
  if($(window).width()<426)
  {
    $('.navbar-brand').css('display','none'); 
  }
  if($(window).width()>1200)
{
    $('#info').addClass('d-block'); 
}

  if($(window).width()<800)
  {
    $('.home').css('display','none');
    if(ok!=true){
      $('.searchIcon').css('display','block'); 
      $('.fa-search').css('display','block'); 
      $('.searchbar').css('display','none');   
    }
    else{
      $('.fa-arrow-left').css('display','block');
      $('.searchbar').css('display','block');
      $('.nav-item').css('display','none');
       $('.navItem').css('display','none');
      
       
    }
    

}
  else{
      $('.nav-item').css('display','block');
     $('.navItem').css('display','block');
     $('.home').css('display','block');
     $('.fa-search').css('display','none'); 
     $('.fa-arrow-left').css('display','none');
      $('.searchbar').css('display','block');
  }

 

}
if($(window).width()>800)
{
    $('.searchbar').css('display','block'); 
}
else{
    $('.searchIcon').css('display','block');
    $('.searchbar').css('display','none');
    
}

$(window).resize(responsive);





$('.fa-search').on('click',function(){
    if($(window).width()<800)
    {
        ok = true;
        $('.nav-item').css('display','none');
        $('.navItem').css('display','none');
        $('.searchbar').css('display','block');
        $('.fa-arrow-left').css('display','block');
        $('div.searchbar>input[type=text]').css('width','40vw');
        alert(ok);
    }
});
$('.fa-arrow-left').on('click',function(){
  ok=false;
   $(this).css('display','none');
   $('.nav-item').css('display','block');
   $('.navItem').css('display','block');
   $('.fa-search').css('display','block');
   $('.searchbar').css('display','none');
   $('.home').css('display','none');
  
});


$('#sidebarCollapse').on('click', function () {
  $('#sidebar').toggleClass('active');
  $('.collapse.in').toggleClass('in');
  $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  $('#info').addClass('d-none');
});
$('.fa-info').on('click',function(){
  $('#info').removeClass('d-block');
  $('#info').toggleClass('d-none');
  $('#sidebar').removeClass('active');
});
document
$(document).on("click", "#reportID", function () {
  alert('yoo');
});