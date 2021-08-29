$(document).on("click", "i.del", function () {
    $(this).parent().remove();
  });
  $(function () {
    $(document).on("change", ".img", function () {
      var uploadFile = $(this);
      var files = !!this.files ? this.files : [];
      alert(files.length);
      if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
     
    function preview(file){
      if (/^image/.test(file.type)) {
        // only image file
        var reader = new FileReader(); // instance of the FileReader
        reader.readAsDataURL(file); // read the local file
  
        reader.onloadend = function () {
          // set image data as background of div
          
          var newImg= uploadFile.next().find(".row")
          newImg.append(
           '<div class="col-sm-2 imgUp"><div class="imagePreview"></div><i class="fa fa-times del"></i></div>'
          )
          $( ".row .imgUp:last-child .imagePreview" ).css("background-image", "url(" + this.result + ")");
          
        };
      }
    }//preview
    if (files) {
      [].forEach.call(files, preview);
    }
    });
  });
