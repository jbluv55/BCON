/**
 * Institutional Knowledge Base & Intelligent Advisor Engine for Bridge College of Nursing
 * Provides instant, highly accurate institutional answers when running on static hosting
 * (e.g. Namecheap cPanel/Apache where /api/chat is not backed by a Node.js runtime)
 * or when external AI endpoints are experiencing temporary upstream latency.
 */

export interface AdvisorResponse {
  reply: string;
  modelUsed: string;
}

export function generateInstitutionalAdvisorReply(
  userQuery: string,
  roleId: string,
  history: { role: string; content: string }[] = []
): AdvisorResponse {
  const query = userQuery.toLowerCase().trim();

  // =========================================================================
  // 1. ADMISSIONS COUNSELOR PERSONA & ADMISSIONS QUERIES
  // =========================================================================
  if (
    query.includes('requirement') ||
    query.includes('waec') ||
    query.includes('neco') ||
    query.includes('nabteb') ||
    query.includes('credit') ||
    query.includes('sitting') ||
    query.includes('qualif') ||
    query.includes('entry') ||
    query.includes('eligib')
  ) {
    return {
      modelUsed: 'Bridge Advisor (Institutional AI)',
      reply: `### **Academic Entry Requirements for Bridge College of Nursing**

Welcome to **Bridge College of Nursing and Health Sciences**, Ibadan! To be admitted into our **General Nursing (RN)** or **Basic Midwifery (RM)** programmes, applicants must fulfill the following criteria:

* **Required Subjects:** Minimum of **five (5) Credit passes** in:
  1. English Language
  2. Mathematics
  3. Biology
  4. Chemistry
  5. Physics
* **Exam Bodies:** WAEC, NECO, or NABTEB.
* **Sittings Rule:** Obtained in **not more than two (2) sittings** (results from WAEC and NECO can be combined).
* **Age Requirement:** Applicants must be at least **17 years of age**.

---

### **How to Apply:**
1. Navigate to the **Admissions** tab on this website.
2. Complete the online admission application form with your biodata and exam results.
3. Bring your original credentials to our campus for verification and entrance screening.

For direct admissions support, you can contact our Admissions Desk via WhatsApp at **+234 701 7514 313** or email **info@bridgecollegeofnursing**.`
    };
  }

  // Fees, Tuition, and Costs
  if (
    query.includes('fee') ||
    query.includes('tuition') ||
    query.includes('cost') ||
    query.includes('how much') ||
    query.includes('price') ||
    query.includes('pay') ||
    query.includes('installment')
  ) {
    return {
      modelUsed: 'Bridge Advisor (Institutional AI)',
      reply: `### **Fee Structure at Bridge College of Nursing**

Here is the current standard fee schedule for our professional programmes:

1. **General Nursing Programme (RN - 3 Years):**
   * **Tuition Fee:** ₦220,000 per semester
   * **Ancillary & Clinical Lab Levy:** ₦80,000
   * **Total per Semester:** **₦300,000**

2. **Basic Midwifery Programme (RM - 3 Years):**
   * **Tuition Fee:** ₦230,000 per semester
   * **Ancillary Levy:** ₦70,000
   * **Total per Semester:** **₦300,000**

3. **Foundation in Basic Health Sciences (1 Year):**
   * **Tuition & Lab Prep:** ₦180,000 per semester

*Note: All statutory school fees must be paid to the designated college bursary account. Contact our Admissions & Bursary hotline on WhatsApp at **+234 701 7514 313** to receive official bank payment invoices.*`
    };
  }

  // Space Rental / Commercial Use
  if (
    query.includes('space') ||
    query.includes('rent') ||
    query.includes('let') ||
    query.includes('hall') ||
    query.includes('church') ||
    query.includes('fellowship') ||
    query.includes('event') ||
    query.includes('seminar') ||
    query.includes('cbt') ||
    query.includes('exam suite')
  ) {
    return {
      modelUsed: 'Bridge Advisor (Institutional AI)',
      reply: `### **Commercial Spaces & Facilities Available for Rent**

Bridge College of Nursing offers standard, fully furnished, air-conditioned spaces for hire in a serene, gated environment along Akala Express, Ibadan:

* **Suitable For:**
  * **Corporate Meetings & Seminars:** Quiet, executive air-conditioned boardrooms.
  * **Church Fellowships & Gatherings:** Spacious acoustic halls with flexible seating layouts.
  * **Coaching & Extra-Mural Classes:** Modern tiered lecture halls with whiteboards and blue writing desks.
  * **Workshops & Bootcamps:** Configurable practical seminar halls.
  * **ICT Computer Lab / CBT Exams:** High-speed internet desktop workstations with partition dividers and backup power.

* **Key Amenities Included:**
  * 24/7 Uninterrupted power supply (Heavy-duty generator + solar backup).
  * High-performance split air-conditioning.
  * 24hrs armed & compound security with CCTV.
  * Large, paved, secure parking grounds.
  * **Special discounts** for recurring church fellowships and educational bootcamps!

To check availability or book a walkthrough inspection, message our Space Desk on WhatsApp at **+234 701 7514 313** or **+44 791 2495 161**.`
    };
  }

  // Location / Address / Directions
  if (
    query.includes('location') ||
    query.includes('address') ||
    query.includes('where') ||
    query.includes('map') ||
    query.includes('ibadan') ||
    query.includes('akala')
  ) {
    return {
      modelUsed: 'Bridge Advisor (Institutional AI)',
      reply: `### **Bridge College of Nursing Campus Location**

* **Physical Address:**  
  Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express, Ibadan, Oyo State, Nigeria.

* **Landmark:**  
  Easily accessible from Akala Express Road. Located inside a serene, private gated compound free from city noise.

* **Enquiries Hotline:**  
  * WhatsApp / Phone: **+234 701 7514 313**  
  * International Desk: **+44 791 2495 161**  
  * Email: **info@bridgecollegeofnursing** or **bridgecollegeofnursing@gmail.com**

Walk-in visits and campus tours are warmly welcome Mondays through Saturdays (8:00 AM – 5:00 PM).`
    };
  }

  // Accreditation & NMCN
  if (query.includes('accredit') || query.includes('nmcn') || query.includes('council') || query.includes('approved')) {
    return {
      modelUsed: 'Bridge Advisor (Institutional AI)',
      reply: `### **Accreditation & Professional Licensing**

* **Regulatory Body:**  
  Bridge College of Nursing is established in alignment with the standards set by the **Nursing and Midwifery Council of Nigeria (NMCN)**.
* **Licensing Examinations:**  
  Graduates of our 3-year General Nursing program are eligible to sit for the NMCN professional licensing exams to become **Registered Nurses (RN)**.
* **Clinical Affiliations:**  
  Students undergo intensive hospital clinical rotations and postings at state government teaching and general hospitals across Oyo State.
* **Leadership:**  
  Founded by **Rev. Ms Bridget Adesina** (BA Hons Theology, PG Dip Advance Practice, BSc Health Studies), fostering both academic excellence and clinical integrity.`
    };
  }

  // =========================================================================
  // 2. CLINICAL & NURSING TUTOR PERSONA
  // =========================================================================
  if (roleId === 'clinical_tutor' || query.includes('adpie') || query.includes('vital sign') || query.includes('dosage') || query.includes('pharmacology') || query.includes('anatomy') || query.includes('nursing process')) {
    
    if (query.includes('adpie') || query.includes('nursing process')) {
      return {
        modelUsed: 'Clinical Nursing Faculty AI',
        reply: `### **The 5-Step Nursing Process (ADPIE)**

As future Registered Nurses and Midwives, mastering **ADPIE** is central to patient care and NMCN licensing exams:

1. **Assessment (A):**
   * Systematic collection of subjective data (patient statements, symptoms) and objective data (vital signs, physical exam, lab values).
2. **Diagnosis (D):**
   * Clinical judgment regarding human response to health conditions (NANDA-I nursing diagnosis, e.g., *Ineffective Airway Clearance related to retained secretions*).
3. **Planning (P):**
   * Formulating SMART patient-centered goals and establishing evidence-based nursing interventions.
4. **Implementation (I):**
   * Executing planned nursing care (medication administration, wound dressing, patient education, positioning).
5. **Evaluation (E):**
   * Assessing patient response to determine whether established outcomes were met, partially met, or require plan revision.`
      };
    }

    if (query.includes('vital') || query.includes('bp') || query.includes('pulse') || query.includes('temperature')) {
      return {
        modelUsed: 'Clinical Nursing Faculty AI',
        reply: `### **Clinical Baseline Vital Signs (Adult Reference Ranges)**

Here are the key diagnostic baselines for clinical nursing practice:

* **Blood Pressure (BP):** 120/80 mmHg (Normal systolic 90–120 mmHg, diastolic 60–80 mmHg).
* **Pulse / Heart Rate:** 60 – 100 beats per minute (BPM), regular rhythm.
* **Respiratory Rate (RR):** 12 – 20 breaths per minute.
* **Core Body Temperature:** 36.5°C – 37.5°C (Normothermia).
* **Oxygen Saturation (SpO₂):** 95% – 100% on ambient room air.

*Clinical Pearl:* Always re-check abnormal vital signs manually before administering anti-hypertensives (e.g. withholding digoxin if apical pulse < 60 bpm).`
      };
    }

    if (query.includes('dosage') || query.includes('drip') || query.includes('formula') || query.includes('calculation')) {
      return {
        modelUsed: 'Clinical Nursing Faculty AI',
        reply: `### **Clinical Drug & IV Drip Calculations**

1. **Standard Oral/Injection Dosage Formula:**
   $$\\text{Dose to Give} = \\frac{\\text{Doctor's Order (Desired)}}{\\text{Dose on Hand (Stock)}} \\times \\text{Vehicle (Quantity)}$$

2. **IV Drip Rate Formula (Drops per Minute - gtt/min):**
   $$\\text{Flow Rate (gtt/min)} = \\frac{\\text{Total Volume (mL)} \\times \\text{Drop Factor (gtt/mL)}}{\\text{Time in Minutes}}$$
   * Standard macro-drip factor = 15 or 20 gtt/mL.
   * Pediatric micro-drip factor = 60 gtt/mL.`
      };
    }

    return {
      modelUsed: 'Clinical Nursing Faculty AI',
      reply: `### **Clinical Nursing Tutor Guidance**

Welcome! As clinical faculty at Bridge College of Nursing, I am here to assist with:
* **ADPIE & Nursing Care Plans:** Formulating diagnoses and SMART outcomes.
* **Clinical Pharmacology:** Safe drug administration, therapeutic drug ranges, and contraindications.
* **Anatomy & Physiology:** Cardiovascular, respiratory, renal, and maternal-fetal dynamics.
* **NMCN Board Prep:** Scenario-based clinical decision making and triage.

What specific medical-surgical concept, drug calculation, or obstetric question would you like to explore?`
    };
  }

  // =========================================================================
  // 3. STUDENT AFFAIRS & ACADEMIC WELFARE ADVISOR PERSONA
  // =========================================================================
  if (roleId === 'student_advisor' || query.includes('portal') || query.includes('timetable') || query.includes('exam date') || query.includes('hostel') || query.includes('logbook')) {
    return {
      modelUsed: 'Student Affairs Faculty AI',
      reply: `### **Student Affairs & Academic Services**

Hello! Here is essential guidance for active Bridge College students:

* **Student E-Portal:**  
  Click **E-Portal** in the navigation header to log in with your Student ID and access your semester course registrations, examination slips, and fee clearances.
* **Lecture & Clinical Timetables:**  
  Timetables for NSC 211, BIO 112, and PHM 222 are updated on the college noticeboard and student portal dashboard.
* **Clinical Ward Logbooks:**  
  Ensure your preceptor signs your clinical procedures at the end of every morning/afternoon rotation before submitting to your clinical coordinator.
* **Student Welfare & Counseling:**  
  Need assistance managing study workload, night shifts, or exam stress? The Student Affairs office is open daily on campus or via WhatsApp at **+234 701 7514 313**.`
    };
  }

  // =========================================================================
  // 4. GENERAL INSTITUTIONAL WELCOME & FALLBACK
  // =========================================================================
  return {
    modelUsed: 'Bridge College AI',
    reply: `### **Bridge College of Nursing and Health Sciences**

Thank you for your message! Here is how we can assist you today:

1. **Admissions & Entry Requirements:**  
   * 5 O'Level Credits in English, Mathematics, Biology, Chemistry, and Physics (WAEC/NECO/NABTEB in not more than 2 sittings).
2. **Programmes Offered:**  
   * General Nursing (RN - 3 Years)  
   * Basic Midwifery (RM - 3 Years)  
   * Foundation in Basic Health Sciences
3. **Space Rental for Commercial Use:**  
   * Lecture halls, seminar rooms, church fellowship spaces, and ICT computer examination suites available for hire.
4. **Campus Location:**  
   * Harriet Shoroye Street, Off Akala Express, Ibadan, Oyo State, Nigeria.

For immediate personalized assistance, feel free to contact our Admissions & Administrative Desk on WhatsApp at **+234 701 7514 313** or email **info@bridgecollegeofnursing**!`
  };
}
