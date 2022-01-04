
const dt = new DataTransfer(); 
$("#image").on('change', function(e){
  console.log(this.files);
	for(var i = 0; i < this.files.length; i++){
    let file = this.files.item(i);
    console.log(this.files.item(i));
    var reader = new FileReader(); 
    reader.readAsDataURL(this.files.item(i));
    reader.onloadend = function () {
		let fileBlock = $('<span/>', {class: 'file-block'}),
			 fileImg = $('<img/>', {class: file.name, src: this.result, width:"150px" ,height:"auto"});
		fileBlock.append(fileImg).append('<div class="file-delete"><i class="fa fa-times text-center"></i></div>')
			
		$("#filesList > #files-names").append(fileBlock);
    }
	};
	
	for (let file of this.files) {
		dt.items.add(file);
	}
	
	this.files = dt.files;

  $(document).on('click', '.file-delete', function() { 
    alert('yoo');
		let name = $(this).siblings().attr('class');
    alert(name);	
		$(this).parent().remove();
		for(let i = 0; i < dt.items.length; i++){
		
			if(name === dt.items[i].getAsFile().name){
			
				dt.items.remove(i);
				continue;
			}
		}
	
		document.getElementById('image').files = dt.files;
	});
});
