var socket = io();
    var upvote_val = false;
    var i=0;
    $('.upvote-btn').on('click',function(e){
     // $.post( "http://localhost:2727/login");
     i=$(this).index('.upvote-btn')
     const id =$(this).siblings('.card-title').find("a").attr('href').split('/').at(-1);
     // alert(id);
      e.preventDefault();   // prevent page reloading
      
      upvote_val = upvote_val ? false: true;
      
      socket.emit( 'upvote-event', upvote_val, id );
    });
    
    socket.on( 'update-upvotes', function( f_str ) {
     var x = document.getElementsByClassName( 'upvote-count' )
     x[i].innerHTML = f_str;
    });