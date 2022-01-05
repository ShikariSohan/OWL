var socket = io(); //exposes an io global which is used by a particular client.
    var upvote_val = false;
    var i=0;
    $('.upvote-btn').on('click',function(e){ //upvote event
     // $.post( "http://localhost:2727/login");
     i=$(this).index('.upvote-btn')
     upvote_val = upvote_val ? false: true;
    const id =$(this).parent().parent().siblings('.card-title').find(".postid a").attr('href').split('/').at(-1);
     const id1= $(this).parent().attr('id');
    e.preventDefault();   // prevent page reloading
     
      socket.emit( 'upvote-event',id, id1); //send the post id to server side by emitting
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
      const id =$(this).parent().parent().siblings('.card-title').find(".postid a").attr('href').split('/').at(-1);
     const id1= $(this).parent().attr('id');
     e.preventDefault();   // prevent page reloading
     
      socket.emit( 'downvote-event',id,id1 ); //send the post id to server side
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


     /// comment

    var upvote_val_comment = false;
    var k=0;
    $('.upvote-btn-comment').on('click',function(e){ //upvote event
     // $.post( "http://localhost:2727/login");
     k=$(this).index('.upvote-btn-comment')
     upvote_val_comment = upvote_val_comment ? false: true;
    const id =$(this).parent().attr('id');
    const id2 =$(this).parent().parent().attr('id');
    
      e.preventDefault();   // prevent page reloading
     
      socket.emit( 'upvote-event-comment',id,id2); //send the  id to server side by emitting
    });
    
    socket.on( 'update-upvotes-comment', function( up,down,upButton) {
     var x = document.getElementsByClassName( 'upvote-count-comment' )
     var y = document.getElementsByClassName( 'downvote-count-comment' )
     if(upButton == true){
      $('.upvote-btn-comment').eq(k).css('background-position', '2px 4px'); //change button colors
      $('.downvote-btn-comment').eq(k).css('background-position', '2px -27px');
     }
     else
     $('.upvote-btn-comment').eq(k).css('background-position', '2px -27px');
     x[k].innerHTML = up;
     y[k].innerHTML = down; // set the values
    });
    // downvote event
    var downvote_val_comment = false;
    var l=0;
    $('.downvote-btn-comment').on('click',function(e){
      l=$(this).index('.downvote-btn-comment')
      downvote_val = downvote_val ? false: true;
     const id =$(this).parent().attr('id');
     const id2 =$(this).parent().parent().attr('id');
     e.preventDefault();   // prevent page reloading
     
      socket.emit( 'downvote-event-comment',id,id2 ); //send the post id to server side
    })
    socket.on( 'update-downvotes-comment', function( up,down,downButton) {
      var x = document.getElementsByClassName( 'downvote-count-comment' )
      var y = document.getElementsByClassName( 'upvote-count-comment' )
      if(downButton == true){
      $('.downvote-btn-comment').eq(l).css('background-position', '2px 4px');
      $('.upvote-btn-comment').eq(l).css('background-position', '2px -27px');
      }
     else
     $('.downvote-btn-comment').eq(l).css('background-position', '2px -27px');
      x[l].innerHTML = down;
      y[l].innerHTML = up;
      
     });
     let starIndex = 0;
     $('.starbtn').on('click',function(e){
       starIndex=$(this).index('.starbtn');
       cmntId = $(this).attr('id').split('-').at(-1);
       alert(cmntId);
       e.preventDefault();   // prevent page reloading
     
      socket.emit( 'starbtn',cmntId);
     })
     socket.on( 'update-star', function(id) {
       alert(id)
       var update = 'cmnt-'+id;
      var x = document.getElementsById(update);
      alert(x);
      x.addClass('checked');
     })