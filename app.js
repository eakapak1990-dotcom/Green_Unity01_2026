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
  const formContainer = document.querySelector("#view-form .form-preview");
  formContainer.innerHTML = `
    <span class="back-link" onclick="goBackToLanding()">
      <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      ย้อนกลับ
    </span>
    <h2>ข้อมูลการลงทะเบียน</h2>
    <form id="main-survey-form" onsubmit="submitSurvey(event)">
      <div id="step-1" class="fade-in">
        <div class="step-title">ส่วนที่ 1: ข้อมูลผู้ประสานงาน</div>
        <div class="field mt-6">
          <label>1. ชื่อ-นามสกุลผู้ประสานงาน <span class="text-rose-500">*</span></label>
          <input type="text" id="inp-name" required placeholder="ระบุชื่อ-นามสกุล">
        </div>
        <div class="row2 mt-4">
          <div class="field">
            <label>2. ประเภทองค์กรหรือหน่วยงาน <span class="text-rose-500">*</span></label>
            <select id="sel-org-type" required onchange="handleOrgTypeChange(this.value)" class="w-full p-[15px] border border-[#D6E0D7] rounded-xl outline-none bg-[#FAFCFA] font-['Sarabun'] text-[15.5px] text-[#233326]">
              <option value="">-- เลือกประเภทองค์กร --</option>
              ${Object.keys(orgOptionsMapping).map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>3. ชื่อองค์กร หมู่บ้าน หรือหน่วยงาน <span class="text-rose-500">*</span></label>
            <select id="sel-org-name" required class="w-full p-[15px] border border-[#D6E0D7] rounded-xl outline-none bg-[#FAFCFA] font-['Sarabun'] text-[15.5px] text-[#233326]">
              <option value="">-- กรุณาเลือกประเภทองค์กรก่อน --</option>
            </select>
          </div>
        </div>
        <div id="div-other-org" class="field hidden mt-2">
          <label>4. ระบุชื่อองค์กรหรือหน่วยงานเพิ่มเติม <span class="text-rose-500">*</span></label>
          <input type="text" id="inp-other-org" placeholder="โปรดระบุ">
        </div>
        <div class="row2 mt-4">
          <div class="field">
            <label>5. เบอร์โทรศัพท์ผู้ประสานงาน <span class="text-rose-500">*</span></label>
            <input type="tel" id="inp-phone" required placeholder="เช่น 0812345678">
            <p class="text-[13px] text-[#A4B2A5] mt-1.5 font-medium">กรอกตัวเลขติดกัน 9-10 หลัก (ไม่ต้องมีขีด)</p>
          </div>
          <div class="field">
            <label>6. อีเมลผู้ประสานงาน (ถ้ามี)</label>
            <input type="email" id="inp-email" placeholder="example@email.com">
          </div>
        </div>
        <div style="margin-top: 48px;">
          <button type="button" onclick="validateAndNext(2)" class="btn btn-primary">
            ถัดไป
            <svg style="width: 20px; height: 20px; margin-left: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>

      <div id="step-2" class="hidden fade-in">
        <div class="step-title">ส่วนที่ 2: ความประสงค์เข้าร่วมกิจกรรม</div>
        <div class="field mt-6">
          <label>7. หน่วยงานของท่านประสงค์เข้าร่วมกิจกรรมหรือไม่ <span class="text-rose-500">*</span></label>
          <div class="radio-group" style="flex-direction: column; gap: 16px; margin-top: 16px;">
            <label class="p-4 border border-[#D6E0D7] rounded-xl hover:bg-[#FAFCFA] cursor-pointer w-full flex items-center">
              <input type="radio" name="rad-intent" value="เข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)">
              <span class="ml-2 font-semibold">เข้าร่วมกิจกรรม</span>
            </label>
            <label class="p-4 border border-[#D6E0D7] rounded-xl hover:bg-[#FAFCFA] cursor-pointer w-full flex items-center">
              <input type="radio" name="rad-intent" value="ไม่เข้าร่วมกิจกรรม" onchange="handleIntentChange(this.value)">
              <span class="ml-2 font-semibold">ไม่เข้าร่วมกิจกรรม</span>
            </label>
          </div>
        </div>
        <div id="dynamic-intent-section" style="margin-top:24px;"></div>
        <div class="row2" style="margin-top: 48px;">
          <button type="button" onclick="goToStep(1)" class="btn bg-white border border-[#D6E0D7] text-[#5a6659] hover:bg-[#F3F7F0]">
            <svg style="width: 20px; height: 20px; margin-right: 6px; transform: rotate(180deg);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            ย้อนกลับ
          </button>
          <div id="step-2-actions">
             <button type="button" onclick="validateAndNext(3)" class="btn btn-primary">
                ถัดไป
                <svg style="width: 20px; height: 20px; margin-left: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </button>
          </div>
        </div>
      </div>

      <div id="step-3" class="hidden fade-in">
        <div class="step-title">ส่วนที่ 3: รายละเอียดผู้เข้าร่วม</div>
        <div class="bg-[#FBFDF9] border border-[#D6E0D7] rounded-2xl p-8 mb-8 mt-6 text-center">
          <div class="field" style="margin-bottom:0; display: flex; flex-direction: column; align-items: center;">
            <label class="text-[17px] text-[#2E7D32] mb-2 font-bold">8. จำนวนผู้เข้าร่วมทั้งหมด <span class="text-rose-500">*</span></label>
            <p class="text-[14px] text-[#5a6659] mb-5 font-medium">กรุณาระบุจำนวนรวมผู้เข้าร่วมทั้งหมด รวมผู้ประสานงานด้วย (1 - 50 คน)</p>
            <input type="number" id="inp-total-part" min="1" max="50" oninput="generateParticipantRows(this.value)" placeholder="ระบุจำนวนคน" required style="max-width: 220px; text-align: center; font-weight: 700; font-size: 1.2rem; padding: 14px; border: 2px solid #66BB6A;">
          </div>
        </div>
        <div id="participants-list" class="space-y-6"></div>
        <div class="row2" style="margin-top: 48px;">
          <button type="button" onclick="goToStep(2)" class="btn bg-white border border-[#D6E0D7] text-[#5a6659] hover:bg-[#F3F7F0]">
            <svg style="width: 20px; height: 20px; margin-right: 6px; transform: rotate(180deg);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            ย้อนกลับ
          </button>
          <button type="submit" class="btn btn-primary">
            ส่งข้อมูลแบบสำรวจ
            <svg style="width: 20px; height: 20px; margin-left: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </button>
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
  } else if (targetStep === 3) {
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
    actionsContainer.innerHTML = `
      <button type="button" onclick="validateAndNext(3)" class="btn btn-primary">
         ถัดไป
         <svg style="width: 20px; height: 20px; margin-left: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>`;
  } else {
    actionsContainer.innerHTML = `
      <button type="button" onclick="submitSurvey(event)" class="btn btn-dark">
        ส่งข้อมูลแบบสำรวจ
        <svg style="width: 20px; height: 20px; margin-left: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
      </button>`;
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
    row.style.cssText = "background: rgba(255,255,255,0.9); border: 1px solid var(--cream-line); border-radius: 20px; padding: 32px 28px 24px; margin-bottom: 24px; position: relative;";
    row.innerHTML = `
      <div style="position: absolute; top: -16px; left: -16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; border: 3px solid #fff;">${i}</div>
      <h4 style="color: var(--forest); margin: 0 0 20px; border-bottom: 1px solid var(--cream-line); padding-bottom: 12px; font-weight: 700;">รายละเอียดผู้เข้าร่วมคนที่ ${i}</h4>
      <div class="row2">
          <div class="field">
              <label>9. ชื่อ-นามสกุล <span class="text-rose-500">*</span></label>
              <input type="text" name="part-name" required placeholder="ระบุชื่อ-นามสกุล">
          </div>
          <div class="field">
              <label>10. ขนาดเสื้อ <span class="text-rose-500">*</span></label>
              <select name="part-shirt" required class="w-full p-[15px] border border-[#D6E0D7] rounded-xl outline-none bg-[#FAFCFA]">
                  <option value="" disabled selected>-- เลือกขนาด --</option>
                  <option value="XS">XS</option><option value="S">S</option><option value="M">M</option>
                  <option value="L">L</option><option value="XL">XL</option><option value="2XL">2XL</option>
                  <option value="3XL">3XL</option><option value="4XL">4XL</option><option value="5XL">5XL</option>
                  <option value="ไม่รับเสื้อ">ไม่รับเสื้อ</option>
              </select>
          </div>
      </div>
      <div class="field mt-2">
          <label>11. ข้อจำกัดด้านอาหาร <span class="text-rose-500">*</span></label>
          <select name="part-diet" class="w-full p-[15px] border border-[#D6E0D7] rounded-xl outline-none bg-[#FAFCFA] diet-select" data-index="${i}" required>
              <option value="" disabled selected>-- เลือกข้อมูล --</option>
              <option value="ไม่มี">ไม่มี</option>
              <option value="แพ้อาหารทะเล">แพ้อาหารทะเล</option>
              <option value="อื่นๆ">อื่น ๆ</option>
          </select>
      </div>
      <div id="diet_detail_container_${i}" class="field hidden mt-4" style="background:#FFF5F5; padding:20px; border-radius:16px; border:1px solid #FFEBEB;">
          <label style="color:#D32F2F;">รายละเอียดเพิ่มเติมเกี่ยวกับอาหาร <span class="text-rose-500">*</span></label>
          <input type="text" name="part-diet-detail" id="p_diet_detail_${i}" placeholder="ตัวอย่าง: แพ้กุ้งและปู, ไม่รับประทานเนื้อวัว" style="border-color:#F6D4D4; background:#fff; margin-top: 8px;">
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
      title: 'ตรวจสอบความถูกต้อง', text: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันส่งเข้าระบบ', icon: 'info',
      showCancelButton: true, confirmButtonText: 'ยืนยันส่งข้อมูล', cancelButtonText: 'ตรวจสอบอีกครั้ง',
      confirmButtonColor: '#2E7D32', cancelButtonColor: '#6c757d'
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
      for (let row of rows) {
        const name = row.querySelector('input[name="part-name"]').value.trim();
        const shirtSize = row.querySelector('select[name="part-shirt"]').value;
        const diet = row.querySelector('select[name="part-diet"]').value;
        const dietDetail = row.querySelector('input[name="part-diet-detail"]') ? row.querySelector('input[name="part-diet-detail"]').value.trim() : "";
        payload.participants.push({ name, shirtSize, diet, dietDetail });
      }
    }
    fetch(GAS_API_URL, {
      method: "POST", mode: "no-cors", cache: "no-cache",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      Swal.fire({
          icon: 'success', title: 'ลงทะเบียนสำเร็จ',
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

// เก็บ instance ของกราฟที่กำลังแสดงอยู่ + เก็บข้อมูลดิบจาก API ไว้ใช้สร้างกราฟใหม่ตอนสลับแท็บ
let chartInstances = {};
let dashboardStats = null;

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

// Helper กลาง: บังคับให้ฟอนต์ที่กราฟใช้จริง "โหลดเสร็จสมบูรณ์" ก่อนค่อยเรียก callback
function whenChartFontsReady(callback) {
  const fontLoads = [
    document.fonts.load('13.5px Sarabun'),
    document.fonts.load('500 13.5px Sarabun'),
    document.fonts.load('12.5px Sarabun'),
    document.fonts.load('400 14px Kanit'),
    document.fonts.load('600 14px Kanit')
  ];
  Promise.all([document.fonts.ready, ...fontLoads])
    .then(() => callback())
    .catch(() => callback());
}

function loadAdminDashboard() {
  const adminContent = document.getElementById("admin-content");
  adminContent.innerHTML = `
    <div class="flex flex-wrap justify-center gap-3 mb-10 border-b border-[#EDE3CC] pb-6">
       <button onclick="switchTab('overview')" class="tab-btn active text-sm md:text-base px-6 py-3 rounded-xl transition-all">📊 ภาพรวม</button>
       <button onclick="switchTab('logistics')" class="tab-btn text-sm md:text-base px-6 py-3 rounded-xl transition-all">👕 เสื้อและอาหาร</button>
       <button onclick="switchTab('datatable')" class="tab-btn text-sm md:text-base px-6 py-3 rounded-xl transition-all">📇 ค้นหารายชื่อ</button>
    </div>
    <div class="text-left w-full mx-auto">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="stat-card bg-[#E8F5E9] border border-[#C8E6C9] flex flex-col items-center text-center">
           <span class="text-[13px] text-[#2E7D32] font-bold uppercase tracking-wider mb-2 font-['Prompt']">หน่วยงานร่วมใจ</span>
           <span class="text-4xl text-[#1F5C24]" id="stat-orgs">0</span>
        </div>
        <div class="stat-card bg-[#E3F2FD] border border-[#BBDEFB] flex flex-col items-center text-center">
           <span class="text-[13px] text-[#1565C0] font-bold uppercase tracking-wider mb-2 font-['Prompt']">รวมผู้เข้าร่วม</span>
           <span class="text-4xl text-[#0D47A1]" id="stat-parts">0</span>
        </div>
        <div class="stat-card bg-[#F1F8E9] border border-[#DCEDC8] flex flex-col items-center text-center">
           <span class="text-[13px] text-[#558B2F] font-bold uppercase tracking-wider mb-2 font-['Prompt']">ยอดผลิตเสื้อ</span>
           <span class="text-4xl text-[#33691E]" id="stat-shirts">0</span>
        </div>
        <div class="stat-card bg-[#FFEBEE] border border-[#FFCDD2] flex flex-col items-center text-center">
           <span class="text-[13px] text-[#C62828] font-bold uppercase tracking-wider mb-2 font-['Prompt']">ข้อจำกัดอาหาร</span>
           <span class="text-4xl text-[#B71C1C]" id="stat-food">0</span>
        </div>
      </div>

      <div id="tab-overview" class="tab-content fade-in space-y-6">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="chart-container">
            <h3 class="font-title font-bold text-[#173B1A] mb-6 text-center text-lg">ความประสงค์เข้าร่วมกิจกรรม</h3>
            <div class="h-[360px] flex justify-center"><canvas id="intentChart"></canvas></div>
          </div>
          <div class="chart-container">
            <h3 class="font-title font-bold text-[#173B1A] mb-6 text-center text-lg">สัดส่วนประเภทหน่วยงาน</h3>
            <div class="h-[380px] relative w-full"><canvas id="orgChart"></canvas></div>
          </div>
        </div>
      </div>

      <div id="tab-logistics" class="tab-content hidden fade-in space-y-6">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="chart-container">
            <h3 class="font-title font-bold text-[#173B1A] mb-6 text-center text-lg">สรุปจำนวนเสื้อแยกตามไซซ์</h3>
            <div class="h-[380px] relative w-full"><canvas id="shirtChart"></canvas></div>
          </div>
          <div class="chart-container">
            <h3 class="font-title font-bold text-[#173B1A] mb-6 text-center text-lg">ข้อจำกัดด้านอาหาร</h3>
            <div class="h-[360px] flex justify-center"><canvas id="foodChart"></canvas></div>
          </div>
        </div>
      </div>

      <div id="tab-datatable" class="tab-content hidden fade-in">
         <div class="table-container">
            <div class="p-6 border-b border-[#EDE3CC] bg-[#FAFCFA] flex flex-col md:flex-row justify-between items-center gap-4">
               <h3 class="font-title font-bold text-[#173B1A] text-xl m-0">ฐานข้อมูลผู้ลงทะเบียน</h3>
               <div class="relative w-full md:w-[350px]">
                  <input type="text" id="searchInput" onkeyup="handleSearch()" placeholder="ค้นหาชื่อ, เบอร์โทร หรือหน่วยงาน..." class="w-full pl-11 pr-4 py-3">
               </div>
            </div>
            <div class="overflow-x-auto">
               <table class="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                     <tr>
                        <th class="w-16 text-center">ลำดับ</th>
                        <th>ชื่อผู้ประสานงาน</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>หน่วยงาน</th>
                        <th class="text-center">สถานะ</th>
                        <th class="text-center">ผู้ติดตาม</th>
                     </tr>
                  </thead>
                  <tbody id="dataTableBody"></tbody>
               </table>
            </div>
            <div class="p-5 border-t border-[#EDE3CC] bg-[#FAFCFA] flex justify-between items-center text-[#5a6659]">
               <button onclick="prevPage()" id="btn-prev" class="pagination-btn flex items-center gap-2">ก่อนหน้า</button>
               <span id="pageInfo">หน้า 1 / 1</span>
               <button onclick="nextPage()" id="btn-next" class="pagination-btn flex items-center gap-2">ถัดไป</button>
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
        dashboardStats = d;

        document.getElementById("stat-orgs").textContent = d.summary?.totalOrgs || 0;
        document.getElementById("stat-parts").textContent = d.summary?.totalParts || 0;
        document.getElementById("stat-shirts").textContent = d.summary?.totalShirts || 0;
        document.getElementById("stat-food").textContent = d.summary?.totalFoodLimits || 0;

        whenChartFontsReady(() => {
          renderOverviewCharts(d);
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

// สร้างกราฟของแท็บ "ภาพรวม" (intentChart, orgChart)
function renderOverviewCharts(d) {
  destroyChart('intentChart');
  destroyChart('orgChart');

  const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Sarabun' }, padding: 20 } } }, cutout: '70%' };

  chartInstances.intentChart = new Chart(document.getElementById('intentChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['ยืนยันเข้าร่วม', 'ไม่เข้าร่วม'], datasets: [{ data: [d.intent?.joined || 0, d.intent?.declined || 0], backgroundColor: ['#2E7D32', '#FDECEC'], hoverBackgroundColor: ['#1F5C24', '#F6D4D4'], borderWidth: 0 }] },
    options: commonOptions
  });

  const village = d.orgStats?.village || 0;
  const customer = d.orgStats?.customer || 0;
  const school = d.orgStats?.school || 0;
  const gov = d.orgStats?.gov || 0;
  const totalOrgs = d.summary?.totalOrgs || 0;
  const otherOrgs = Math.max(0, totalOrgs - (village + customer + school + gov));

  // [แก้ไข] เพิ่ม callback ตัด label ยาวขึ้นบรรทัดใหม่ (2 บรรทัด) แทนพึ่งพาความกว้าง 1 บรรทัดเดียว
  // แก้ปัญหาต้นตอ: Safari (CoreText) กับ Chrome (HarfBuzz) วัดความกว้างตัวอักษรไทยไม่ตรงกัน
  // เมื่อตัดเป็น 2 บรรทัด แต่ละบรรทัดจะสั้นลงมาก จึงไม่มีโอกาสถูกตัดคำอีกไม่ว่าเบราว์เซอร์ไหน
  const orgBarOptions = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    layout: { padding: { top: 10, bottom: 10, right: 24 } },
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Kanit' }, color: '#5a6659' }, grid: { color: '#F0F4F0' }, border: { display: false } },
      y: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          font: { family: 'Sarabun', size: 13.5 },
          color: '#5a6659',
          padding: 10,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (label.length <= 5) return label; // คำสั้นไม่ต้องตัด
            const mid = Math.ceil(label.length / 2);
            let splitIdx = label.indexOf('/');
            if (splitIdx === -1) splitIdx = mid;
            else splitIdx += 1; // เก็บ "/" ไว้บรรทัดแรก
            return [label.slice(0, splitIdx), label.slice(splitIdx)];
          }
        },
        border: { color: '#EDE3CC' },
        afterFit: function(scale) {
          // ลดค่าต่ำสุดลง เพราะตัดเป็น 2 บรรทัดแล้วใช้พื้นที่แนวนอนน้อยลงมาก
          if (scale.width < 150) scale.width = 150;
        }
      }
    }
  };

  chartInstances.orgChart = new Chart(document.getElementById('orgChart').getContext('2d'), {
    type: 'bar',
    data: { labels: ['ชุมชน', 'ลูกค้า/คู่ค้า', 'สถานศึกษา', 'ภาครัฐ', 'อื่นๆ'], datasets: [{ data: [village, customer, school, gov, otherOrgs], backgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#AB47BC', '#90A4AE'], borderRadius: 6, barPercentage: 0.6 }] },
    options: orgBarOptions
  });
}

// สร้างกราฟของแท็บ "เสื้อและอาหาร" (shirtChart, foodChart) — เรียกเฉพาะตอนแท็บนี้กำลังแสดงผลอยู่เท่านั้น
function renderLogisticsCharts(d) {
  destroyChart('shirtChart');
  destroyChart('foodChart');

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    layout: { padding: { top: 10, bottom: 10 } },
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Kanit' }, color: '#5a6659' }, grid: { color: '#F0F4F0' }, border: { display: false } },
      x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 0, font: { family: 'Sarabun', size: 12.5 }, color: '#5a6659', padding: 8 }, border: { color: '#EDE3CC' } }
    }
  };

  const shirtLabels = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  chartInstances.shirtChart = new Chart(document.getElementById('shirtChart').getContext('2d'), {
    type: 'bar',
    data: { labels: shirtLabels, datasets: [{ data: shirtLabels.map(size => d.logistics?.shirts?.[size] || 0), backgroundColor: '#81C784', hoverBackgroundColor: '#66BB6A', borderRadius: 4, barPercentage: 0.7 }] },
    options: barOptions
  });

  const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Sarabun' }, padding: 20 } } }, cutout: '70%' };
  const limitFood = d.summary?.totalFoodLimits || 0;
  const noLimitFood = Math.max(0, (d.summary?.totalParts || 0) - limitFood);

  chartInstances.foodChart = new Chart(document.getElementById('foodChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['ไม่มีข้อจำกัด', 'มีข้อจำกัด (แพ้อาหาร/อื่นๆ)'], datasets: [{ data: [noLimitFood, limitFood], backgroundColor: ['#66BB6A', '#FF8A65'], hoverBackgroundColor: ['#4CAF50', '#FF7043'], borderWidth: 0 }] },
    options: commonOptions
  });
}

// ฟังก์ชันช่วยทำลายกราฟเก่าก่อนสร้างใหม่ ป้องกัน error "Canvas is already in use"
function destroyChart(key) {
  if (chartInstances[key]) {
    chartInstances[key].destroy();
    delete chartInstances[key];
  }
}

window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');

  if (!dashboardStats) return;

  whenChartFontsReady(() => {
    requestAnimationFrame(() => {
      if (tabName === 'overview') {
        renderOverviewCharts(dashboardStats);
      } else if (tabName === 'logistics') {
        renderLogisticsCharts(dashboardStats);
      }
    });
  });
};

function renderTable() {
  const tbody = document.getElementById("dataTableBody");
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  document.getElementById("pageInfo").textContent = `หน้า ${currentPage} จาก ${totalPages}`;
  document.getElementById("btn-prev").disabled = currentPage === 1;
  document.getElementById("btn-next").disabled = currentPage === totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);

  let html = "";
  if (pageData.length === 0) {
      html = `<tr><td colspan="6" class="text-center py-10 text-[#8C998D] bg-white">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
  } else {
      pageData.forEach((row, index) => {
          let badgeColor = row.intent === "เข้าร่วมกิจกรรม" ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]" :
                           (row.intent === "ยังไม่แน่ใจ" ? "bg-[#FFF8E1] text-[#F57F17] border border-[#FFECB3]" :
                           "bg-[#FFF5F5] text-[#D32F2F] border border-[#FFEBEB]");
          let hasParticipants = row.participants && row.participants.length > 0;
          html += `
            <tr>
              <td class="text-center font-['Kanit'] text-[#8C998D]">${start + index + 1}</td>
              <td class="font-semibold text-[#173B1A]">${row.coordName || "-"}</td>
              <td class="font-['Kanit']">${row.phone || "-"}</td>
              <td class="max-w-[200px] truncate" title="${row.orgName}">${row.orgName || "-"}</td>
              <td class="text-center"><span class="px-3 py-1.5 rounded-full text-[13px] font-bold ${badgeColor}">${row.intent}</span></td>
              <td class="text-center">
                 ${hasParticipants ? `<button onclick="toggleDetail('detail-${row.coordId}')" class="text-[#2E7D32] hover:text-[#1F5C24] font-semibold underline text-sm">ดูผู้ติดตาม (${row.participants.length})</button>` : `<span class="text-[#A4B2A5] text-sm">-</span>`}
              </td>
            </tr>
          `;
          if (hasParticipants) {
             let partHtml = `<table class="w-full text-[14.5px] text-left mt-2"><tr class="text-[#8C998D] border-b border-[#EDE3CC]"><th>ชื่อ-นามสกุล</th><th>ไซซ์เสื้อ</th><th>แพ้อาหาร</th></tr>`;
             row.participants.forEach(p => {
                 partHtml += `<tr class="border-b border-[#F0F4F0]"><td class="py-2.5 text-[#233326]">${p.name || "-"}</td><td class="font-['Kanit']">${p.shirt || p.shirtSize || "-"}</td><td>${p.diet || "-"}</td></tr>`;
             });
             partHtml += `</table>`;
             html += `
               <tr id="detail-${row.coordId}" class="hidden bg-[#FAFCFA] border-b border-[#EDE3CC]">
                  <td colspan="6" class="p-0">
                     <div class="px-8 py-5 border-l-4 border-[#66BB6A] m-4 bg-white rounded-r-xl shadow-sm">
                        <h4 class="font-bold text-[#173B1A] mb-3 text-[15px] font-['Prompt']">รายชื่อผู้ติดตาม</h4>
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