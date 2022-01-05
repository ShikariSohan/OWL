$(document).ready(function(){
  $(".crtGrp")
       .on('mouseover',function() {
         $(".crtGrp img").attr("src","/img/grp hover.png");
       })
       .on('mouseout', function() {
        $(".crtGrp img").attr('src', "/img/grp.png");
    });
  $(".joinGrp")
  .on('mouseover',function()
   {$(".joinGrp img").attr("src","/img/join hover.png");
  })
  .on('mouseout', function() {
    $(".joinGrp img").attr('src', "/img/join.png");
})
$('.drpd-btn').submit(function (e) {

  e.preventDefault();
})
});

var ok=false;
var backarrow = false;
if($(window).width() < 900){
  $('#info').removeClass('d-block');
$('#info').addClass('d-none');
}
function responsive(){
  if($(window).width()<426)
  {
    $('.navbar-brand').css('display','none'); 
  }
  if($(window).width()>1200)
{
    $('#info').addClass('d-block'); 
}
else if($(window).width()<900)
{
  $('#info').removeClass('d-block'); 
    $('#info').addClass('d-none'); 
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
    if($(window).width() < 900)
    $('#info').addClass('d-none');
  
});
$('.fa-info').on('click',function(){
  $('#info').removeClass('d-block');
  $('#info').toggleClass('d-none');
  $('#sidebar').removeClass('active');
});

$('.see-more').on('click',function(){
 $(this).siblings().removeClass('collapsed');
 $(this).remove();
})
//reply

$('.reply').on('click',function()
  {
    if($('#cke_replies').is(':visible'))
    {
      console.log('yo');
      $('#cke_replies').parent().remove();
    }
   $(this).closest( ".comment" ).siblings('form').append(
     '<div class="form-group"> <textarea class="form-control" name="comment" id="replies" required> </textarea> </div><button type="submit" class="btn btn-primary mb-2">Comment</button>'
     
     )
     Ckeditor();
  
}
)
function Ckeditor(){
let editor1 = CKEDITOR.replace( 'replies');
   editor1.on( 'contentDom', function() {
    let editable = editor1.editable();
    editable.attachListener( editable, 'click', function( evt ) {
   let link = new CKEDITOR.dom.elementPath( evt.data.getTarget(), this ).contains( 'a' );
 if ( link && evt.data.$.button != 2) {
   window.open( link.getAttribute( 'href' ) );
 }
}, null, null, 15 );
} );
}