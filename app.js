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

      <!-- ================= STEP 3: จำนวนและรายชื่อผู้เข้าร่วม (รวมส่วนที่ 4 และ 5) ================= -->
      <div id="step-3" class="hidden transition-all duration-300">
        <h2 class="text-2xl font-title text-primary border-b-2 border-cream pb-3 mb-6">ส่วนที่ 3-5: รายละเอียดผู้เข้าร่วมและข้อมูลด้านความปลอดภัย</h2>
        <div class="space-y-6">
          <div class="bg-pale/60 border-2 border-dashed border-secondary rounded-xl p-5">
            <label class="block font-semibold text-lg text-primary mb-1">8. จำนวนผู้เข้าร่วมทั้งหมด <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-600 mb-4 font-semibold">กรุณาระบุจำนวนรวมผู้เข้าร่วมทั้งหมด รวมผู้ประสานงานด้วย หากผู้ประสานงานเข้าร่วมกิจกรรม (ขั้นต่ำ 1 คน, สูงสุด 50 คน)</p>
            <input type="number" id="inp-total-part" min="1" max="50" oninput="generateParticipantRows(this.value)" class="w-full md:w-1/3 p-3 border border-creamLine rounded-lg focus:ring-2 focus:ring-secondary outline-none font-bold text-lg text-center" placeholder="ระบุจำนวนคน" required>
          </div>
          
          <!-- ส่วนที่ 4: รายชื่อผู้เข้าร่วม (Dynamic Container) -->
          <div id="participants-list" class="space-y-4"></div>

          <!-- ส่วนที่ 5 ข้อมูลสุขภาพและความปลอดภัย -->
          <div id="section-5" class="p-5 mt-6 border border-creamLine rounded-xl shadow-sm bg-cream/20">
            <h3 class="text-lg font-title font-bold text-gray-800 mb-3 border-b border-creamLine pb-2">ส่วนที่ 5 ข้อมูลสุขภาพและความปลอดภัย</h3>
            
            <div class="mb-4">
              <label class="block font-semibold mb-2 text-gray-700">14. มีผู้เข้าร่วมที่มีโรคประจำตัวหรือข้อจำกัดในการทำกิจกรรมกลางแจ้งหรือไม่ <span class="text-red-500">*</span></label>
              <div class="flex gap-6 mt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="has_disease" value="ไม่มี" onchange="toggleDiseaseDetails(this.value)" class="w-4 h-4 accent-primary" required> 
                  <span class="text-gray-700">ไม่มี</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="has_disease" value="มี" onchange="toggleDiseaseDetails(this.value)" class="w-4 h-4 accent-primary"> 
                  <span class="text-gray-700">มี</span>
                </label>
              </div>
            </div>

            <div id="disease_details_container" class="mb-4 hidden bg-white p-4 rounded-lg border border-creamLine">
              <label class="block font-semibold mb-1 text-gray-700">15. รายละเอียดโรคประจำตัวหรือข้อจำกัด <span class="text-red-500">*</span></label>
              <textarea id="disease_details" name="disease_details" rows="3" class="w-full border border-creamLine p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-shadow" placeholder="ตัวอย่าง: ผู้เข้าร่วมลำดับที่ 3 เป็นโรคหอบหืด, ลำดับที่ 5 ไม่สามารถยืนนานได้"></textarea>
              <p class="text-sm text-gray-500 mt-1">กรุณาระบุเฉพาะข้อมูลที่จำเป็นต่อการดูแลความปลอดภัยในวันจัดกิจกรรม</p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="mb-2">
                <label class="block font-semibold mb-1 text-gray-700">16. ผู้ติดต่อกรณีฉุกเฉิน <span class="text-red-500">*</span></label>
                <input type="text" id="emergency_contact" name="emergency_contact" class="w-full border border-creamLine p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white transition-shadow" placeholder="ชื่อ-นามสกุล">
              </div>
              <div class="mb-2">
                <label class="block font-semibold mb-1 text-gray-700">17. เบอร์โทรศัพท์กรณีฉุกเฉิน <span class="text-red-500">*</span></label>
                <input type="tel" id="emergency_phone" name="emergency_phone" class="w-full border border-creamLine p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white transition-shadow" placeholder="08X-XXX-XXXX">
              </div>
            </div>
          </div>
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
    actionsContainer.innerHTML = `<button type="button" onclick="validateAndNext(3)" class="w-full bg-primary hover:bg-primaryDark text-white font-title py-3 rounded-full shadow-soft transition duration-200 text-lg">ถัดไป ➔</button>`;
  } else {
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

function toggleDiseaseDetails(val) {
  const container = document.getElementById('disease_details_container');
  const textarea = document.getElementById('disease_details');
  if (val === 'มี') {
    container.classList.remove('hidden');
    textarea.setAttribute('required', 'true');
  } else {
    container.classList.add('hidden');
    textarea.removeAttribute('required');
    textarea.value = '';
  }
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('diet-select')) {
        const val = e.target.value;
        const index = e.target.getAttribute('data-index');
        const detailContainer = document.getElementById(`diet_detail_container_${index}`);
        const detailInput = document.getElementById(`p_diet_detail_${index}`);
        
        if (detailContainer && detailInput) {
            const requireDetail = ["แพ้อาหารทะเล", "แพ้ถั่ว", "แพ้นม", "อื่นๆ"].includes(val);
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
    row.className = "participant-row p-4 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm transition-all hover:shadow-md relative";
    row.innerHTML = `
      <div class="absolute -top-3 -left-3 bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow">${i}</div>
      <h4 class="font-bold text-primary mb-3 pb-2 border-b border-gray-100 flex items-center gap-2 pl-6">ผู้เข้าร่วมคนที่ ${i}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">9. ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
              <input type="text" name="part-name" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-secondary outline-none" required placeholder="ระบุชื่อ-นามสกุล">
          </div>
          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">10. ประเภทผู้เข้าร่วม <span class="text-red-500">*</span></label>
              <select name="part-type" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white" required>
                  <option value="" disabled selected>-- เลือกประเภท --</option>
                  <option value="ผู้ใหญ่">ผู้ใหญ่</option>
                  <option value="เด็ก">เด็ก</option>
                  <option value="ผู้สูงอายุ">ผู้สูงอายุ</option>
                  <option value="ผู้ประสานงาน">ผู้ประสานงาน</option>
                  <option value="อื่นๆ">อื่น ๆ</option>
              </select>
          </div>
          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">11. ขนาดเสื้อ <span class="text-red-500">*</span></label>
              <select name="part-shirt" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white" required>
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
          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">12. ข้อจำกัดด้านอาหาร <span class="text-red-500">*</span></label>
              <select name="part-diet" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white diet-select" data-index="${i}" required>
                  <option value="" disabled selected>-- เลือกข้อมูล --</option>
                  <option value="ไม่มี">ไม่มี</option>
                  <option value="อาหารฮาลาล">อาหารฮาลาล</option>
                  <option value="อาหารมังสวิรัติ">อาหารมังสวิรัติ</option>
                  <option value="แพ้อาหารทะเล">แพ้อาหารทะเล</option>
                  <option value="แพ้ถั่ว">แพ้ถั่ว</option>
                  <option value="แพ้นม">แพ้นม</option>
                  <option value="อื่นๆ">อื่น ๆ</option>
              </select>
          </div>
          <div id="diet_detail_container_${i}" class="col-span-1 md:col-span-2 hidden bg-red-50 p-3 rounded-lg border border-red-100">
              <label class="block text-sm font-semibold text-gray-700 mb-1">13. รายละเอียดเพิ่มเติมเกี่ยวกับอาหาร <span class="text-red-500">*</span></label>
              <input type="text" name="part-diet-detail" id="p_diet_detail_${i}" class="w-full border border-red-200 p-2.5 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" placeholder="ตัวอย่าง: แพ้กุ้งและปู, ไม่รับประทานเนื้อวัว">
          </div>
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
    
    const renderedRows = document.querySelectorAll('.participant-row').length;
    if (totalPart !== renderedRows) {
        return Swal.fire({ icon: 'error', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณาระบุจำนวนและกรอกข้อมูลผู้เข้าร่วมให้ครบถ้วน' });
    }
  }

  Swal.fire({
      title: 'ตรวจสอบความถูกต้อง',
      text: 'กรุณาตรวจสอบจำนวนผู้เข้าร่วม รายชื่อ และขนาดเสื้อให้ถูกต้องก่อนส่งข้อมูล',
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
      for (let row of rows) {
        const name = row.querySelector('input[name="part-name"]').value.trim();
        const type = row.querySelector('select[name="part-type"]').value;
        const shirtSize = row.querySelector('select[name="part-shirt"]').value;
        const diet = row.querySelector('select[name="part-diet"]').value;
        const dietDetail = row.querySelector('input[name="part-diet-detail"]').value.trim();
        payload.participants.push({ name, type, shirtSize, diet, dietDetail });
      }
  
      const diseaseCheck = document.querySelector('input[name="has_disease"]:checked');
      payload.health_safety = {
          has_disease: diseaseCheck ? diseaseCheck.value : "ไม่มี",
          disease_details: document.getElementById("disease_details") ? document.getElementById("disease_details").value.trim() : "",
          emergency_contact: document.getElementById("emergency_contact") ? document.getElementById("emergency_contact").value.trim() : "",
          emergency_phone: document.getElementById("emergency_phone") ? document.getElementById("emergency_phone").value.trim() : ""
      };
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
          html: `ขอขอบคุณที่ให้ความร่วมมือตอบแบบสำรวจ Green Unity 2026<br><br><span class="text-green-600 font-bold">ระบบได้บันทึกข้อมูลของท่านเรียบร้อยแล้ว</span>`, 
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

function loadAdminDashboard() {
  const adminView = document.getElementById("view-admin");
  
  adminView.innerHTML = `
    <div class="flex flex-col md:flex-row h-screen w-full bg-gray-50 overflow-hidden text-sm md:text-base relative">
      
      <!-- MOBILE HEADER (แสดงเฉพาะหน้าจอมือถือ) -->
      <div class="md:hidden flex items-center justify-between bg-[#173B1A] text-white p-4 shadow-md z-20">
         <h1 class="font-title font-bold text-lg">Green Unity 2026</h1>
         <button onclick="toggleSidebar()" class="p-2 focus:outline-none hover:bg-white/10 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
         </button>
      </div>

      <!-- SIDEBAR BACKDROP OVERLAY (พื้นหลังมืดๆ ตอนเปิดเมนูในมือถือ) -->
      <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/60 z-30 hidden md:hidden transition-opacity"></div>

      <!-- SIDEBAR -->
      <aside id="admin-sidebar" class="w-64 bg-[#173B1A] text-white flex flex-col shadow-2xl z-40 fixed inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shrink-0 h-full">
        <div class="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 class="text-xl font-title font-bold text-secondary tracking-wide">Admin Panel</h1>
            <p class="text-xs text-gray-300 mt-1">Green Unity 2026</p>
          </div>
          <!-- ปุ่มปิด Sidebar ในมือถือ -->
          <button onclick="toggleSidebar()" class="md:hidden text-gray-300 hover:text-white p-1">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onclick="switchTab('overview'); toggleSidebar();" class="tab-btn w-full text-left py-3 px-4 bg-primary rounded-xl font-semibold transition flex items-center gap-3">
            <span>📊</span> ภาพรวมและสถิติ
          </button>
          <button onclick="switchTab('logistics'); toggleSidebar();" class="tab-btn w-full text-left py-3 px-4 hover:bg-white/10 rounded-xl font-semibold transition flex items-center gap-3">
            <span>👕</span> เสื้อและอาหาร
          </button>
          <button onclick="switchTab('demographics'); toggleSidebar();" class="tab-btn w-full text-left py-3 px-4 hover:bg-white/10 rounded-xl font-semibold transition flex items-center gap-3">
            <span>👥</span> ข้อมูลผู้เข้าร่วม
          </button>
          <button onclick="switchTab('datatable'); toggleSidebar();" class="tab-btn w-full text-left py-3 px-4 hover:bg-white/10 rounded-xl font-semibold transition flex items-center gap-3">
            <span>📇</span> ค้นหารายชื่อ
          </button>
        </nav>
        <div class="p-4 border-t border-white/10">
          <button onclick="location.reload()" class="w-full text-center py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition">ออกจากระบบ</button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <h2 class="text-2xl md:text-3xl font-title font-bold text-gray-800 mb-6">แดชบอร์ดสรุปผลการสำรวจ</h2>
        
        <!-- TOP SUMMARY CARDS -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">หน่วยงานร่วมใจ</span>
             <span class="text-3xl font-bold text-primary mt-2" id="stat-orgs">0</span>
          </div>
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">รวมผู้เข้าร่วม</span>
             <span class="text-3xl font-bold text-blue-600 mt-2" id="stat-parts">0</span>
          </div>
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">ยอดผลิตเสื้อ</span>
             <span class="text-3xl font-bold text-secondary mt-2" id="stat-shirts">0</span>
          </div>
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">ข้อจำกัดอาหาร</span>
             <span class="text-3xl font-bold text-red-500 mt-2" id="stat-food">0</span>
          </div>
        </div>

        <!-- TAB 1: OVERVIEW -->
        <div id="tab-overview" class="tab-content space-y-6">
          <div class="grid lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-title font-bold text-gray-700 mb-4 text-center">ความประสงค์เข้าร่วมกิจกรรม</h3>
              <div class="h-64 flex justify-center"><canvas id="intentChart"></canvas></div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-title font-bold text-gray-700 mb-4 text-center">สัดส่วนประเภทหน่วยงาน</h3>
              <div class="h-64 flex justify-center"><canvas id="orgChart"></canvas></div>
            </div>
          </div>
        </div>
        
        <!-- TAB 2: LOGISTICS -->
        <div id="tab-logistics" class="tab-content hidden space-y-6">
          <div class="grid lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-title font-bold text-gray-700 mb-4 text-center">สรุปจำนวนเสื้อแยกตามไซซ์</h3>
              <div class="h-64 flex justify-center"><canvas id="shirtChart"></canvas></div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-title font-bold text-gray-700 mb-4 text-center">ข้อจำกัดด้านอาหาร</h3>
              <div class="h-64 flex justify-center"><canvas id="foodChart"></canvas></div>
            </div>
          </div>
        </div>

        <!-- TAB 3: DEMOGRAPHICS -->
        <div id="tab-demographics" class="tab-content hidden space-y-6">
          <div class="grid lg:grid-cols-2 gap-6">
             <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 class="font-title font-bold text-gray-700 mb-4 text-center">สัดส่วนผู้เข้าร่วมแยกตามช่วงวัย</h3>
               <div class="h-64 flex justify-center"><canvas id="demoChart"></canvas></div>
             </div>
             <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
               <p class="text-gray-400 font-semibold">พื้นที่สำหรับส่วนขยายเพิ่มเติม</p>
             </div>
          </div>
        </div>

        <!-- TAB 4: DATATABLE (รายชื่อและการค้นหา) -->
        <div id="tab-datatable" class="tab-content hidden space-y-4">
           <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <h3 class="font-title font-bold text-gray-800 text-lg">ฐานข้อมูลผู้ลงทะเบียนทั้งหมด</h3>
                 <div class="relative w-full md:w-1/3">
                    <input type="text" id="searchInput" onkeyup="handleSearch()" placeholder="🔍 ค้นหาด้วยชื่อ หรือ เบอร์โทร..." class="w-full pl-10 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <span class="absolute left-3 top-3 text-gray-400">🔍</span>
                 </div>
              </div>
              
              <div class="overflow-x-auto">
                 <table class="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                       <tr class="bg-pale text-primary border-b border-gray-200">
                          <th class="p-3 rounded-tl-lg w-16">ลำดับ</th>
                          <th class="p-3">ชื่อผู้ประสานงาน</th>
                          <th class="p-3">เบอร์โทรศัพท์</th>
                          <th class="p-3">หน่วยงาน</th>
                          <th class="p-3">ความประสงค์</th>
                          <th class="p-3 rounded-tr-lg text-center">จัดการ</th>
                       </tr>
                    </thead>
                    <tbody id="dataTableBody">
                       <!-- ข้อมูลตารางจะแสดงที่นี่ -->
                    </tbody>
                 </table>
              </div>

              <!-- Pagination Controls -->
              <div class="flex justify-between items-center mt-6 text-gray-600 font-semibold text-sm">
                 <button onclick="prevPage()" id="btn-prev" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50">⬅️ ก่อนหน้า</button>
                 <span id="pageInfo">หน้า 1 / 1</span>
                 <button onclick="nextPage()" id="btn-next" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50">ถัดไป ➡️</button>
              </div>
           </div>
        </div>

      </main>
    </div>
  `;

  Swal.fire({ title: 'กำลังโหลดข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  fetch(GAS_API_URL)
    .then(res => res.json())
    .then(res => {
      Swal.close();
      if (res.status === "success") {
        const d = res.data;
        
        // 1. Update Top Cards & Charts (อิงตามโค้ดเดิม)
        document.getElementById("stat-orgs").textContent = d.summary?.totalOrgs || 0;
        document.getElementById("stat-parts").textContent = d.summary?.totalParts || 0;
        document.getElementById("stat-shirts").textContent = d.summary?.totalShirts || 0;
        document.getElementById("stat-food").textContent = d.summary?.totalFoodLimits || 0;
        
        const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
        const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };

        new Chart(document.getElementById('intentChart').getContext('2d'), { type: 'doughnut', data: { labels: ['ยืนยันเข้าร่วม', 'ยังไม่แน่ใจ', 'ไม่เข้าร่วม'], datasets: [{ data: [d.intent?.joined || 0, d.intent?.unsure || 0, d.intent?.declined || 0], backgroundColor: ['#2E7D32', '#FBC02D', '#D32F2F'], borderWidth: 0 }] }, options: commonOptions });
        new Chart(document.getElementById('orgChart').getContext('2d'), { type: 'bar', data: { labels: ['ชุมชน', 'ลูกค้า/คู่ค้า', 'สถานศึกษา', 'ภาครัฐ'], datasets: [{ data: [d.orgStats?.village || 0, d.orgStats?.customer || 0, d.orgStats?.school || 0, d.orgStats?.gov || 0], backgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#AB47BC'], borderRadius: 4 }] }, options: barOptions });
        const shirtLabels = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
        new Chart(document.getElementById('shirtChart').getContext('2d'), { type: 'bar', data: { labels: shirtLabels, datasets: [{ data: shirtLabels.map(size => d.logistics?.shirts[size] || 0), backgroundColor: '#81C784', borderRadius: 4 }] }, options: barOptions });
        new Chart(document.getElementById('foodChart').getContext('2d'), { type: 'doughnut', data: { labels: ['ฮาลาล', 'มังสวิรัติ', 'แพ้อาหาร'], datasets: [{ data: [d.logistics?.halal || 0, d.logistics?.veg || 0, d.logistics?.allergy || 0], backgroundColor: ['#4CAF50', '#8BC34A', '#FF7043'], borderWidth: 0 }] }, options: commonOptions });
        new Chart(document.getElementById('demoChart').getContext('2d'), { type: 'doughnut', data: { labels: ['ผู้ใหญ่', 'เด็ก', 'ผู้สูงอายุ'], datasets: [{ data: [d.demographics?.adult || 0, d.demographics?.child || 0, d.demographics?.elder || 0], backgroundColor: ['#388E3C', '#66BB6A', '#FFCA28'], borderWidth: 0 }] }, options: commonOptions });

        // 2. จัดเตรียมข้อมูลสำหรับตารางรายชื่อ
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

// ฟังก์ชันสลับเมนู
window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-primary'); btn.classList.add('hover:bg-white/10');
  });
  event.currentTarget.classList.add('bg-primary');
  event.currentTarget.classList.remove('hover:bg-white/10');
  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');
};

// ======================= TABLE LOGIC =======================
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
          
          // Master Row (ผู้ประสานงาน)
          html += `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
              <td class="p-3 text-gray-500">${start + index + 1}</td>
              <td class="p-3 font-semibold text-gray-800">${row.coordName || "-"}</td>
              <td class="p-3">${row.phone || "-"}</td>
              <td class="p-3 max-w-[200px] truncate" title="${row.orgName}">${row.orgName || "-"}</td>
              <td class="p-3"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${badgeColor}">${row.intent}</span></td>
              <td class="p-3 text-center">
                 ${hasParticipants ? `<button onclick="toggleDetail('detail-${row.coordId}')" class="text-primary hover:text-primaryDark font-semibold underline text-sm">ดูผู้ติดตาม (${row.participants.length})</button>` : `<span class="text-gray-400 text-sm">-</span>`}
              </td>
            </tr>
          `;
          
          // Detail Row (รายชื่อผู้ติดตาม ซ่อนไว้เริ่มต้น)
          if (hasParticipants) {
             let partHtml = `<table class="w-full text-sm text-left"><tr class="text-gray-500 border-b border-gray-200"><th>ชื่อ-นามสกุล</th><th>ประเภท</th><th>ไซซ์เสื้อ</th><th>อาหาร</th></tr>`;
             row.participants.forEach(p => {
                 partHtml += `<tr class="border-b border-gray-100/50"><td class="py-2">${p.name || "-"}</td><td>${p.type || "-"}</td><td>${p.shirt || "-"}</td><td>${p.diet || "-"}</td></tr>`;
             });
             partHtml += `</table>`;
             
             html += `
               <tr id="detail-${row.coordId}" class="hidden bg-gray-50/80 border-b border-gray-200 shadow-inner">
                  <td colspan="6" class="p-4">
                     <div class="pl-12 border-l-4 border-primary">
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
  currentPage = 1; // กลับไปหน้าแรกเสมอเมื่อค้นหา
  renderTable();
}

function prevPage() { if (currentPage > 1) { currentPage--; renderTable(); } }
function nextPage() { const total = Math.ceil(filteredData.length / itemsPerPage); if (currentPage < total) { currentPage++; renderTable(); } }
window.toggleDetail = function(id) {
   const el = document.getElementById(id);
   if (el.classList.contains("hidden")) el.classList.remove("hidden");
   else el.classList.add("hidden");
};

// =====================================================================
// ฟังก์ชันสำหรับเปิด-ปิด Sidebar บนจอมือถือ
// =====================================================================
window.toggleSidebar = function() {
   const sidebar = document.getElementById("admin-sidebar");
   const overlay = document.getElementById("sidebar-overlay");
   
   // เช็กว่าถ้าเปิดบนจอใหญ่ (Desktop) ไม่ต้องทำงาน
   if (window.innerWidth >= 768) return; 

   if (sidebar.classList.contains("-translate-x-full")) {
       // เปิดเมนู
       sidebar.classList.remove("-translate-x-full");
       overlay.classList.remove("hidden");
   } else {
       // ปิดเมนู
       sidebar.classList.add("-translate-x-full");
       overlay.classList.add("hidden");
   }
};