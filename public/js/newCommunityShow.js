$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) 
    var recipient = button.data('whatever') 
    var modal = $(this)
    modal.find('.modal-title').text('Hello ' + recipient)
    var name = modal.find('#recipient-name');
    modal.find('#submitNewCommunity').click(function (){ 
      check().then(data => {
        let {ok}=data;
        console.log(ok);
        if(ok)
     {
      $("#newCommunityForm").submit();
     }
     else {
       alert("Name Already Taken")
       return;
     }
      });
     
    })
  
  })
 async function  check(){
   const name = document.getElementById("recipient-name");
   const data = { name: name.value };
   const response = await fetch('/c/checkname', {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });
  return response.json();
 }
