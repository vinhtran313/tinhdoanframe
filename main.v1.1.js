// import { saveAs } from "file-saver";
document.addEventListener("DOMContentLoaded", async () => {
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
  await signInAnonymously(auth).catch(console.error);
  // Submit handler
  submitBtn.addEventListener("click", async () => {
    loaderWrapper.style.display = "flex";
    const node = document.getElementById("frame-wrapper");

    const options = {
      quality: 0.9,
      width: node.offsetWidth * 2,
      height: node.offsetHeight * 2,
      style: {
        transform: "scale(2)",
        transformOrigin: "top left",
      },
    };

    try {
      // 📸 Tạo ảnh
      const dataUrl = await domtoimage.toPng(node, options);
      const blob = await (await fetch(dataUrl)).blob();

      if (blob.size > 10 * 1024 * 1024) {
        alert("Ảnh quá lớn (trên 10MB)!");
        loaderWrapper.style.display = "none";
        return;
      }

      // ☁️ Upload lên Firebase Storage
      const fileRef = ref(storage, `images/${Date.now()}.png`);
      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);

      loaderWrapper.style.display = "none";

      // 🖼 Hiển thị ảnh
      const img = new Image();
      img.src = imageUrl;
      img.alt = "Lời yêu thương";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "12px";
      img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      img.style.marginTop = "10px";

      node.innerHTML = "";
      node.appendChild(img);

      // 📂 Nút mở tab mới
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

      openBtn.addEventListener("click", () => {
        const win = window.open();
        if (win) {
          win.document.write(`
            <title>Lời yêu thương</title>
            <img src="${imageUrl}" alt="Lời yêu thương" 
            style="max-width:100%;height:auto;display:block;margin:auto;border-radius:12px"/>
          `);
        } else {
          alert("Trình duyệt đã chặn cửa sổ mới.");
        }
      });

      // 🪧 Popup hướng dẫn
      const popup = document.createElement("div");
      popup.innerHTML = `
        <div style="
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;">
          <div style="
            background: white; padding: 20px; border-radius: 12px; text-align: center;
            max-width: 320px; font-family: system-ui, sans-serif;">
            <p style="font-size: 16px; margin-bottom: 8px;">✅ Lời nhắn của bạn đã sẵn sàng!</p>
            <p style="font-size: 14px; color: #555; margin-bottom: 8px;">
              📷 Nhấn **và giữ vào ảnh** để tải xuống,<br>
              hoặc bấm “Mở ảnh trong tab mới”.
            </p>
            <p style="font-size: 12px; color: #777; margin-bottom: 12px; line-height: 1.4;">
              ⚠️ Một số thiết bị không cho phép tải trực tiếp — bạn có thể mở tab mới để lưu thủ công.
            </p>
            <div style="display: flex; justify-content: center; gap: 10px;">
              <button id="closePopup" style="
                background: #4CAF50; color: white; border: none;
                padding: 8px 14px; border-radius: 6px; cursor: pointer;">
                Đã hiểu
              </button>
              <button id="reloadPage" style="
                background: #2196F3; color: white; border: none;
                padding: 8px 14px; border-radius: 6px; cursor: pointer;">
                🔄 Tạo mới
              </button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(popup);

      document.getElementById("closePopup").onclick = () => document.body.removeChild(popup);
      document.getElementById("reloadPage").onclick = () => location.reload();

    } catch (err) {
      console.error("❌ Lỗi tạo ảnh:", err);
      loaderWrapper.style.display = "none";
      alert("Không thể tạo ảnh, vui lòng thử lại!");
    }

  });
});
