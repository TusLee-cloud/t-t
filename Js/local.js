/* =====================================================
   CONFIG
===================================================== */
const NAME_KEY = "visitorName";
const TIME_KEY = "visitorNameTime";
const LIXI_KEY = "lixi_result";

/* thời gian tồn tại tên (phút) */
const EXPIRE_MINUTES = 10;
const EXPIRE_TIME = EXPIRE_MINUTES * 60 * 1000;

/* =====================================================
   HÀM DÙNG CHUNG
===================================================== */
function getUserName(){
  return localStorage.getItem(NAME_KEY) || "bạn";
}

function getSavedName(){
  const name = localStorage.getItem(NAME_KEY);
  const time = localStorage.getItem(TIME_KEY);

  if(!name || !time) return null;

  if(Date.now() - Number(time) > EXPIRE_TIME){
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(TIME_KEY);
    localStorage.removeItem(LIXI_KEY);
    return null;
  }
  return name;
}

/* =====================================================
   OVERLAY NHẬP TÊN
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const overlay   = document.getElementById("overlay");
  const logArea   = document.getElementById("logArea");
  const inputLine = document.getElementById("inputLine");
  const nameInput = document.getElementById("nameInput");
  const hint      = document.getElementById("hint");

  if (!overlay || !logArea || !inputLine || !nameInput) return;

  /* ================= LOG SYSTEM ================= */
  const logs = [
    "[SYSTEM] KHỞI ĐỘNG GIAO DIỆN TẾT 2026...",
    "[SECURITY] KIỂM TRA LÌ XÌ...",
    "[DATA] NẠP MAY MẮN & TÀI LỘC...",
    "[ACCESS] TRUY CẬP THÀNH CÔNG ✔",
    "[INPUT] XIN PHÉP CHO BIẾT QUÝ DANH..."
  ];

  let logIndex   = 0;
  let charIndex  = 0;
  let inputShown = false; // 🔒 khóa không cho hiện sớm

  function showInputOnce(){
    if (inputShown) return;
    inputShown = true;

    inputLine.classList.remove("hidden");
    hint?.classList.remove("hidden");

    // mobile: focus sau 1 nhịp nhỏ
    setTimeout(() => {
      nameInput.focus();
    }, 300);
  }

  function typeLog(){
    // ✅ chỉ khi CHẠY HẾT TOÀN BỘ logs
    if (logIndex === logs.length) {
      showInputOnce();
      return;
    }

    if (!logArea.children[logIndex]) {
      const div = document.createElement("div");
      div.className = "line";
      logArea.appendChild(div);
    }

    const line   = logs[logIndex];
    const lineEl = logArea.children[logIndex];

    lineEl.textContent += line.charAt(charIndex);
    charIndex++;

    if (charIndex < line.length) {
      setTimeout(typeLog, 40);
    } else {
      // xong 1 dòng
      charIndex = 0;
      logIndex++;
      setTimeout(typeLog, 500);
    }
  }

  /* ================= ĐÃ CÓ TÊN TRƯỚC ĐÓ ================= */
  const savedName = typeof getSavedName === "function" ? getSavedName() : null;

  if (savedName) {
    overlay.classList.add("exit");
    setTimeout(() => overlay.remove(), 300);
    window.dispatchEvent(new Event("username-ready"));
    return;
  }

  // 🔥 bắt đầu chạy log
  typeLog();

  /* ================= INPUT THẬT ================= */
  nameInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const name = nameInput.value.trim();
    if (!name) return;

    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(TIME_KEY, Date.now());

    window.dispatchEvent(new Event("username-ready"));

    overlay.classList.add("exit");
    setTimeout(() => overlay.remove(), 800);
  });

});


/* =====================================================
   GÕ LỜI CHÚC + HIỆN LÌ XÌ
===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{

  let typingDone = false;
  let nameReady  = false;

  const wishBox  = document.querySelector(".wish-box");
  const wishText = document.getElementById("wishText");
  const lixiBox  = document.getElementById("lixiBox");

  if(!wishBox || !wishText || !lixiBox) return;

  lixiBox.classList.remove("lixi-show");

  function getWishLines(){
    return [
      `Xin chào ${getUserName()}`,
      "Tiền vô như nước – Lộc tràn",
      "như xuân 2026"
    ];
  }

  function typeLines(lines){
    wishText.innerHTML = "";

    let lineIndex = 0;
    let charIndex = 0;

    let lineEl = document.createElement("div");
    lineEl.className = "wish-line";
    wishText.appendChild(lineEl);

    const timer = setInterval(()=>{
      const line = lines[lineIndex];
      const char = line.charAt(charIndex);

      lineEl.textContent += char;
      charIndex++;

      if(charIndex === line.length){
        lineIndex++;
        charIndex = 0;

        if(lineIndex === lines.length){
          clearInterval(timer);
          lixiBox.classList.add("lixi-show");
          return;
        }

        lineEl = document.createElement("div");
        lineEl.className = "wish-line";
        wishText.appendChild(lineEl);
      }
    }, 80);
  }

  function tryStart(){
    if(typingDone || !nameReady) return;
    typingDone = true;
    typeLines(getWishLines());
  }

  if(localStorage.getItem(NAME_KEY)){
    nameReady = true;
  }

  window.addEventListener("username-ready", ()=>{
    nameReady = true;
    tryStart();
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        tryStart();
      }
    });
  },{ threshold: 0.4 });

  observer.observe(wishBox);
});

/* =====================================================
   LÌ XÌ SLOT – GHÉP SỐ TIỀN
===================================================== */
function formatVND(num){
  return Number(num).toLocaleString("vi-VN") + " VND";
}

  const LUCKY_MEANING = {
    10000: "🍀 Khởi đầu thuận lợi – đầu năm lấy vía",
    15000: "🌱 Sinh phúc – năm mới nhiều sinh khí",
    20000: "🎉 Song hỷ – niềm vui nhân đôi",
    28000: "📈 Mãi phát – làm ăn lên đều",
    33000: "💎 Tài – Lộc – Thọ",
    36000: "🧧 Tài lộc đủ đầy",
    39000: "⏳ Tài lộc bền lâu",
    50000: "⚖️ Cân bằng – vững vàng",
    68000: "🔥 Lộc phát – tiền vô như nước",
    88000: "🚀 Đại phát – thăng tiến mạnh",
    99000: "♾️ May mắn lâu dài",
    100000:"👑 Viên mãn – tròn đầy phúc lộc"
  };

function randomMoney(){
  const min = 10000;
  const max = 100000;
  const step = 1000;

  if(Math.random() < 0.3){
    const lucky = Object.keys(LUCKY_MEANING);
    return Number(lucky[Math.floor(Math.random() * lucky.length)]);
  }

  const count = (max - min) / step + 1;
  return min + Math.floor(Math.random() * count) * step;
}


/* ================== DIALOG (GLOBAL) ================== */
let dialog, closeBt, upload, preview, sendBtn;

function openWishDialog(){
  if(!dialog) return;
  dialog.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeWishDialog(){
  debugger
  dialog.classList.remove("show");
  document.body.style.overflow = "";
}

/* ================== MAIN ================== */
document.addEventListener("DOMContentLoaded", () => {

 const LUCKY_MEANING = {
    10000: "🍀 Khởi đầu thuận lợi – đầu năm lấy vía",
    15000: "🌱 Sinh phúc – năm mới nhiều sinh khí",
    20000: "🎉 Song hỷ – niềm vui nhân đôi",
    28000: "📈 Mãi phát – làm ăn lên đều",
    33000: "💎 Tài – Lộc – Thọ",
    36000: "🧧 Tài lộc đủ đầy",
    39000: "⏳ Tài lộc bền lâu",
    50000: "⚖️ Cân bằng – vững vàng",
    68000: "🔥 Lộc phát – tiền vô như nước",
    88000: "🚀 Đại phát – thăng tiến mạnh",
    99000: "♾️ May mắn lâu dài",
    100000:"👑 Viên mãn – tròn đầy phúc lộc"
  };

  function randomMoney(){

    const roll = Math.random();

    let min, max;

    if(roll < 0.1){
      // 30% → 200k–250k
      min = 200000;
      max = 250000;

    }else if(roll < 0.4){
      // 40% → 100k–199k
      min = 100000;
      max = 199999;

    }else{
      // 30% → 50k–99k
      min = 50000;
      max = 99999;
    }

    const money = Math.floor(Math.random() * (max - min + 1)) + min;

    return String(money).padStart(6, "0");
  }

  function formatVND(num){
    return Number(num).toLocaleString("vi-VN") + "đ";
  }

  /* ================== ELEMENT ================== */
  const envelope = document.getElementById("lixiEnvelope");
  const lixiText = document.getElementById("lixiText");
  const slots    = document.querySelectorAll(".slot");

  /* ===== TẠO NÚT "NHẬN MAY MẮN" BẰNG JS ===== */
  let openBtn = document.getElementById("openDialogBtn");

  if (!openBtn) {
    openBtn = document.createElement("button");
    openBtn.id = "openDialogBtn";
    openBtn.className = "hidden";
    openBtn.textContent = "Nhận may mắn";
    envelope.after(openBtn);
  }

  /* ================== LÌ XÌ ================== */
  if (envelope && slots.length === 6) {

    let rolling = false;

    /* ===== ĐÃ NHẬN TRƯỚC ĐÓ ===== */
    const saved = localStorage.getItem(LIXI_KEY);
    if (saved) {
      const digits = String(saved).padStart(6, "0").split("");
      slots.forEach((s, i) => s.textContent = digits[i]);

      lixiText.innerHTML = `🎉 Bạn nhận được <b>${formatVND(saved)}</b>`;

      envelope.style.display = "none";   // ⬅️ ẨN NÚT LẮC
      openBtn.classList.remove("hidden");
    }

    /* ===== CLICK LẮC ===== */
    envelope.addEventListener("click", () => {
      if (rolling || localStorage.getItem(LIXI_KEY)) return;

      rolling = true;
      lixiText.textContent = "🎰 Đang quay số lì xì...";

      const money  = randomMoney();
      const digits = String(money).padStart(6, "0").split("");

      function rollSlot(index) {
        const slot = slots[index];
        slot.classList.add("active");

        const timer = setInterval(() => {
          slot.textContent = Math.floor(Math.random() * 10);
        }, 70);

        setTimeout(() => {
          clearInterval(timer);
          slot.classList.remove("active");
          slot.textContent = digits[index];

          if (index === slots.length - 1) {
            localStorage.setItem(LIXI_KEY, money);

            if (LUCKY_MEANING[money]) {
              lixiText.innerHTML = `
                🎉 Bạn nhận được <b>${formatVND(money)}</b><br>
                <span style="color:#ffd700;text-shadow:0 0 8px #ff0">
                  ${LUCKY_MEANING[money]}
                </span>
              `;
            } else {
              lixiText.innerHTML = `🎉 Bạn nhận được <b>${formatVND(money)}</b>`;
            }

            envelope.style.display = "none"; // ⬅️ ẨN SAU KHI QUAY XONG
            openBtn.classList.remove("hidden");

            rolling = false;
          } else {
            rollSlot(index + 1);
          }
        }, 600 + index * 120);
      }

      rollSlot(0);
    });

    openBtn.addEventListener("click", openWishDialog);
  }

  /* ================== DIALOG TOÀN MÀN ================== */
  const dialog  = document.getElementById("finalDialog");
  const closeBt = document.getElementById("closeFinal");
  const upload  = document.getElementById("uploadImg");
  const preview = document.getElementById("previewImg");
  const pickBox = document.getElementById("imagePick");
  const sendBtn = document.getElementById("sendBtn");

  if (!dialog || !upload || !preview) return;

  function openWishDialog() {
    dialog.classList.add("show");
  }

  function closeWishDialog() {
    dialog.classList.remove("show");
  }

  closeBt.onclick = closeWishDialog;

  pickBox.onclick = () => upload.click();

  upload.onchange = () => {
    const file = upload.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Chỉ được chọn ảnh");
      upload.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
      pickBox.classList.add("has-img");
    };
    reader.readAsDataURL(file);
  };

  sendBtn.onclick = () => {
    if (!upload.files.length) {
      alert("Bạn chưa chọn ảnh");
      return;
    }
    submitPopupImage();
  };

});

/* =====================================================
   HÀM GỬI ẢNH LÌ XÌ
===================================================== */

function getFinalMoney(){
  return localStorage.getItem(LIXI_KEY) || "0";
}

function submitPopupImage() {

  const fileInput = document.getElementById("uploadImg");
  const file = fileInput.files[0];
  const loading = document.getElementById("uploadLoading");
  const sendBtn = document.getElementById("sendBtn");

  if (!file) {
    notify("❌ Vui lòng chọn ảnh trước khi gửi!", "error");
    return;
  }

  const finalMoney = getFinalMoney();
  if (!finalMoney) {
    notify("❌ Không tìm thấy số lì xì!", "error");
    return;
  }

  /* 🔒 KHÓA UI */
  loading.classList.remove("hidden");
  sendBtn.disabled = true;

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const formData = new FormData();
      formData.append("name", getUserName());
      formData.append("email", finalMoney);
      formData.append("image", reader.result.split(",")[1]);
      formData.append("imageName", file.name);
      formData.append("imageType", file.type);

      const res = await fetch(
        "https://upload-api.tulevan600.workers.dev/",
        {
          method: "POST",
          body: formData
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      notify("🎉 Gửi ảnh thành công! Cảm ơn mọi người đã chờ 😁");

      setTimeout(()=>{
        document.getElementById("finalDialog").classList.remove("show");
        loading.classList.add("hidden");
        sendBtn.disabled = false;
      }, 1200);

    } catch (err) {
      console.error(err);
      loading.classList.add("hidden");
      sendBtn.disabled = false;
      notify("❌ Gửi ảnh thất bại! Vui lòng thử lại", "error");
    }
  };

  reader.readAsDataURL(file);
}

function notify(msg, type = "success", time = 2000){
  debugger
  const n = document.getElementById("notify");
  if(!n) return;

  n.textContent = msg;
  n.className = "";
  n.classList.add("show");

  if(type === "error"){
    n.classList.add("error");
  }

  clearTimeout(n._timer);
  n._timer = setTimeout(()=>{
    n.classList.remove("show");
  }, time);
}


document.addEventListener("DOMContentLoaded", ()=>{

  const el = document.getElementById("happyText");

  const texts = [
    "Happy New Year",
    "Chúc Mừng Năm Mới",
    "新年快乐"
  ];

  const chars = "!@#$%^&*()_+=-{}[]<>?/\\|~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let index = 0;

  function virusEffect(newText){
    let frame = 0;
    const maxFrame = 18;

    el.classList.add("virus");

    const interval = setInterval(()=>{
      frame++;

      // tạo chữ loạn như bị hack
      el.textContent = newText
        .split("")
        .map((c,i)=>{
          if(frame < maxFrame - i){
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return c;
        })
        .join("");

      if(frame >= maxFrame){
        clearInterval(interval);
        el.textContent = newText;
        el.classList.remove("virus");
      }
    }, 40);
  }

  setInterval(()=>{
    index = (index + 1) % texts.length;
    virusEffect(texts[index]);
  }, 2200);

});
