// =====================================================================
// 1. API CONFIGURATION
// =====================================================================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbznqwtZyuHeeRUW-OJwyWFGhHugm19rBbjKMbQTGIz-0z6B0ANJabRWZUeGXMmnHkrTQw/exec";

const orgOptionsMapping = {
  "ลูกค้าของบริษัท": ["ลูกค้าและคู่ค้าทางธุรกิจ", "ลูกค้าของบริษัท"],
  "ผู้ขายและผู้รับเหมาธุรกิจ": ["ผู้ขายและผู้รับเหมาธุรกิจ"],
  "คู่ค้าหลักขององค์กร": ["คู่ค้าหลักขององค์กร"],
  "พนักงานบริษัท": ["บริษัท ยูนีค พลาสติก อินดัสตรีส์ จำกัด (มหาชน)"],
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

function goBackToLanding() {
  document.getElementById("view-form").classList.add("hidden");
  document.getElementById("view-landing").classList.remove("hidden");
}

function renderSurveyForm() {
  // เล็งไปที่ .form-preview เพื่อวาด HTML ใหม่ด้วยดีไซน์ที่ตรงกับ style.css
  const formContainer = document.querySelector("#view-form .form-preview");
  
  formContainer.innerHTML = `
    <span class="back-link" onclick="goBackToLanding()">← ย้อนกลับ</span>
    <h2>ข้อมูลการลงทะเบียน</h2>
    
    <form id="main-survey-form" onsubmit="submitSurvey(event)">
      
      <!-- ================= STEP 1: ข้อมูลผู้ประสานงาน ================= -->
      <div id="step-1" class="fade-in">
        <div class="step-title">ส่วนที่ 1: ข้อมูลผู้ประสานงาน</div>
        
        <div class="field">
          <label>1. ชื่อ-นามสกุลผู้ประสานงาน <span class="text-red-500">*</span></label>
          <input type="text" id="inp-name" required placeholder="ระบุชื่อ-นามสกุล">
        </div>
        
        <div class="row2">
          <div class="field">
            <label>2. ประเภทองค์กรหรือหน่วยงาน <span class="text-red-500">*</span></label>
            <select id="sel-org-type" required onchange="handleOrgTypeChange(this.value)" class="w-full p-[13px] border border-[#EDE3CC] rounded-xl focus:ring-2 focus:ring-[#66BB6A] outline-none bg-white">
              <option value="">-- เลือกประเภทองค์กร --</option>
              ${Object.keys(orgOptionsMapping).map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>3. ชื่อองค์กร หมู่บ้าน หรือหน่วยงาน <span class="text-red-500">*</span></label>
            <select id="sel-org-name" required class="w-full p-[13px] border border-[#EDE3CC] rounded-xl focus:ring-2 focus:ring-[#66BB6A] outline-none bg-white">
              <option value="">-- กรุณาเลือกประเภทองค์กรก่อน --</option>
            </select>
          </div>
        </div>
        
        <div id="div-other-org" class="field hidden">
          <label>4. ระบุชื่อองค์กรหรือหน่วยงานเพิ่มเติม <span class="text-red-500">*</span></label>
          <input type="text" id="inp-other-org" placeholder="โปรดระบุ">
        </div>
        
        <div class="row2">
          <div class="field">
            <label>5. เบอร์โทรศัพท์ผู้ประสานงาน <span class="text-red-500">*</span></label>
            <input type="tel" id="inp-phone" required placeholder="เช่น 0812345678">
            <p class="text-xs text-gray-500 mt-1">กรอกตัวเลขติดกัน 9-10 หลัก (ไม่ต้องมีขีด)</p>
          </div>
          <div class="field">
            <label>6. อีเมลผู้ประสานงาน (ถ้ามี)</label>
            <input type="email" id="inp-email" placeholder="example@email.com">
          </div>
        </div>

        <div style="margin-top: 32px;">
          <button type="button" onclick="validateAndNext(2)" class="btn btn-primary">ถัดไป ➔</button>
        </div>
      </div>

      <!-- ================= STEP 2: ความประสงค์เข้าร่วมกิจกรรม ================= -->
      <div id="step-2" class="hidden fade-in">
        <div class="step-title">ส่วนที่ 2: ความประสงค์เข้าร่วมกิจกรรม</div>
        
        <div class="field">
          <label>7. หน่วยงานของท่านประสงค์เข้าร่วมกิจกรรมหรือไม่ <span class="text-red-500">*</span></label>
          <div class="radio-group" style="flex-direction: column; gap: 12px;">
            <label>
              <input type="radio" name="rad-intent" value="เข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)">
              เข้าร่วมกิจกรรม
            </label>
            <label>
              <input type="radio" name="rad-intent" value="ไม่เข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)">
              ไม่เข้าร่วมกิจกรรม
            </label>
          </div>
        </div>

        <div id="dynamic-intent-section" style="margin-top:24px;"></div>

        <div class="row2" style="margin-top: 32px;">
          <button type="button" onclick="goToStep(1)" class="btn bg-gray-200 text-gray-700 hover:bg-gray-300">← ย้อนกลับ</button>
          <div id="step-2-actions">
             <button type="button" onclick="validateAndNext(3)" class="btn btn-primary">ถัดไป ➔</button>
          </div>
        </div>
      </div>

      <!-- ================= STEP 3: จำนวนและรายชื่อผู้เข้าร่วม ================= -->
      <div id="step-3" class="hidden fade-in">
        <div class="step-title">ส่วนที่ 3: รายละเอียดผู้เข้าร่วม</div>
        
        <div style="background: var(--pale); border: 2px dashed var(--secondary); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <div class="field" style="margin-bottom:0;">
            <label style="font-size:16px; color:var(--primary);">8. จำนวนผู้เข้าร่วมทั้งหมด <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-600 mb-3">กรุณาระบุจำนวนรวมผู้เข้าร่วมทั้งหมด รวมผู้ประสานงานด้วย (1 - 50 คน)</p>
            <input type="number" id="inp-total-part" min="1" max="50" oninput="generateParticipantRows(this.value)" placeholder="ระบุจำนวนคน" required style="max-width: 200px; text-align: center; font-weight: bold;">
          </div>
        </div>
        
        <!-- รายชื่อผู้เข้าร่วม (Dynamic Container) -->
        <div id="participants-list"></div>

        <div class="row2" style="margin-top: 40px;">
          <button type="button" onclick="goToStep(2)" class="btn bg-gray-200 text-gray-700 hover:bg-gray-300">← ย้อนกลับ</button>
          <button type="submit" class="btn btn-primary">ส่งข้อมูลแบบสำรวจ</button>
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
    
    if (intentCheck.value === "เข้าร่วมกิจกรรม") goToStep(3);
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
    actionsContainer.innerHTML = `<button type="button" onclick="validateAndNext(3)" class="btn btn-primary">ถัดไป ➔</button>`;
  } else {
    actionsContainer.innerHTML = `<button type="button" onclick="submitSurvey(event)" class="btn" style="background:var(--forest); color:#fff;">ส่งข้อมูลแบบสำรวจ</button>`;
  }
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('diet-select')) {
        const val = e.target.value;
        const index = e.target.getAttribute('data-index');
        const detailContainer = document.getElementById(`diet_detail_container_${index}`);
        const detailInput = document.getElementById(`p_diet_detail_${index}`);
        
        if (detailContainer && detailInput) {
            const requireDetail = ["แพ้อาหารทะเล", "อื่นๆ"].includes(val);
            if (requireDetail) {
                detailContainer.classList.remove('hidden');
                detailInput.setAttribute('required', 'true');
            } else {
                detailContainer.classList.add('hidden');
                detailInput.removeAttribute('required');
                detailInput.value = ''; 
            }
        }
    }
});

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
    row.className = "participant-row fade-in";
    row.style.cssText = "background: #fff; border: 1px solid var(--cream-line); border-radius: 16px; padding: 24px; margin-bottom: 20px; position: relative;";
    
    row.innerHTML = `
      <div style="position: absolute; top: -14px; left: -14px; background: var(--primary); color: #fff; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-family: 'Prompt', sans-serif; box-shadow: var(--shadow-soft);">${i}</div>
      <h4 style="color: var(--primary); margin: 0 0 16px; border-bottom: 1px solid var(--cream-line); padding-bottom: 12px; font-weight: 700;">ผู้เข้าร่วมคนที่ ${i}</h4>
      
      <div class="row2">
          <div class="field">
              <label>9. ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
              <input type="text" name="part-name" required placeholder="ระบุชื่อ-นามสกุล">
          </div>
          <div class="field">
              <label>10. ขนาดเสื้อ <span class="text-red-500">*</span></label>
              <select name="part-shirt" required class="w-full p-[13px] border border-[#EDE3CC] rounded-xl focus:ring-2 focus:ring-[#66BB6A] outline-none bg-white">
                  <option value="" disabled selected>-- เลือกขนาด --</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                  <option value="4XL">4XL</option>
                  <option value="5XL">5XL</option>
                  <option value="ไม่รับเสื้อ">ไม่รับเสื้อ</option>
              </select>
          </div>
      </div>
      
      <div class="field">
          <label>11. ข้อจำกัดด้านอาหาร <span class="text-red-500">*</span></label>
          <select name="part-diet" class="w-full p-[13px] border border-[#EDE3CC] rounded-xl focus:ring-2 focus:ring-[#66BB6A] outline-none bg-white diet-select" data-index="${i}" required>
              <option value="" disabled selected>-- เลือกข้อมูล --</option>
              <option value="ไม่มี">ไม่มี</option>
              <option value="แพ้อาหารทะเล">แพ้อาหารทะเล</option>
              <option value="อื่นๆ">อื่น ๆ</option>
          </select>
      </div>

      <div id="diet_detail_container_${i}" class="field hidden" style="background:#FDECEC; padding:16px; border-radius:12px; border:1px solid #F6D4D4;">
          <label style="color:#C0392B;">รายละเอียดเพิ่มเติมเกี่ยวกับอาหาร <span class="text-red-500">*</span></label>
          <input type="text" name="part-diet-detail" id="p_diet_detail_${i}" placeholder="ตัวอย่าง: แพ้กุ้งและปู, ไม่รับประทานเนื้อวัว" style="border-color:#F6D4D4;">
      </div>
    `;
    list.appendChild(row);
  }
}

// =====================================================================
// 4. DATA SUBMISSION & VALIDATION
// =====================================================================
function submitSurvey(e) {
  if (e) e.preventDefault();
  
  const intentCheck = document.querySelector('input[name="rad-intent"]:checked');
  if(!intentCheck) return Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุความประสงค์เข้าร่วมกิจกรรม' });
  
  const intent = intentCheck.value;
  let totalPart = 0;

  if (intent === "เข้าร่วมกิจกรรม") {
    totalPart = parseInt(document.getElementById("inp-total-part").value);
    if (isNaN(totalPart) || totalPart < 1 || totalPart > 50) {
      return Swal.fire({ icon: 'error', title: 'ข้อมูลจำนวนไม่ถูกต้อง', text: 'กรุณาระบุจำนวนผู้เข้าร่วม (1-50 คน)' });
    }
    
    const renderedRows = document.querySelectorAll('.participant-row').length;
    if (totalPart !== renderedRows) {
        return Swal.fire({ icon: 'error', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุจำนวนและกรอกข้อมูลผู้เข้าร่วมให้ครบถ้วน' });
    }
  }

  Swal.fire({
      title: 'ตรวจสอบความถูกต้อง',
      text: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันส่งเข้าระบบ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันส่งข้อมูล',
      cancelButtonText: 'ตรวจสอบอีกครั้ง',
      confirmButtonColor: '#2E7D32',
      cancelButtonColor: '#6c757d'
  }).then((result) => {
      if (result.isConfirmed) executeDataSubmission(intent, totalPart);
  });
}

function executeDataSubmission(intent, totalPart) {
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
      participants: [],
      health_safety: {}
    };
  
    if (intent === "เข้าร่วมกิจกรรม") {
      const rows = document.getElementById("participants-list").children;
      let pIndex = 1;
      
      for (let row of rows) {
        const name = row.querySelector('input[name="part-name"]').value.trim();
        const shirtSize = row.querySelector('select[name="part-shirt"]').value;
        const diet = row.querySelector('select[name="part-diet"]').value;
        const dietDetail = row.querySelector('input[name="part-diet-detail"]') ? row.querySelector('input[name="part-diet-detail"]').value.trim() : "";
        
        payload.participants.push({ name, shirtSize, diet, dietDetail });
        pIndex++;
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
      Swal.fire({ 
          icon: 'success', 
          title: 'ลงทะเบียนสำเร็จ', 
          html: `ขอขอบคุณที่ให้ความร่วมมือตอบแบบสำรวจ Green Unity 2026<br><br><span style="color:var(--primary); font-weight:bold;">ระบบได้บันทึกข้อมูลของท่านเรียบร้อยแล้ว</span>`, 
          confirmButtonColor: '#2E7D32' 
      }).then(() => location.reload());
    })
    .catch(err => {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการส่งข้อมูล', text: err.toString() });
    });
}

// =====================================================================
// 5. ADMIN DASHBOARD & DATATABLE LOGIC 
// =====================================================================
let tableData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

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

function logoutAdmin() {
  location.reload();
}

function loadAdminDashboard() {
  // เล็งเป้าหมายไปที่ #admin-content ที่อยู่ใน index.html เพื่อป้องกันไม่ให้ทับ .form-preview
  const adminContent = document.getElementById("admin-content");
  
  adminContent.innerHTML = `
    <!-- เมนู Tab ด้านบน แทนที่ Sidebar แบบเดิม -->
    <div class="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200 pb-4">
       <button onclick="switchTab('overview')" class="tab-btn bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition shadow-sm text-sm md:text-base">📊 ภาพรวม</button>
       <button onclick="switchTab('logistics')" class="tab-btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold transition text-sm md:text-base">👕 เสื้อและอาหาร</button>
       <button onclick="switchTab('datatable')" class="tab-btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold transition text-sm md:text-base">📇 ค้นหารายชื่อ</button>
    </div>

    <!-- MAIN CONTENT -->
    <div class="text-left">
      
      <!-- STATS BOXES -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">หน่วยงานร่วมใจ</span>
           <span class="text-3xl font-bold text-green-700 mt-2" id="stat-orgs">0</span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">รวมผู้เข้าร่วม</span>
           <span class="text-3xl font-bold text-blue-600 mt-2" id="stat-parts">0</span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">ยอดผลิตเสื้อ</span>
           <span class="text-3xl font-bold text-green-500 mt-2" id="stat-shirts">0</span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">ข้อจำกัดอาหาร</span>
           <span class="text-3xl font-bold text-red-500 mt-2" id="stat-food">0</span>
        </div>
      </div>

      <!-- TAB: ภาพรวม -->
      <div id="tab-overview" class="tab-content fade-in space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-title font-bold text-gray-700 mb-4 text-center">ความประสงค์เข้าร่วมกิจกรรม</h3>
            <div class="h-64 flex justify-center"><canvas id="intentChart"></canvas></div>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-title font-bold text-gray-700 mb-4 text-center">สัดส่วนประเภทหน่วยงาน</h3>
            <div class="h-64 relative w-full"><canvas id="orgChart"></canvas></div>
          </div>
        </div>
      </div>
      
      <!-- TAB: โลจิสติกส์ -->
      <div id="tab-logistics" class="tab-content hidden fade-in space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-title font-bold text-gray-700 mb-4 text-center">สรุปจำนวนเสื้อแยกตามไซซ์</h3>
            <div class="h-64 relative w-full"><canvas id="shirtChart"></canvas></div>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-title font-bold text-gray-700 mb-4 text-center">ข้อจำกัดด้านอาหาร</h3>
            <div class="h-64 flex justify-center"><canvas id="foodChart"></canvas></div>
          </div>
        </div>
      </div>

      <!-- TAB: ตารางรายชื่อ -->
      <div id="tab-datatable" class="tab-content hidden fade-in space-y-4">
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h3 class="font-title font-bold text-gray-800 text-lg">ฐานข้อมูลผู้ลงทะเบียน</h3>
               <div class="relative w-full md:w-1/3">
                  <input type="text" id="searchInput" onkeyup="handleSearch()" placeholder="🔍 ค้นหาด้วยชื่อ หรือ เบอร์โทร..." class="w-full pl-10 p-2.5 border border-gray-200 rounded-lg outline-none focus:border-green-500">
               </div>
            </div>
            
            <div class="overflow-x-auto">
               <table class="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                     <tr class="bg-green-50 text-green-800 border-b border-green-100">
                        <th class="p-3 rounded-tl-lg w-16">ลำดับ</th>
                        <th class="p-3">ชื่อผู้ประสานงาน</th>
                        <th class="p-3">เบอร์โทรศัพท์</th>
                        <th class="p-3">หน่วยงาน</th>
                        <th class="p-3">ความประสงค์</th>
                        <th class="p-3 rounded-tr-lg text-center">ผู้ติดตาม</th>
                     </tr>
                  </thead>
                  <tbody id="dataTableBody"></tbody>
               </table>
            </div>

            <div class="flex justify-between items-center mt-6 text-gray-600 font-semibold text-sm">
               <button onclick="prevPage()" id="btn-prev" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50">⬅️ ก่อนหน้า</button>
               <span id="pageInfo">หน้า 1 / 1</span>
               <button onclick="nextPage()" id="btn-next" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50">ถัดไป ➡️</button>
            </div>
         </div>
      </div>

    </div>
  `;

  Swal.fire({ title: 'กำลังโหลดข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  fetch(GAS_API_URL)
    .then(res => res.json())
    .then(res => {
      Swal.close();
      if (res.status === "success") {
        const d = res.data;
        
        document.getElementById("stat-orgs").textContent = d.summary?.totalOrgs || 0;
        document.getElementById("stat-parts").textContent = d.summary?.totalParts || 0;
        document.getElementById("stat-shirts").textContent = d.summary?.totalShirts || 0;
        document.getElementById("stat-food").textContent = d.summary?.totalFoodLimits || 0;
        
        const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
        const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };

        new Chart(document.getElementById('intentChart').getContext('2d'), { type: 'doughnut', data: { labels: ['ยืนยันเข้าร่วม', 'ไม่เข้าร่วม'], datasets: [{ data: [d.intent?.joined || 0, d.intent?.declined || 0], backgroundColor: ['#2E7D32', '#D32F2F'], borderWidth: 0 }] }, options: commonOptions });
        
        const village = d.orgStats?.village || 0;
        const customer = d.orgStats?.customer || 0;
        const school = d.orgStats?.school || 0;
        const gov = d.orgStats?.gov || 0;
        const totalOrgs = d.summary?.totalOrgs || 0;
        const otherOrgs = Math.max(0, totalOrgs - (village + customer + school + gov));

        new Chart(document.getElementById('orgChart').getContext('2d'), { 
            type: 'bar', 
            data: { 
                labels: ['ชุมชน', 'ลูกค้า/คู่ค้า', 'สถานศึกษา', 'ภาครัฐ', 'อื่นๆ'], 
                datasets: [{ 
                    data: [village, customer, school, gov, otherOrgs], 
                    backgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#AB47BC', '#78909C'], 
                    borderRadius: 4 
                }] 
            }, 
            options: barOptions 
        });
        
        const shirtLabels = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
        new Chart(document.getElementById('shirtChart').getContext('2d'), { type: 'bar', data: { labels: shirtLabels, datasets: [{ data: shirtLabels.map(size => d.logistics?.shirts[size] || 0), backgroundColor: '#81C784', borderRadius: 4 }] }, options: barOptions });
        
        const limitFood = d.summary?.totalFoodLimits || 0;
        const noLimitFood = Math.max(0, (d.summary?.totalParts || 0) - limitFood);

        new Chart(document.getElementById('foodChart').getContext('2d'), { 
            type: 'doughnut', 
            data: { 
                labels: ['ไม่มีข้อจำกัด', 'มีข้อจำกัด (แพ้อาหาร/อื่นๆ)'], 
                datasets: [{ 
                    data: [noLimitFood, limitFood], 
                    backgroundColor: ['#E0E0E0', '#FF7043'], 
                    borderWidth: 0 
                }] 
            }, 
            options: commonOptions 
        });

        tableData = d.registrations || [];
        filteredData = [...tableData];
        currentPage = 1;
        renderTable();

      } else {
        Swal.fire({ icon: 'error', title: 'ดึงข้อมูลไม่สำเร็จ', text: res.message });
      }
    })
    .catch(err => { Swal.close(); Swal.fire({ icon: 'error', title: 'การเชื่อมต่อผิดพลาด', text: 'ไม่สามารถดึงข้อมูลสถิติได้' }); });
}

window.switchTab = function(tabName) {
  // Reset all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-green-700', 'text-white');
    btn.classList.add('bg-gray-100', 'text-gray-700');
  });
  
  // Active current tab
  event.currentTarget.classList.remove('bg-gray-100', 'text-gray-700');
  event.currentTarget.classList.add('bg-green-700', 'text-white');
  
  // Hide all contents
  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  // Show target content
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');
};

function renderTable() {
  const tbody = document.getElementById("dataTableBody");
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  document.getElementById("pageInfo").textContent = `หน้า ${currentPage} จาก ${totalPages} (รวม ${filteredData.length} รายการ)`;
  document.getElementById("btn-prev").disabled = currentPage === 1;
  document.getElementById("btn-next").disabled = currentPage === totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);

  let html = "";
  if (pageData.length === 0) {
      html = `<tr><td colspan="6" class="text-center p-6 text-gray-400">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
  } else {
      pageData.forEach((row, index) => {
          let badgeColor = row.intent === "เข้าร่วมกิจกรรม" ? "bg-green-100 text-green-700" : (row.intent === "ยังไม่แน่ใจ" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700");
          let hasParticipants = row.participants && row.participants.length > 0;
          
          html += `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
              <td class="p-3 text-gray-500">${start + index + 1}</td>
              <td class="p-3 font-semibold text-gray-800">${row.coordName || "-"}</td>
              <td class="p-3">${row.phone || "-"}</td>
              <td class="p-3 max-w-[200px] truncate" title="${row.orgName}">${row.orgName || "-"}</td>
              <td class="p-3"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${badgeColor}">${row.intent}</span></td>
              <td class="p-3 text-center">
                 ${hasParticipants ? `<button onclick="toggleDetail('detail-${row.coordId}')" class="text-green-600 hover:text-green-800 font-semibold underline text-sm">ดูผู้ติดตาม (${row.participants.length})</button>` : `<span class="text-gray-400 text-sm">-</span>`}
              </td>
            </tr>
          `;
          
          if (hasParticipants) {
             let partHtml = `<table class="w-full text-sm text-left"><tr class="text-gray-500 border-b border-gray-200"><th>ชื่อ-นามสกุล</th><th>ไซส์เสื้อ</th><th>แพ้อาหาร</th></tr>`;
             row.participants.forEach(p => {
                 partHtml += `<tr class="border-b border-gray-100/50"><td class="py-2">${p.name || "-"}</td><td>${p.shirt || p.shirtSize || "-"}</td><td>${p.diet || "-"}</td></tr>`;
             });
             partHtml += `</table>`;
             
             html += `
               <tr id="detail-${row.coordId}" class="hidden bg-gray-50 border-b border-gray-200 shadow-inner">
                  <td colspan="6" class="p-4">
                     <div class="pl-6 border-l-4 border-green-600">
                        <h4 class="font-bold text-gray-700 mb-2 text-sm">รายชื่อผู้ติดตาม</h4>
                        ${partHtml}
                     </div>
                  </td>
               </tr>
             `;
          }
      });
  }
  tbody.innerHTML = html;
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  if (query === "") {
      filteredData = [...tableData];
  } else {
      filteredData = tableData.filter(d => 
          (d.coordName && d.coordName.toLowerCase().includes(query)) || 
          (d.phone && d.phone.includes(query)) ||
          (d.orgName && d.orgName.toLowerCase().includes(query))
      );
  }
  currentPage = 1;
  renderTable();
}

function prevPage() { if (currentPage > 1) { currentPage--; renderTable(); } }
function nextPage() { const total = Math.ceil(filteredData.length / itemsPerPage); if (currentPage < total) { currentPage++; renderTable(); } }
window.toggleDetail = function(id) {
   const el = document.getElementById(id);
   if (el.classList.contains("hidden")) el.classList.remove("hidden");
   else el.classList.add("hidden");
};