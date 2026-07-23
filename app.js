// =====================================================================
// 1. API CONFIGURATION
// =====================================================================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbznqwtZyuHeeRUW-OJwyWFGhHugm19rBbjKMbQTGIz-0z6B0ANJabRWZUeGXMmnHkrTQw/exec";

const orgOptionsMapping = {
  "ลูกค้าของบริษัท": ["ลูกค้าและคู่ค้าทางธุรกิจ", "ลูกค้าของบริษัท"],
  "ผู้ขายและผู้รับเหมาธุรกิจ": ["ผู้ขายและผู้รับเหมาธุรกิจ"],
  "คู่ค้าหลักขององค์กร": ["คู่ค้าหลักขององค์กร"],
  "ชุมชนโดยรอบ": ["ชุมชนโดยรอบในรัศมี 5 กิโลเมตร", "หมู่บ้านพฤกษา 15", "หมู่บ้านกล่อมพิรุณ", "หมู่บ้านเพชรงาม", "หมู่บ้านจิระภา 2", "หมู่บ้านนาคพิรุณ", "หมู่บ้านรินทิชา", "หมู่บ้านเฟื่องฟ้า 11", "หมู่บ้านพนาสนธิ์วิลล่า", "หมู่บ้านมั่นคง"],
  "สถานศึกษา": ["สถานศึกษา", "โรงเรียนวัดคลองเก้า", "โรงเรียนวัดแพรกษา"],
  "หน่วยงานภาครัฐ": ["หน่วยงานภาครัฐ", "เทศบาลตำบลแพรกษาใหม่", "ศูนย์ศึกษาธรรมชาติกองทัพบก บางปู"],
  "อื่น ๆ": ["อื่น ๆ"]
};

// =====================================================================
// 2. FORM & ROUTING LOGIC
// =====================================================================
function handleStartSurvey() {
  const isPdpaAccepted = document.getElementById("chk-pdpa").checked;
  if (!isPdpaAccepted) {
    Swal.fire({ icon: 'warning', title: 'กรุณายอมรับเงื่อนไข', text: 'ท่านต้องยินยอมเงื่อนไข PDPA ก่อนดำเนินการเข้าสู่แบบสำรวจ', confirmButtonColor: '#2E7D32' });
    return;
  }
  
  document.getElementById("view-landing").classList.add("hidden");
  document.getElementById("view-form").classList.remove("hidden");
  
  renderSurveyForm();
}

function renderSurveyForm() {
  const formContainer = document.querySelector("#view-form > div");
  formContainer.innerHTML = `
    <form id="main-survey-form" onsubmit="submitSurvey(event)" class="space-y-6">
      
      <!-- ================= STEP 1: ข้อมูลผู้ประสานงาน ================= -->
      <div id="step-1" class="block transition-all duration-300">
        <h2 class="text-2xl font-title text-primary border-b-2 border-cream pb-3 mb-6">ส่วนที่ 1: ข้อมูลผู้ประสานงาน</h2>
        <div class="space-y-6">
          <div>
            <label class="block font-semibold mb-1">1. ชื่อ-นามสกุลผู้ประสานงาน <span class="text-red-500">*</span></label>
            <input type="text" id="inp-name" required class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1">2. ประเภทองค์กรหรือหน่วยงาน <span class="text-red-500">*</span></label>
              <select id="sel-org-type" required onchange="handleOrgTypeChange(this.value)" class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
                <option value="">-- เลือกประเภทองค์กร --</option>
                ${Object.keys(orgOptionsMapping).map(type => `<option value="${type}">${type}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">3. ชื่อองค์กร หมู่บ้าน หรือหน่วยงาน <span class="text-red-500">*</span></label>
              <select id="sel-org-name" required class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
                <option value="">-- กรุณาเลือกประเภทองค์กรก่อน --</option>
              </select>
            </div>
          </div>
          
          <div id="div-other-org" class="hidden">
            <label class="block font-semibold mb-1">4. ระบุชื่อองค์กรหรือหน่วยงานเพิ่มเติม <span class="text-red-500">*</span></label>
            <input type="text" id="inp-other-org" class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1">5. เบอร์โทรศัพท์ผู้ประสานงาน <span class="text-red-500">*</span></label>
              <input type="tel" id="inp-phone" required placeholder="เช่น 0812345678" class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
              <p class="text-xs text-gray-400 mt-1">กรอกตัวเลขติดกันความยาว 9-10 หลัก (ไม่ต้องใส่เครื่องหมายขีด)</p>
            </div>
            <div>
              <label class="block font-semibold mb-1">6. อีเมลผู้ประสานงาน (ถ้ามี)</label>
              <input type="email" id="inp-email" class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
            </div>
          </div>
        </div>
        <div class="flex justify-end pt-6 mt-8 border-t border-creamLine">
          <button type="button" onclick="validateAndNext(2)" class="bg-primary hover:bg-primaryDark text-white font-title py-3 px-10 rounded-full shadow-soft transition duration-200 text-lg">ถัดไป ➔</button>
        </div>
      </div>

      <!-- ================= STEP 2: ความประสงค์เข้าร่วมกิจกรรม ================= -->
      <div id="step-2" class="hidden transition-all duration-300">
        <h2 class="text-2xl font-title text-primary border-b-2 border-cream pb-3 mb-6">ส่วนที่ 2: ความประสงค์เข้าร่วมกิจกรรม</h2>
        <div class="space-y-6">
          <div>
            <label class="block font-semibold mb-3">7. หน่วยงานของท่านประสงค์เข้าร่วมกิจกรรมหรือไม่ <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="rad-intent" value="เข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)" class="w-5 h-5 accent-primary">
                <span>เข้าร่วมกิจกรรม</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="rad-intent" value="ยังไม่แน่ใจ" onchange="handleIntentChange(this.value)" class="w-5 h-5 accent-primary">
                <span>ยังไม่แน่ใจ</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="rad-intent" value="ไม่สามารถเข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)" class="w-5 h-5 accent-primary">
                <span>ไม่สามารถเข้าร่วมกิจกรรม</span>
              </label>
            </div>
          </div>
          <div id="dynamic-intent-section" class="mt-6"></div>
        </div>

        <div class="flex gap-4 pt-6 mt-8 border-t border-creamLine">
          <button type="button" onclick="goToStep(1)" class="w-1/3 bg-gray-200 hover:bg-gray-300 font-title py-3 rounded-full transition duration-200 text-lg text-gray-700">ย้อนกลับ</button>
          
          <!-- ปุ่มฝั่งขวาจะแปรผันตามเงื่อนไข (ถัดไป หรือ ส่งข้อมูล) -->
          <div id="step-2-actions" class="w-2/3 flex">
            <button type="button" onclick="validateAndNext(3)" class="w-full bg-primary hover:bg-primaryDark text-white font-title py-3 rounded-full shadow-soft transition duration-200 text-lg">ถัดไป ➔</button>
          </div>
        </div>
      </div>

      <!-- ================= STEP 3: จำนวนและรายชื่อผู้เข้าร่วม ================= -->
      <div id="step-3" class="hidden transition-all duration-300">
        <h2 class="text-2xl font-title text-primary border-b-2 border-cream pb-3 mb-6">ส่วนที่ 3: จำนวนและรายชื่อผู้เข้าร่วม</h2>
        <div class="space-y-6">
          <div class="bg-pale/60 border-2 border-dashed border-secondary rounded-xl p-5">
            <label class="block font-semibold text-lg text-primary mb-1">8. จำนวนผู้เข้าร่วมทั้งหมด <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-600 mb-4 font-semibold">กรุณาระบุจำนวนรวมผู้เข้าร่วมทั้งหมด รวมผู้ประสานงานด้วย หากผู้ประสานงานเข้าร่วมกิจกรรม (ขั้นต่ำ 1 คน, สูงสุด 50 คน)</p>
            <input type="number" id="inp-total-part" min="1" max="50" oninput="generateParticipantRows(this.value)" class="w-full md:w-1/3 p-3 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none font-bold text-lg text-center" placeholder="ระบุจำนวนคน">
          </div>
          
          <div id="participants-list" class="space-y-4"></div>
        </div>

        <div class="flex gap-4 pt-6 mt-8 border-t border-creamLine">
          <button type="button" onclick="goToStep(2)" class="w-1/3 bg-gray-200 hover:bg-gray-300 font-title py-3 rounded-full transition duration-200 text-lg text-gray-700">ย้อนกลับ</button>
          <button type="submit" class="w-2/3 bg-primary hover:bg-primaryDark text-white font-title py-3 rounded-full shadow-soft transition duration-200 text-lg">ส่งข้อมูลแบบสำรวจ</button>
        </div>
      </div>

    </form>
  `;
}

function validateAndNext(targetStep) {
  if (targetStep === 2) {
    const name = document.getElementById("inp-name").value.trim();
    const orgType = document.getElementById("sel-org-type").value;
    const orgName = document.getElementById("sel-org-name").value;
    const phone = document.getElementById("inp-phone").value.trim();
    
    if (!name || !orgType || !orgName || !phone) return Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน' });
    if (orgType === "อื่น ๆ" && !document.getElementById("inp-other-org").value.trim()) return Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุชื่อองค์กรหรือหน่วยงานเพิ่มเติม' });
    if (!/^[0-9]{9,10}$/.test(phone)) return Swal.fire({ icon: 'error', title: 'เบอร์โทรศัพท์ไม่ถูกต้อง', text: 'กรุณากรอกตัวเลข 9-10 หลักโดยไม่มีขีด' });
    
    goToStep(2);
  } 
  else if (targetStep === 3) {
    const intentCheck = document.querySelector('input[name="rad-intent"]:checked');
    if (!intentCheck) return Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุความประสงค์เข้าร่วมกิจกรรม' });
    
    if (intentCheck.value === "เข้าร่วมกิจกรรม") {
      goToStep(3);
    }
  }
}

function goToStep(step) {
  window.scrollTo({ top: document.getElementById('view-form').offsetTop, behavior: 'smooth' });
  document.getElementById("step-1").classList.add("hidden");
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById(`step-${step}`).classList.remove("hidden");
}

// =====================================================================
// 3. DYNAMIC FORM HANDLERS
// =====================================================================
function handleOrgTypeChange(val) {
  const selOrgName = document.getElementById("sel-org-name");
  const divOtherOrg = document.getElementById("div-other-org");
  const inpOtherOrg = document.getElementById("inp-other-org");
  selOrgName.innerHTML = "";
  
  if (!val) {
    selOrgName.innerHTML = `<option value="">-- กรุณาเลือกประเภทองค์กรก่อน --</option>`;
    divOtherOrg.classList.add("hidden");
    return;
  }
  
  (orgOptionsMapping[val] || []).forEach(opt => {
    const el = document.createElement("option");
    el.value = opt; el.textContent = opt;
    selOrgName.appendChild(el);
  });
  
  if (val === "อื่น ๆ") {
    divOtherOrg.classList.remove("hidden");
    inpOtherOrg.required = true;
  } else {
    divOtherOrg.classList.add("hidden");
    inpOtherOrg.required = false;
    inpOtherOrg.value = "";
  }
}

function handleIntentChange(val) {
  const container = document.getElementById("dynamic-intent-section");
  const actionsContainer = document.getElementById("step-2-actions");
  container.innerHTML = "";

  if (val === "เข้าร่วมกิจกรรม") {
    // เปลี่ยนปุ่มเป็น ถัดไป เพื่อเข้าสู่ Step 3
    actionsContainer.innerHTML = `<button type="button" onclick="validateAndNext(3)" class="w-full bg-primary hover:bg-primaryDark text-white font-title py-3 rounded-full shadow-soft transition duration-200 text-lg">ถัดไป ➔</button>`;
  } else {
    // เปลี่ยนปุ่มเป็น ส่งข้อมูล 
    actionsContainer.innerHTML = `<button type="submit" class="w-full bg-secondary hover:bg-primary text-white font-title py-3 rounded-full shadow-soft transition duration-200 text-lg">ส่งข้อมูลแบบสำรวจ</button>`;
    
    if (val === "ยังไม่แน่ใจ") {
      container.innerHTML = `
        <div class="border-2 border-dashed border-yellow-300 rounded-xl p-5 bg-yellow-50/50">
          <label class="block font-semibold mb-1">จำนวนผู้เข้าร่วมโดยประมาณ (ท่าน) <span class="text-red-500">*</span></label>
          <input type="number" id="inp-est-part" min="1" required class="w-full md:w-1/3 p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none">
        </div>`;
    } else if (val === "ไม่สามารถเข้าร่วมกิจกรรม") {
      container.innerHTML = `
        <div class="border-2 border-dashed border-red-300 rounded-xl p-5 bg-red-50/50">
          <label class="block font-semibold mb-1">เหตุผลหรือข้อเสนอแนะเพิ่มเติม</label>
          <textarea id="txt-feedback" rows="3" class="w-full p-2.5 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none" placeholder="ระบุเหตุผล หรือข้อคิดเห็นเพิ่มเติมที่นี่..."></textarea>
        </div>`;
    }
  }
}

function generateParticipantRows(countStr) {
  const list = document.getElementById("participants-list");
  list.innerHTML = ""; 
  
  let count = parseInt(countStr);
  if (isNaN(count) || count < 1) return;
  if (count > 50) {
    Swal.fire({ icon: 'warning', title: 'จำนวนเกินขีดจำกัด', text: 'สามารถลงทะเบียนได้สูงสุด 50 ท่านต่อองค์กร' });
    document.getElementById("inp-total-part").value = 50;
    count = 50;
  }

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-5 border border-creamLine rounded-2xl shadow-soft relative";
    row.innerHTML = `
      <div class="absolute -top-3 -left-3 bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow">${i}</div>
      <div class="md:col-span-2 pl-4 md:pl-2">
        <label class="block text-xs font-semibold text-gray-500 mb-1">ชื่อ-นามสกุลผู้ร่วมเดินทาง <span class="text-red-500">*</span></label>
        <input type="text" name="part-name" required class="w-full p-2 border border-creamLine rounded-md outline-none focus:ring-1 focus:ring-secondary bg-cream/30">
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1">ขนาดเสื้อ <span class="text-red-500">*</span></label>
        <select name="part-shirt" required class="w-full p-2 border border-creamLine rounded-md outline-none focus:ring-1 focus:ring-secondary bg-cream/30">
          <option value="S">S (รอบอก 36")</option>
          <option value="M">M (รอบอก 38")</option>
          <option value="L">L (รอบอก 40")</option>
          <option value="XL">XL (รอบอก 42")</option>
          <option value="2XL">2XL (รอบอก 44")</option>
          <option value="3XL">3XL (รอบอก 46")</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1">ข้อจำกัดอาหาร</label>
        <input type="text" name="part-health" placeholder="เช่น มังสวิรัติ, แพ้กุ้ง" class="w-full p-2 border border-creamLine rounded-md outline-none focus:ring-1 focus:ring-secondary bg-cream/30">
      </div>
    `;
    list.appendChild(row);
  }
}

// =====================================================================
// 4. DATA SUBMISSION & VALIDATION
// =====================================================================
function submitSurvey(e) {
  e.preventDefault();
  
  const intentCheck = document.querySelector('input[name="rad-intent"]:checked');
  if(!intentCheck) return Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุความประสงค์เข้าร่วมกิจกรรม' });
  
  const intent = intentCheck.value;
  let totalPart = 0;

  if (intent === "เข้าร่วมกิจกรรม") {
    totalPart = parseInt(document.getElementById("inp-total-part").value);
    if (isNaN(totalPart) || totalPart < 1 || totalPart > 50) {
      return Swal.fire({ icon: 'error', title: 'ข้อมูลจำนวนไม่ถูกต้อง', text: 'กรุณาระบุจำนวนผู้เข้าร่วม (1-50 คน)' });
    }
  }

  Swal.fire({ title: 'กำลังบันทึกข้อมูล...', text: 'กรุณารอสักครู่ระบบกำลังประมวลผล', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

  const payload = {
    fullName: document.getElementById("inp-name").value.trim(),
    orgType: document.getElementById("sel-org-type").value,
    orgName: document.getElementById("sel-org-name").value,
    otherOrgName: document.getElementById("inp-other-org") ? document.getElementById("inp-other-org").value.trim() : "",
    phone: document.getElementById("inp-phone").value.trim(),
    email: document.getElementById("inp-email").value.trim(),
    intent: intent,
    totalParticipants: totalPart, 
    estParticipants: document.getElementById("inp-est-part") ? document.getElementById("inp-est-part").value : 0,
    feedback: document.getElementById("txt-feedback") ? document.getElementById("txt-feedback").value.trim() : "",
    participants: []
  };

  if (intent === "เข้าร่วมกิจกรรม") {
    const rows = document.getElementById("participants-list").children;
    for (let row of rows) {
      const name = row.querySelector('input[name="part-name"]').value.trim();
      const shirtSize = row.querySelector('select[name="part-shirt"]').value;
      const healthInfo = row.querySelector('input[name="part-health"]').value.trim();
      payload.participants.push({ name, shirtSize, healthInfo });
    }
  }

  fetch(GAS_API_URL, {
    method: "POST",
    mode: "no-cors", 
    cache: "no-cache",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    Swal.fire({ icon: 'success', title: 'ส่งข้อมูลเรียบร้อย', text: 'ขอบคุณที่ร่วมเป็นภาคีสร้างอนาคตที่ยั่งยืน', confirmButtonColor: '#2E7D32' })
    .then(() => location.reload());
  })
  .catch(err => {
    Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการส่งข้อมูล', text: err.toString() });
  });
}

// =====================================================================
// 5. ADMIN DASHBOARD LOGIC
// =====================================================================
function handleAdminLogin() {
  const u = document.getElementById("admin-user").value;
  const p = document.getElementById("admin-pass").value;
  
  if (u === "admin" && p === "GreenUnity2026") {
    Swal.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ', showConfirmButton: false, timer: 1500 });
    document.getElementById("view-landing").classList.add("hidden");
    document.getElementById("view-admin").classList.remove("hidden");
    loadAdminDashboard();
  } else {
    Swal.fire({ icon: 'error', title: 'สิทธิ์การเข้าถึงล้มเหลว', text: 'Username หรือ Password ไม่ถูกต้อง' });
  }
}

function loadAdminDashboard() {
  const adminView = document.getElementById("view-admin");
  adminView.innerHTML = `
    <div class="w-64 bg-[#173B1A] text-white flex flex-col p-5 space-y-4">
      <div class="text-xl font-title text-secondary border-b border-white/10 pb-3">Green Unity Panel</div>
      <button class="text-left py-2 px-3 bg-primary rounded-lg text-sm font-semibold">📈 สถิติการลงทะเบียน</button>
      <button onclick="location.reload()" class="mt-auto text-left py-2 px-3 bg-red-700 hover:bg-red-800 rounded-lg text-sm font-semibold transition">ออกจากระบบ</button>
    </div>
    
    <div class="flex-1 p-8 space-y-6 overflow-y-auto h-screen">
      <h2 class="text-3xl font-title text-gray-800">แดชบอร์ดสรุปผลการสำรวจ</h2>
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-soft border-l-4 border-primary flex flex-col"><span class="text-xs text-gray-500 font-semibold">หน่วยงานร่วมใจ</span><span class="text-2xl font-bold mt-2" id="stat-orgs">...</span></div>
        <div class="bg-white p-5 rounded-2xl shadow-soft border-l-4 border-secondary flex flex-col"><span class="text-xs text-gray-500 font-semibold">รวมผู้เข้าร่วม (คน)</span><span class="text-2xl font-bold mt-2" id="stat-parts">...</span></div>
        <div class="bg-white p-5 rounded-2xl shadow-soft border-l-4 border-primaryDark flex flex-col"><span class="text-xs text-gray-500 font-semibold">ยอดจัดผลิตเสื้อ</span><span class="text-2xl font-bold mt-2" id="stat-shirts">...</span></div>
        <div class="bg-white p-5 rounded-2xl shadow-soft border-l-4 border-gray-400 flex flex-col"><span class="text-xs text-gray-500 font-semibold">ข้อจำกัดด้านอาหาร</span><span class="text-2xl font-bold mt-2" id="stat-food">...</span></div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-soft border border-creamLine max-w-2xl mt-6">
        <h3 class="font-title text-gray-700 mb-4 text-lg">สัดส่วนขนาดเสื้อที่ลงทะเบียน</h3>
        <canvas id="shirtChart" width="400" height="200"></canvas>
      </div>
    </div>
  `;

  fetch(GAS_API_URL)
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        const d = res.data;
        document.getElementById("stat-orgs").textContent = d.totalOrgs;
        document.getElementById("stat-parts").textContent = d.totalParticipants;
        document.getElementById("stat-shirts").textContent = d.totalShirts;
        document.getElementById("stat-food").textContent = d.totalFoodLimits;
        
        const ctx = document.getElementById('shirtChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(d.shirtSizes),
            datasets: [{
              label: 'จำนวนเสื้อ (ตัว)',
              data: Object.values(d.shirtSizes),
              backgroundColor: '#66BB6A',
              borderColor: '#2E7D32',
              borderWidth: 1
            }]
          },
          options: {
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการดึงข้อมูล', text: res.message });
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'การเชื่อมต่อผิดพลาด', text: 'ไม่สามารถดึงข้อมูลสถิติได้' });
    });
}