function upload_img(img) {
  if (img.files && img.files[0]) {

    const name = img.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1).toLowerCase();

    if (ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'png') {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#img_add').attr('src', e.target.result);
      }
      reader.readAsDataURL(img.files[0]);
      $('#change_photo').val(1);
      $('#choose_file').html(name);

    } else {
      alert('Debe seleccionar una imagen!');
    }




  }
}