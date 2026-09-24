import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBook, FaMoneyBillWave, FaUser, FaIdCard, FaBirthdayCake,
  FaVenusMars, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle,
  FaChevronDown, FaArrowLeft, FaPaperPlane, FaClock, FaLanguage,
  FaListAlt, FaExclamationTriangle, FaTimes, FaShieldAlt
} from "react-icons/fa";
import "./EnrollmentPage.css";

const MOBILE_RE = /^\d{10}$/;
const EMAIL_RE = /\S+@\S+\.\S+/;
const NIC_RE = /(^\d{9}[VXvx]$)|(^\d{12}$)|(^[A-Za-z0-9\-\/]{4,20}$)/;

function calculateAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

const parseMedium = (medium) => {
  if (Array.isArray(medium)) return medium.join(", ");
  if (typeof medium === "string" && medium.startsWith("[")) {
    try { return JSON.parse(medium).join(", "); } catch { return medium; }
  }
  return medium || "English";
};

const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = location.state || [];

  const [totalFees, setTotalFees] = useState(0);
  const [openInstallment, setOpenInstallment] = useState(null); // index of open card
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    full_name: "", nic: "", date_of_birth: "",
    gender: "", email: "", mobile_number: "", address: "", courses: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selected && selected.length) {
      const courseNames = selected.map((s) => s.course);
      const total = selected.reduce((sum, s) => sum + (Number(s.fees) || 0), 0);
      setTotalFees(total);
      setForm((prev) => ({ ...prev, courses: courseNames }));
    }
  }, []);

  const validateField = (name, value) => {
    const v = typeof value === "string" ? value.trim() : value;
    if (name === "full_name") { if (!v) return "Full name is required"; if (v.length < 2) return "Enter a valid full name"; }
    if (name === "nic") { if (!v) return "NIC / Passport is required"; if (!NIC_RE.test(v)) return "Enter a valid NIC or passport number"; }
    if (name === "email") { if (!v) return "Email is required"; if (!EMAIL_RE.test(v)) return "Enter a valid email address"; }
    if (name === "mobile_number") { if (!v) return "Mobile number is required"; if (!MOBILE_RE.test(v)) return "Enter a valid 10-digit mobile number"; }
    if (name === "address") { if (!v) return "Address is required"; if (v.length < 5) return "Enter a more detailed address"; }
    if (name === "date_of_birth" && v) { const age = calculateAge(v); if (age !== null && age < 15) return "Must be at least 15 years old"; }
    return null;
  };

  const validate = () => {
    const n = {};
    ["full_name", "nic", "email", "mobile_number", "address"].forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) n[f] = err;
    });
    if (!checked) n.agreeTerms = "You must agree to the Terms & Conditions";
    return n;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "mobile_number") next = value.replace(/\D/g, "").slice(0, 10);
    setForm((p) => ({ ...p, [name]: next }));
    const err = validateField(name, next);
    setErrors((p) => { const c = { ...p }; if (err) c[name] = err; else delete c[name]; return c; });
  };

  // Step 1: validate then open the confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const n = validate();
    setErrors(n);
    if (Object.keys(n).length) return;
    setShowConfirm(true);
  };

  // Step 2: user confirmed â€” actually submit
  const handleConfirmedSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const response = await fetch(process.env.REACT_APP_REGISTER_USER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        alert("Enrollment submitted successfully! We will send a confirmation to your email.");
        navigate("/");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if a course has installment plan
  const hasInstallmentPlan = (course) => {
    return Number(course.installment1) > 0 || Number(course.installment2) > 0;
  };

  // Helper: format gender display
  const displayGender = form.gender || "Not specified";
  const displayDOB = form.date_of_birth
    ? new Date(form.date_of_birth).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "Not specified";

  return (
    <div className="ep-page">
      <div className="ep-blob ep-blob--1"></div>
      <div className="ep-blob ep-blob--2"></div>

      <div className="ep-container">
        {/* Header */}
        <div className="ep-header">
          <button className="ep-back-link" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Courses
          </button>
          <h1 className="ep-page-title">Course Enrollment</h1>
          <p className="ep-page-subtitle">Fill in your details to register for the selected course</p>
        </div>

        <div className="ep-layout">
          {/* LEFT â€” Course Preview Sidebar */}
          <aside className="ep-sidebar">
            <div className="ep-summary-card">
              <div className="ep-summary-card__header">
                <span className="ep-summary-icon"><FaListAlt /></span>
                <h2 className="ep-summary-card__title">Course Preview</h2>
              </div>

              {/* Individual course preview cards */}
              <div className="ep-course-previews">
                {selected.map((course, idx) => (
                  <div key={idx} className="ep-course-preview">
                    {/* Course name */}
                    <div className="ep-cp__title-row">
                      <FaBook className="ep-cp__book-icon" />
                      <h3 className="ep-cp__name">{course.course}</h3>
                    </div>

                    {/* Course meta */}
                    <div className="ep-cp__meta">
                      {course.duration && (
                        <div className="ep-cp__meta-item">
                          <FaClock className="ep-cp__meta-icon" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.medium && (
                        <div className="ep-cp__meta-item">
                          <FaLanguage className="ep-cp__meta-icon" />
                          <span>{parseMedium(course.medium)}</span>
                        </div>
                      )}
                    </div>

                    {/* Fee row */}
                    <div className="ep-cp__fee-row">
                      <span className="ep-cp__fee-label">Course Fee</span>
                      <span className="ep-cp__fee-value">Rs. {Number(course.fees || 0).toLocaleString()}</span>
                    </div>

                    {/* Course Description â€” below fee */}
                    {course.description && (
                      <div className="ep-cp__desc-block">
                        <span className="ep-cp__desc-label">Course Description</span>
                        <p className="ep-cp__desc-text">{course.description}</p>
                      </div>
                    )}

                    {/* Installment section â€” only if course has installment plan */}
                    {hasInstallmentPlan(course) && (
                      <div className="ep-cp__installment">
                        <button
                          className="ep-cp__installment-toggle"
                          type="button"
                          onClick={() => setOpenInstallment(openInstallment === idx ? null : idx)}
                        >
                          <span>View Payment Plan</span>
                          <FaChevronDown className={`ep-chevron ${openInstallment === idx ? "ep-chevron--up" : ""}`} />
                        </button>

                        {openInstallment === idx && (
                          <div className="ep-cp__installment-details">
                            {course.registrationFee > 0 && (
                              <div className="ep-installment-row">
                                <span>Registration Fee</span>
                                <span>Rs. {Number(course.registrationFee).toLocaleString()}</span>
                              </div>
                            )}
                            {course.installment1 > 0 && (
                              <div className="ep-installment-row">
                                <span>1st Installment</span>
                                <span>Rs. {Number(course.installment1).toLocaleString()}</span>
                              </div>
                            )}
                            {course.installment2 > 0 && (
                              <div className="ep-installment-row">
                                <span>2nd Installment</span>
                                <span>Rs. {Number(course.installment2).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              {selected.length > 1 && (
                <div className="ep-summary-total">
                  <span>Total for {selected.length} Courses</span>
                  <span className="ep-summary-total__amount">Rs. {totalFees.toLocaleString()}</span>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT â€” Form */}
          <main className="ep-form-panel">
            <div className="ep-form-card">
              <h2 className="ep-form-card__title">Personal Information</h2>

              <form className="ep-form" onSubmit={handleSubmit} noValidate>
                <div className="ep-form-grid">
                  {/* Full Name */}
                  <div className={`ep-field ${errors.full_name ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaUser className="ep-label-icon" /> Full Name <span>*</span>
                    </label>
                    <input className="ep-input" name="full_name" placeholder="e.g. Kamal Perera" value={form.full_name} onChange={handleChange} />
                    {errors.full_name && <span className="ep-error">{errors.full_name}</span>}
                  </div>

                  {/* NIC */}
                  <div className={`ep-field ${errors.nic ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaIdCard className="ep-label-icon" /> NIC / Passport <span>*</span>
                    </label>
                    <input className="ep-input" name="nic" placeholder="e.g. 991234567V" value={form.nic} onChange={handleChange} />
                    {errors.nic && <span className="ep-error">{errors.nic}</span>}
                  </div>

                  {/* Date of Birth */}
                  <div className={`ep-field ${errors.date_of_birth ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaBirthdayCake className="ep-label-icon" /> Date of Birth
                    </label>
                    <input className="ep-input" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                    {errors.date_of_birth && <span className="ep-error">{errors.date_of_birth}</span>}
                  </div>

                  {/* Gender */}
                  <div className="ep-field">
                    <label className="ep-label">
                      <FaVenusMars className="ep-label-icon" /> Gender
                    </label>
                    <select className="ep-input ep-select" name="gender" value={form.gender} onChange={handleChange}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div className={`ep-field ${errors.email ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaEnvelope className="ep-label-icon" /> Email Address <span>*</span>
                    </label>
                    <input className="ep-input" type="email" name="email" placeholder="e.g. kamal@example.com" value={form.email} onChange={handleChange} />
                    {errors.email && <span className="ep-error">{errors.email}</span>}
                  </div>

                  {/* Mobile */}
                  <div className={`ep-field ${errors.mobile_number ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaPhone className="ep-label-icon" /> Mobile Number <span>*</span>
                    </label>
                    <input className="ep-input" name="mobile_number" placeholder="e.g. 0771234567" value={form.mobile_number} onChange={handleChange} />
                    {errors.mobile_number && <span className="ep-error">{errors.mobile_number}</span>}
                  </div>

                  {/* Address */}
                  <div className={`ep-field ep-field--full ${errors.address ? "ep-field--error" : ""}`}>
                    <label className="ep-label">
                      <FaMapMarkerAlt className="ep-label-icon" /> Address <span>*</span>
                    </label>
                    <textarea className="ep-input ep-textarea" name="address" placeholder="Enter your full residential address" value={form.address} onChange={handleChange} rows={3} />
                    {errors.address && <span className="ep-error">{errors.address}</span>}
                  </div>

                  {/* Terms */}
                  <div className={`ep-field ep-field--full ep-field--checkbox ${errors.agreeTerms ? "ep-field--error" : ""}`}>
                    <label className="ep-checkbox-label" onClick={() => { setChecked(!checked); setErrors((p) => { const c = { ...p }; delete c.agreeTerms; return c; }); }}>
                      <span className={`ep-checkbox ${checked ? "ep-checkbox--checked" : ""}`}>
                        {checked && <FaCheckCircle />}
                      </span>
                      I agree to the Mahapola Port Maritime Academy's terms and conditions. *
                    </label>
                    {errors.agreeTerms && <span className="ep-error">{errors.agreeTerms}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="ep-actions">
                  <button type="button" className="ep-btn ep-btn--secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                  </button>
                  <button type="submit" className="ep-btn ep-btn--primary" disabled={submitting}>
                    {submitting ? <span className="ep-spinner"></span> : <><FaPaperPlane /> Submit Enrollment</>}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* â”€â”€ CONFIRMATION MODAL â”€â”€ */}
      {showConfirm && (
        <div className="ep-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="ep-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="ep-modal__header">
              <div className="ep-modal__header-icon">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="ep-modal__title">Confirm Your Enrollment</h2>
                <p className="ep-modal__subtitle">Please review your details carefully before submitting</p>
              </div>
              <button className="ep-modal__close" onClick={() => setShowConfirm(false)} title="Close">
                <FaTimes />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="ep-modal__warning">
              <FaExclamationTriangle className="ep-modal__warning-icon" />
              <p>This information will be used for your <strong>registration, certification, and all course-related processes</strong>. Ensure everything is accurate.</p>
            </div>

            {/* Data Review Grid */}
            <div className="ep-modal__body">
              <div className="ep-modal__section-title">Personal Information</div>
              <div className="ep-modal__grid">
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaUser /> Full Name</span>
                  <span className="ep-modal__value">{form.full_name}</span>
                </div>
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaIdCard /> NIC / Passport</span>
                  <span className="ep-modal__value">{form.nic}</span>
                </div>
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaBirthdayCake /> Date of Birth</span>
                  <span className="ep-modal__value">{displayDOB}</span>
                </div>
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaVenusMars /> Gender</span>
                  <span className="ep-modal__value">{displayGender}</span>
                </div>
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaEnvelope /> Email</span>
                  <span className="ep-modal__value">{form.email}</span>
                </div>
                <div className="ep-modal__field">
                  <span className="ep-modal__label"><FaPhone /> Mobile</span>
                  <span className="ep-modal__value">{form.mobile_number}</span>
                </div>
                <div className="ep-modal__field ep-modal__field--full">
                  <span className="ep-modal__label"><FaMapMarkerAlt /> Address</span>
                  <span className="ep-modal__value">{form.address}</span>
                </div>
              </div>

              <div className="ep-modal__section-title" style={{ marginTop: "20px" }}>Selected Course</div>
              {selected.map((course, idx) => (
                <div key={idx} className="ep-modal__course-row">
                  <div className="ep-modal__course-info">
                    <FaBook className="ep-modal__course-icon" />
                    <div>
                      <p className="ep-modal__course-name">{course.course}</p>
                      {course.duration && <p className="ep-modal__course-meta"><FaClock style={{marginRight:4}}/>{course.duration}</p>}
                    </div>
                  </div>
                  <span className="ep-modal__course-fee">Rs. {Number(course.fees || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="ep-modal__footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowConfirm(false)}>
                <FaArrowLeft /> Edit Details
              </button>
              <button className="ep-btn ep-btn--confirm" onClick={handleConfirmedSubmit}>
                <FaCheckCircle /> Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;
