$(document).ready(function () {
  let cropper;
  const $imageChoose = $("#image-choose");
  const $imgChoosen = $("#img-choosen");
  const $cropperImage = $("#cropperImage");
  const $cropperModal = $("#cropperModal");
  const $saveCroppedImage = $("#saveCroppedImage");
  const $closeModal = $(".close");

  function resetInput() {
    $imageChoose.val(""); // Reset file input
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  $imageChoose.on("change", function () {
    const files = this.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        $cropperImage.attr("src", event.target.result);
        $cropperModal.show();
        if (cropper) {
          cropper.destroy();
        }
        cropper = new Cropper($cropperImage[0], {
          aspectRatio: 1,
          viewMode: 1,
        });
      };

      reader.readAsDataURL(file);
    }
  });

  $saveCroppedImage.on("click", function () {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      const base64encodedImage = canvas.toDataURL("image/jpeg");
      $imgChoosen.attr("src", base64encodedImage);
      $cropperModal.hide();
      resetInput(); // Reset input and destroy cropper
    }
  });

  $closeModal.on("click", function () {
    $cropperModal.hide();
    resetInput(); // Reset input and destroy cropper
  });

  $(window).on("click", function (event) {
    if (event.target == $cropperModal[0]) {
      $cropperModal.hide();
      resetInput(); // Reset input and destroy cropper
    }
  });

  $("#name").on("input", function () {
    $(".name-content").text($(this).val());
  });

  $("#title").on("input", function () {
    $(".title-content").text($(this).val());
  });

  $("#message").on("input", function () {
    $(".message-content").text($(this).val());
  });
  $("#submit").click(function () {
    const scale = window.innerWidth < 768 ? 10 : 5;
    html2canvas($("#frame-wrapper")[0], { scale, useCORS: true }).then(
      function (canvas) {
        // Tạo một URL cho ảnh
        var imgURL = canvas.toDataURL("image/png");

        // Tạo một liên kết tạm thời và tải ảnh về
        var dlLink = $("<a>")
          .attr({
            download: "Guiloiyeuthuong.png",
            href: imgURL,
            "data-downloadurl": [
              "image/png",
              "Guiloiyeuthuong.png",
              imgURL,
            ].join(":"),
          })
          .appendTo("body");
        dlLink[0].click();
      }
    );
  });
});
