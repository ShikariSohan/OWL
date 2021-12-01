
var ok=false;
if($(window).width()>800)
{
    $('.searchbar').css('display','block');
    
}
else{
    $('.searchIcon').css('display','block');
    $('.searchbar').css('display','none');
    
}
$(window).resize(function() {  
    if($(window).width()<800)
    {
      $('.home').css('display','none');
      if(ok!=true){
        $('.searchIcon').css('display','block'); 
        $('.fa-search').css('display','block'); 
        $('.searchbar').css('display','none');   
      }
      else{
        
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
        $('.searchbar').css('display','block');
    }

   
  }
  );
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    $('#info').addClass('d-none');
});
$('.fa-info').on('click',function(){
    $('#info').toggleClass('d-none');
    $('#sidebar').removeClass('active');
});




$('.fa-search').on('click',function(){
    if($(window).width()<800)
    {
        ok = true;
        $('.nav-item').css('display','none');
        $('.navItem').css('display','none');
        $('.searchbar').css('display','block');
        $('div.searchbar>input[type=text]').css('width','40vw');
        alert(ok);
    }
});
$('.searchbar').on('focus',function(){
  if($(window).width()<800)
  {
      ok = true;
      $('.nav-item').css('display','none');
      $('.navItem').css('display','none');
      $('.searchbar').css('display','block');
      $('div.searchbar>input[type=text]').css('width','40vw');
      alert(ok);
  }
});



