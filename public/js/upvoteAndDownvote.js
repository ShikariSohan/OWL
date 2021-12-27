var socket = io(); //exposes an io global which is used by a particular client.
    var upvote_val = false;
    var i=0;
    $('.upvote-btn').on('click',function(e){ //upvote event
     // $.post( "http://localhost:2727/login");
     i=$(this).index('.upvote-btn')
     upvote_val = upvote_val ? false: true;
    const id =$(this).parent().parent().siblings('.card-title').find(".postid a").attr('href').split('/').at(-1);
      e.preventDefault();   // prevent page reloading
     
      socket.emit( 'upvote-event',id ); //send the post id to server side by emitting
    });
    
    socket.on( 'update-upvotes', function( up,down,upButton) {
     var x = document.getElementsByClassName( 'upvote-count' )
     var y = document.getElementsByClassName( 'downvote-count' )
     if(upButton == true){
      $('.upvote-btn').eq(i).css('background-position', '2px 4px'); //change button colors
      $('.downvote-btn').eq(i).css('background-position', '2px -27px');
     }
     else
     $('.upvote-btn').eq(i).css('background-position', '2px -27px');
     x[i].innerHTML = up;
     y[i].innerHTML = down; // set the values
    });
    // downvote event
    var downvote_val = false;
    var j=0;
    $('.downvote-btn').on('click',function(e){
      j=$(this).index('.downvote-btn')
      downvote_val = downvote_val ? false: true;
     const id =$(this).parent().parent().siblings('.card-title').find("a").attr('href').split('/').at(-1);
     e.preventDefault();   // prevent page reloading
     
      socket.emit( 'downvote-event',id ); //send the post id to server side
    })
    socket.on( 'update-downvotes', function( up,down,downButton) {
      var x = document.getElementsByClassName( 'downvote-count' )
      var y = document.getElementsByClassName( 'upvote-count' )
      if(downButton == true){
      $('.downvote-btn').eq(j).css('background-position', '2px 4px');
      $('.upvote-btn').eq(j).css('background-position', '2px -27px');
      }
     else
     $('.downvote-btn').eq(j).css('background-position', '2px -27px');
      x[j].innerHTML = down;
      y[j].innerHTML = up;
      
     });