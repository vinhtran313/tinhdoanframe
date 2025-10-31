// import { saveAs } from "file-saver";
document.addEventListener("DOMContentLoaded", function () {
  let cropper;
  const imageChoose = document.getElementById("image-choose");
  const imgChoosen = document.getElementById("img-choosen");
  const cropperImage = document.getElementById("cropperImage");
  const cropperModal = document.getElementById("cropperModal");
  const saveCroppedImage = document.getElementById("saveCroppedImage");
  const closeModal = document.querySelector(".close");
  const nameInput = document.getElementById("name");
  const titleInput = document.getElementById("title");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("submit");
  const loaderWrapper = document.querySelector(".loader-wrapper");

  function resetInput() {
    imageChoose.value = "";
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  // Image cropper functionality
  imageChoose.addEventListener("change", function () {
    const files = this.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        cropperImage.src = event.target.result;
        cropperModal.style.display = "block";
        if (cropper) {
          cropper.destroy();
        }
        cropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  saveCroppedImage.addEventListener("click", function () {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      const base64encodedImage = canvas.toDataURL("image/jpeg");
      imgChoosen.src = base64encodedImage;
      cropperModal.style.display = "none";
      resetInput();
    }
  });

  closeModal.addEventListener("click", function () {
    cropperModal.style.display = "none";
    resetInput();
  });

  window.addEventListener("click", function (event) {
    if (event.target === cropperModal) {
      cropperModal.style.display = "none";
      resetInput();
    }
  });

  // Text input handlers
  nameInput.addEventListener("input", function () {
    const nameContent = document.querySelector(".name-content");
    if (nameContent) {
      nameContent.textContent = this.value;
    }
  });

  titleInput.addEventListener("input", function () {
    const titleContent = document.querySelector(".title-content");
    if (titleContent) {
      titleContent.innerHTML = this.value.replace(/\n/g, "<br>");
    }
  });

  messageInput.addEventListener("input", function () {
    const messageContent = document.querySelector(".message-content");
    if (messageContent) {
      messageContent.textContent = this.value;
    }
  });

  // Submit handler
  submitBtn.addEventListener("click", function () {
    loaderWrapper.style.display = "flex";
    const node = document.getElementById("frame-wrapper");
    const scaleObject = window.innerWidth < 768 ? 10 : 5;
    const options = {
      width: node.offsetWidth * scaleObject,
      height: node.offsetHeight * scaleObject,
      style: {
        transform: "scale(" + scaleObject + ")",
        transformOrigin: "top left",
      },
      quality: 1,
    };

      domtoimage.toPng(node, options)
        .then(function(dataUrl) {
          return domtoimage.toPng(node, options);
        })
        .then(function(data1) {
          const link = document.createElement('a');
          link.download = 'Guiloiyeuthuong.png';
          link.href = data1;
          document.body.appendChild(link);
          document.body.removeChild(link);
          loaderWrapper.style.display = 'none';
          window.open(link, '_blank').focus();
        })
        .catch(function(error) {
          console.error('Error generating image:', error);
          loaderWrapper.style.display = 'none';
        });
    // domtoimage
    //   .toBlob(node, options)
    //   .then(function (blob) {
    //     // saveAs(blob, "Guiloiyeuthuong.png");
    //     loaderWrapper.style.display = "none";
    //   })
    //   .catch(function (error) {
    //     console.error("Error generating image:", error);
    //     loaderWrapper.style.display = "none";
    //   });
  });
});
