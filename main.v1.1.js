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
        // Gửi ảnh lên imgbb
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const formData = new FormData();
        formData.append("image", base64Data);

        return fetch(`https://api.imgbb.com/1/upload?key=eb07973ae2294c461019109ef8f6c2a7`, {
          method: "POST",
          body: formData,
        });
      })
      .then(response => response.json())
      .then(result => {
        if (!result.success) throw new Error("Upload thất bại!");

        const imageUrl = result.data.url;
        loaderWrapper.style.display = "none";

        // Hiện ảnh kết quả
        const img = new Image();
        img.src = imageUrl;
        img.alt = "Lời yêu thương";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "12px";
        img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        img.style.marginTop = "10px";

        node.innerHTML = "";
        node.appendChild(img);

        // Tạo nút mở tab mới
        const openBtn = document.createElement("button");
        openBtn.textContent = "📷 Mở ảnh trong tab mới";
        openBtn.style.display = "inline-block";
        openBtn.style.marginTop = "10px";
        openBtn.style.background = "#4CAF50";
        openBtn.style.color = "white";
        openBtn.style.padding = "10px 14px";
        openBtn.style.border = "none";
        openBtn.style.borderRadius = "8px";
        openBtn.style.cursor = "pointer";
        openBtn.style.fontFamily = "system-ui, sans-serif";
        node.appendChild(openBtn);

        openBtn.addEventListener("click", function () {
          try {
            const win = window.open();
            if (win) {
              win.document.write(`
                <title>Lời yêu thương</title>
                <img src="${dataUrl}" alt="Lời yêu thương" 
                style="max-width:100%;height:auto;display:block;margin:auto;"/>
              `);
            } else {
              alert("Trình duyệt đã chặn cửa sổ mới. Vui lòng bật cho phép popup.");
            }
          } catch (e) {
            console.error("Không thể mở tab mới:", e);
            alert("Không thể mở tab mới. Vui lòng thử lại.");
          }
        });

        // Popup hướng dẫn
        const popup = document.createElement("div");
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
                ✅ Lời nhắn của bạn đã sẵn sàng!
              </p>
              <p style="font-size: 14px; color: #555; margin-bottom: 8px;">
                📷 Nhấn **và giữ vào ảnh** để tải xuống, <br>
                hoặc bấm nút “Mở ảnh trong tab mới”.
              </p>
              <p style="font-size: 12px; color: #777; margin-bottom: 12px; line-height: 1.4;">
                ⚠️ Một số thiết bị không cho phép tải trực tiếp — bạn có thể mở tab mới để lưu thủ công.
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
                  🔄 Tạo lời nhắn mới
                </button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(popup);

        document.getElementById("closePopup").addEventListener("click", () => {
          document.body.removeChild(popup);
        });

        document.getElementById("reloadPage").addEventListener("click", () => {
          location.reload();
        });
      })
      .catch(function (error) {
        console.error("Error generating image:", error);
        loaderWrapper.style.display = "none";
        alert("Không thể tạo ảnh. Vui lòng thử lại.");
      });
  });
});
