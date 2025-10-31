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

    domtoimage.toBlob(node, options)
      .then(function (blob) {
        // Ẩn loader
        loaderWrapper.style.display = 'none';

        // Tạo URL tạm cho Blob
        const blobUrl = URL.createObjectURL(blob);

        // Tạo ảnh kết quả
        const img = new Image();
        img.src = blobUrl;
        img.alt = 'Gửi lời yêu thương';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        img.style.marginTop = '10px';

        // Xóa nội dung cũ và chèn ảnh + nút tải xuống
        node.innerHTML = '';
        node.appendChild(img);

        // Tạo container cho các nút
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.justifyContent = 'center';

        // Nút tải xuống chính
        const downloadBtn = document.createElement('a');
        downloadBtn.textContent = '📥 Tải xuống';
        downloadBtn.download = 'Guiloiyeuthuong.png';
        downloadBtn.href = blobUrl;
        downloadBtn.style.display = 'inline-block';
        downloadBtn.style.background = '#4CAF50';
        downloadBtn.style.color = 'white';
        downloadBtn.style.padding = '10px 14px';
        downloadBtn.style.borderRadius = '8px';
        downloadBtn.style.textDecoration = 'none';
        downloadBtn.style.border = 'none';
        downloadBtn.style.cursor = 'pointer';

        // Nút mở ảnh trong tab mới (dự phòng)
        const openInNewTabBtn = document.createElement('a');
        openInNewTabBtn.textContent = '🖼️ Mở ảnh';
        openInNewTabBtn.href = blobUrl;
        openInNewTabBtn.target = '_blank';
        openInNewTabBtn.style.display = 'inline-block';
        openInNewTabBtn.style.background = '#2196F3';
        openInNewTabBtn.style.color = 'white';
        openInNewTabBtn.style.padding = '10px 14px';
        openInNewTabBtn.style.borderRadius = '8px';
        openInNewTabBtn.style.textDecoration = 'none';
        openInNewTabBtn.style.border = 'none';
        openInNewTabBtn.style.cursor = 'pointer';

        // Nút sao chép ảnh vào clipboard
        const copyImageBtn = document.createElement('button');
        copyImageBtn.textContent = '📋 Sao chép ảnh';
        copyImageBtn.style.display = 'inline-block';
        copyImageBtn.style.background = '#FF9800';
        copyImageBtn.style.color = 'white';
        copyImageBtn.style.padding = '10px 14px';
        copyImageBtn.style.borderRadius = '8px';
        copyImageBtn.style.textDecoration = 'none';
        copyImageBtn.style.border = 'none';
        copyImageBtn.style.cursor = 'pointer';

        copyImageBtn.onclick = async function () {
          try {
            // Chuyển blob sang canvas để copy
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const tempImg = new Image();

            tempImg.onload = function () {
              canvas.width = tempImg.width;
              canvas.height = tempImg.height;
              ctx.drawImage(tempImg, 0, 0);

              canvas.toBlob(async function (blob) {
                try {
                  const item = new ClipboardItem({ 'image/png': blob });
                  await navigator.clipboard.write([item]);
                  alert('✅ Đã sao chép ảnh vào clipboard!');
                } catch (err) {
                  console.error('Copy failed:', err);
                  fallbackCopy();
                }
              });
            };
            tempImg.src = blobUrl;
          } catch (error) {
            console.error('Copy error:', error);
            fallbackCopy();
          }
        };

        function fallbackCopy() {
          // Phương án dự phòng: hướng dẫn người dùng chụp màn hình
          showManualSavePopup();
        }

        // Thêm các nút vào container
        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(openInNewTabBtn);
        buttonContainer.appendChild(copyImageBtn);

        node.appendChild(buttonContainer);

        // Thêm hướng dẫn chụp màn hình
        const instruction = document.createElement('div');
        instruction.innerHTML = `
      <p style="font-size: 12px; color: #666; margin-top: 8px; text-align: center;">
        💡 <strong>Mẹo:</strong> Nếu không tải được, hãy thử:
        <br>1. Nhấn giữ ảnh → "Lưu ảnh"
        <br>2. Mở ảnh trong tab mới → Chụp màn hình
        <br>3. Dùng nút "Sao chép ảnh" (nếu trình duyệt hỗ trợ)
      </p>
    `;
        node.appendChild(instruction);

        // Popup hướng dẫn cải tiến
        showEnhancedPopup(blobUrl);
      })
      .catch(function (error) {
        console.error('Error generating image:', error);
        loaderWrapper.style.display = 'none';
        alert('❌ Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại!');
      });

    function showEnhancedPopup(blobUrl) {
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
        max-width: 350px;
        font-family: system-ui, sans-serif;
      ">
        <p style="font-size: 16px; margin-bottom: 8px; font-weight: bold;">
          ✅ Lời nhắn đã được tạo xong!
        </p>
        
        <div style="text-align: left; font-size: 14px; margin: 12px 0;">
          <p>📷 <strong>Cách lưu ảnh:</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Nhấn vào nút "Tải xuống"</li>
            <li>Hoặc nhấn giữ ảnh → "Lưu ảnh"</li>
            <li>Hoặc dùng nút "Mở ảnh" rồi chụp màn hình</li>
          </ul>
        </div>

        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <button id="closePopup" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">
            Đã hiểu
          </button>
          <button id="openImage" style="
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">
            🖼️ Mở ảnh
          </button>
          <button id="reloadPage" style="
            background: #FF9800;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">
            🔄 Tạo mới
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

      // Mở ảnh trong tab mới
      document.getElementById('openImage').addEventListener('click', () => {
        window.open(blobUrl, '_blank');
      });

      // Tải lại trang
      document.getElementById('reloadPage').addEventListener('click', () => {
        location.reload();
      });
    }

    function showManualSavePopup() {
      const manualPopup = document.createElement('div');
      manualPopup.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      max-width: 300px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    ">
      <p style="margin-bottom: 12px; font-weight: bold;">📸 Hướng dẫn lưu ảnh:</p>
      <p style="font-size: 14px; margin-bottom: 8px;">1. Nhấn giữ vào ảnh</p>
      <p style="font-size: 14px; margin-bottom: 8px;">2. Chọn "Lưu ảnh" hoặc "Save image"</p>
      <p style="font-size: 14px; margin-bottom: 12px;">3. Ảnh sẽ được lưu vào thư viện</p>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
      ">
        Đã hiểu
      </button>
    </div>
  `;
      document.body.appendChild(manualPopup);
    }
  });
});
