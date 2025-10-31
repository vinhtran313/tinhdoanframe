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
      .then(function (dataUrl) {
        // Ẩn loader
        loaderWrapper.style.display = 'none';

        // Tạo ảnh kết quả
        const img = new Image();
        img.src = dataUrl;
        img.alt = 'Gửi lời yêu thương';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        img.style.marginTop = '10px';

        // Xóa nội dung cũ và chèn ảnh
        node.appendChild(img);
        const downloadBtn = document.createElement('a');
        downloadBtn.textContent = '📥 Tải xuống';
        downloadBtn.download = 'Guiloiyeuthuong.png';
        downloadBtn.href = dataUrl;
        downloadBtn.style.display = 'inline-block';
        downloadBtn.style.marginTop = '10px';
        downloadBtn.style.background = '#4CAF50';
        downloadBtn.style.color = 'white';
        downloadBtn.style.padding = '10px 14px';
        downloadBtn.style.borderRadius = '8px';
        downloadBtn.style.textDecoration = 'none';
        node.innerHTML = '';
        node.appendChild(downloadBtn);

        // Popup hướng dẫn người dùng
        const popup = document.createElement('div');
        popup.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          max-width: 320px;
          font-family: system-ui, sans-serif;
        ">
          <p style="font-size: 16px; margin-bottom: 8px;">
            ✅ Lời nhắn đã được tạo xong!
          </p>
          <p style="font-size: 14px; color: #555; margin-bottom: 8px;">
            📷 Nhấn và giữ vào khung lời nhắn hoặc bấm nút tải xuống để tải lời nhắn.
          </p>
          <p style="font-size: 13px; color: #777; margin-bottom: 8px;">
            🔄 Nếu muốn tạo thêm lời nhắn mới, hãy tải lại trang.
          </p>
          <p style="font-size: 12px; color: #999; margin-bottom: 12px; line-height: 1.4;">
            🙏 Xin lỗi vì sự bất tiện — do giới hạn bảo mật của hệ điều hành, ứng dụng không thể tải lời nhắn về máy một cách trực tiếp.
          </p>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <button id="closePopup" style="
              background: #4CAF50;
              color: white;
              border: none;
              padding: 8px 14px;
              border-radius: 6px;
              cursor: pointer;
            ">
              Đã hiểu
            </button>
            <button id="reloadPage" style="
              background: #2196F3;
              color: white;
              border: none;
              padding: 8px 14px;
              border-radius: 6px;
              cursor: pointer;
            ">
              🔄 Tải lại trang
            </button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(popup);

        // Đóng popup
        document.getElementById('closePopup').addEventListener('click', () => {
          document.body.removeChild(popup);
        });

        // Tải lại trang
        document.getElementById('reloadPage').addEventListener('click', () => {
          location.reload();
        });
      })
      .catch(function (error) {
        console.error('Error generating image:', error);
        loaderWrapper.style.display = 'none';
      });

  });
});
