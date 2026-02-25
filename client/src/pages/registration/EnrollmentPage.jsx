import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EnrollmentPage.css";

const PHONE_RE = /^\+?\d{7,15}$/;
const MOBILE_RE = /^\d{10}$/; // exactly 10 digits
const EMAIL_RE = /\S+@\S+\.\S+/;
const NIC_RE = /(^\d{9}[VXvx]$)|(^\d{12}$)|(^[A-Za-z0-9\-\/]{4,20}$)/;
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function calculateAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course || null;

  const courseName =
    course?.course_name || course?.courseName || course?.name || "Untitled Course";
  const courseCode = course?.course_id || course?.courseId || course?.id || "-";
  const fees = parseFloat(course?.fees || course?.fee || 0) || 0;
  const regFee = parseFloat(course?.registrationFee || course?.registration_fee || 0) || 0;
  const totalFee = fees + regFee;

  const [form, setForm] = useState({
    fullName: "",
    nic: "",
    dob: "",
    gender: "",
    email: "",
    mobile: "",
    address: "",
    emergencyContact: "",
    qualification: "",
    preferredBatch: "",
    agreeTerms: false,
    nicFile: null,
    // Advanced Level (AL)
    al_stream: "",
    al_year: "",
    al_index: "",
    al_subject1: "",
    al_subject1_result: "",
    al_subject2: "",
    al_subject2_result: "",
    al_subject3: "",
    al_subject3_result: "",
    al_general_english_result: "",
    al_general_it_result: "",
    // Ordinary Level (OL)
    ol_year: "",
    ol_index: "",
    ol_math_result: "",
    ol_science_result: "",
    ol_english_result: "",
    ol_language_result: "",
    ol_history_result: "",
    ol_religion_result: "",
    ol_ict_result: "",
    ol_commerce_result: "",
    ol_optional1_name: "",
    ol_optional1_result: "",
    ol_optional2_name: "",
    ol_optional2_result: "",
  });

  const [errors, setErrors] = useState({});

  if (!course) {
    return (
      <div className="enroll-page">
        <div className="enroll-card">
          <div className="course-header">
            <h2 className="course-title">No course selected</h2>
          </div>
          <div className="notice">Please open a course and click <strong>Enroll Now</strong>.</div>
          <div className="form-actions">
            <button className="btn-cancel btn-cancel--red" onClick={() => navigate("/courses")}>Back to Courses</button>
          </div>
        </div>
      </div>
    );
  }

  const validateField = (name, value) => {
    const v = typeof value === "string" ? value.trim() : value;
    switch (name) {
      case "fullName":
        if (!v) return "Full name is required";
        if (v.length < 2) return "Enter a valid full name";
        return null;
      case "nic":
        if (!v) return "NIC / Passport number is required";
        if (!NIC_RE.test(v)) return "Enter a valid NIC or passport number";
        return null;
      case "email":
        if (!v) return "Email is required";
        if (!EMAIL_RE.test(v)) return "Enter a valid email address";
        return null;
      case "mobile":
        if (!v) return "Mobile number is required";
        if (!MOBILE_RE.test(v)) return "Enter a valid mobile number (10 digits)";
        return null;
      case "address":
        if (!v) return "Address is required";
        if (v.length < 5) return "Enter a more detailed address";
        return null;
      case "emergencyContact":
        if (!v) return null;
        if (!PHONE_RE.test(v)) return "Enter a valid emergency contact number";
        return null;
      case "dob":
        if (!v) return null;
        const age = calculateAge(v);
        if (age === null) return "Enter a valid date";
        if (age < 15) return "Applicant must be at least 15 years old";
        return null;
      case "qualification":
        return null;
      case "al_stream":
        if (!v) return "Stream is required for A/L";
        return null;
      case "al_year":
        if (!v) return "A/L year is required";
        if (!/^\d{4}$/.test(v)) return "Enter a valid 4-digit year";
        const currY = new Date().getFullYear();
        if (Number(v) < 1900 || Number(v) > currY) return "Enter a valid year";
        return null;
      case "al_index":
        if (!v) return "A/L index number is required";
        return null;
      case "ol_year":
        if (!v) return "O/L year is required";
        if (!/^\d{4}$/.test(v)) return "Enter a valid 4-digit year";
        const currOLY = new Date().getFullYear();
        if (Number(v) < 1900 || Number(v) > currOLY) return "Enter a valid year";
        return null;
      case "ol_index":
        if (!v) return "O/L index number is required";
        return null;
      case "nicFile":
        if (!v) return null;
        if (!(v instanceof File)) return "Invalid file";
        if (!ALLOWED_FILE_TYPES.includes(v.type)) return "Allowed file types: jpg, png, pdf";
        if (v.size > MAX_FILE_BYTES) return "File too large (max 3 MB)";
        return null;
      case "agreeTerms":
        if (!v) return "You must agree to the terms";
        return null;
      default:
        return null;
    }
  };

  const validate = () => {
    const n = {};
    const fieldsToCheck = [
      "fullName",
      "nic",
      "email",
      "mobile",
      "address",
      "dob",
      "emergencyContact",
      "nicFile",
      "agreeTerms",
    ];

    fieldsToCheck.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) n[f] = err;
    });

    // Qualification specific checks
    if (form.qualification === "AL") {
      // require A/L stream, year, index
      ["al_stream", "al_year", "al_index"].forEach((f) => {
        const err = validateField(f, form[f]);
        if (err) n[f] = err;
      });
    } else if (form.qualification === "OL") {
      ["ol_year", "ol_index"].forEach((f) => {
        const err = validateField(f, form[f]);
        if (err) n[f] = err;
      });
    }

    return n;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = type === "checkbox" ? checked : value;
    // Enforce digits-only and max length for mobile field
    if (name === "mobile") {
      next = String(value).replace(/\D/g, "").slice(0, 10);
    }
    setForm((p) => ({ ...p, [name]: next }));

    // immediate field-level validation
    const fieldError = validateField(name, next);
    setErrors((p) => {
      const copy = { ...p };
      if (fieldError) copy[name] = fieldError;
      else delete copy[name];
      return copy;
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0] || null;
    setForm((p) => ({ ...p, nicFile: file }));
    const fileError = validateField("nicFile", file);
    setErrors((p) => {
      const copy = { ...p };
      if (fileError) copy.nicFile = fileError;
      else delete copy.nicFile;
      return copy;
    });
  };

  const validationErrors = validate();
  const canSubmit = Object.keys(validationErrors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = validate();
    setErrors(n);
    if (Object.keys(n).length) return;

    const payload = {
      course: { courseName, courseCode, totalFee },
      applicant: { ...form, nicFileName: form.nicFile?.name || null },
    };

    console.log("Enrollment submitted:", payload);
    alert("Enrollment data logged to console.");
  };

  return (
    <div className="enroll-page">
      <div className="enroll-card">
        <div className="course-header">
          <div className="course-title-wrap">
            <h2 className="course-title">{courseName}</h2>
          </div>

          <div className="course-summary-box">
            <div className="course-code"><span className="label">Course Code</span><span className="value">{courseCode}</span></div>
            <div className="course-fee"><span className="label">Total Fee</span><span className="value">Rs. {totalFee}</span></div>
          </div>
        </div>

        <form className="enroll-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className={`form-row ${errors.fullName ? "has-error" : ""}`}>
              <label>Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} aria-invalid={!!errors.fullName} />
              {errors.fullName && <div className="error">{errors.fullName}</div>}
            </div>

            <div className={`form-row ${errors.nic ? "has-error" : ""}`}>
              <label>NIC / Passport Number *</label>
              <input name="nic" value={form.nic} onChange={handleChange} aria-invalid={!!errors.nic} />
              {errors.nic && <div className="error">{errors.nic}</div>}
            </div>

            <div className={`form-row ${errors.dob ? "has-error" : ""}`}>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} aria-invalid={!!errors.dob} />
              {errors.dob && <div className="error">{errors.dob}</div>}
            </div>

            <div className={`form-row ${errors.gender ? "has-error" : ""}`}>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={`form-row ${errors.email ? "has-error" : ""}`}>
              <label>Email Address *</label>
              <input name="email" value={form.email} onChange={handleChange} aria-invalid={!!errors.email} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className={`form-row ${errors.mobile ? "has-error" : ""}`}>
              <label>Mobile Number *</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} aria-invalid={!!errors.mobile} />
              {errors.mobile && <div className="error">{errors.mobile}</div>}
            </div>

            <div className={`form-row full-width ${errors.address ? "has-error" : ""}`}>
              <label>Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} aria-invalid={!!errors.address} />
              {errors.address && <div className="error">{errors.address}</div>}
            </div>

            <div className={`form-row ${errors.emergencyContact ? "has-error" : ""}`}>
              <label>Emergency Contact Number</label>
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} aria-invalid={!!errors.emergencyContact} />
              {errors.emergencyContact && <div className="error">{errors.emergencyContact}</div>}
            </div>

            <div className={`form-row ${errors.qualification ? "has-error" : ""}`}>
              <label>Educational Qualification</label>
              <select name="qualification" value={form.qualification} onChange={handleChange}>
                <option value="">Select Qualification</option>
                <option value="AL">Advanced Level (A/L)</option>
                <option value="OL">Ordinary Level (O/L)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Advanced Level details */}
            {form.qualification === "AL" && (
              <div className="form-row full-width qual-card">
                <h3 className="qual-title">Advanced Level Details</h3>
                <div className="form-grid">
                  <div className={`form-row ${errors.al_stream ? "has-error" : ""}`}>
                    <label>Stream</label>
                    <select name="al_stream" value={form.al_stream} onChange={handleChange}>
                      <option value="">Select stream</option>
                      <option value="Physical Science">Physical Science</option>
                      <option value="Biological Science">Biological Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                      <option value="Technology">Technology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={`form-row ${errors.al_year ? "has-error" : ""}`}>
                    <label>Year Completed</label>
                    <input name="al_year" value={form.al_year} onChange={handleChange} placeholder="YYYY" />
                  </div>

                  <div className={`form-row ${errors.al_index ? "has-error" : ""}`}>
                    <label>Index Number</label>
                    <input name="al_index" value={form.al_index} onChange={handleChange} />
                  </div>

                  <div className="form-row full-width subjects-card">
                    <label>Subjects & Results</label>
                    <div className="subject-grid">
                      <div className="subject-row">
                        <input name="al_subject1" placeholder="Subject 1" value={form.al_subject1} onChange={handleChange} />
                        <select name="al_subject1_result" value={form.al_subject1_result} onChange={handleChange}>
                          <option value="">Result</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="S">S</option>
                          <option value="F">F</option>
                        </select>
                      </div>

                      <div className="subject-row">
                        <input name="al_subject2" placeholder="Subject 2" value={form.al_subject2} onChange={handleChange} />
                        <select name="al_subject2_result" value={form.al_subject2_result} onChange={handleChange}>
                          <option value="">Result</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="S">S</option>
                          <option value="F">F</option>
                        </select>
                      </div>

                      <div className="subject-row">
                        <input name="al_subject3" placeholder="Subject 3" value={form.al_subject3} onChange={handleChange} />
                        <select name="al_subject3_result" value={form.al_subject3_result} onChange={handleChange}>
                          <option value="">Result</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="S">S</option>
                          <option value="F">F</option>
                        </select>
                      </div>

                      <div className="subject-row">
                        <label className="small-label">General English (optional)</label>
                        <select name="al_general_english_result" value={form.al_general_english_result} onChange={handleChange}>
                          <option value="">Result</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="S">S</option>
                          <option value="F">F</option>
                        </select>
                      </div>

                      <div className="subject-row">
                        <label className="small-label">General IT (optional)</label>
                        <select name="al_general_it_result" value={form.al_general_it_result} onChange={handleChange}>
                          <option value="">Result</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="S">S</option>
                          <option value="F">F</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ordinary Level details */}
            {form.qualification === "OL" && (
              <div className="form-row full-width qual-card">
                <h3 className="qual-title">Ordinary Level Details</h3>
                <div className="form-grid">
                  <div className={`form-row ${errors.ol_year ? "has-error" : ""}`}>
                    <label>Year Completed</label>
                    <input name="ol_year" value={form.ol_year} onChange={handleChange} placeholder="YYYY" />
                  </div>

                  <div className={`form-row ${errors.ol_index ? "has-error" : ""}`}>
                    <label>Index Number</label>
                    <input name="ol_index" value={form.ol_index} onChange={handleChange} />
                  </div>

                  <div className="form-row full-width subjects-card">
                    <label>O/L Subjects & Results</label>
                    <div className="subject-grid">
                      <div className="subject-row"><span>Mathematics</span>
                        <select name="ol_math_result" value={form.ol_math_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>Science</span>
                        <select name="ol_science_result" value={form.ol_science_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>English</span>
                        <select name="ol_english_result" value={form.ol_english_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>Sinhala / Tamil</span>
                        <select name="ol_language_result" value={form.ol_language_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>History</span>
                        <select name="ol_history_result" value={form.ol_history_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>Religion</span>
                        <select name="ol_religion_result" value={form.ol_religion_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>ICT</span>
                        <select name="ol_ict_result" value={form.ol_ict_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                      <div className="subject-row"><span>Commerce</span>
                        <select name="ol_commerce_result" value={form.ol_commerce_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>

                      <div className="subject-row">
                        <input name="ol_optional1_name" placeholder="Optional Subject 1" value={form.ol_optional1_name} onChange={handleChange} />
                        <select name="ol_optional1_result" value={form.ol_optional1_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>

                      <div className="subject-row">
                        <input name="ol_optional2_name" placeholder="Optional Subject 2" value={form.ol_optional2_name} onChange={handleChange} />
                        <select name="ol_optional2_result" value={form.ol_optional2_result} onChange={handleChange}><option value="">Result</option><option>A</option><option>B</option><option>C</option><option>S</option><option>W</option></select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`form-row ${errors.preferredBatch ? "has-error" : ""}`}>
              <label>Preferred Batch</label>
              <input name="preferredBatch" value={form.preferredBatch} onChange={handleChange} aria-invalid={!!errors.preferredBatch} />
            </div>

            <div className={`form-row ${errors.nicFile ? "has-error" : ""}`}>
              <label>Upload NIC Copy</label>
              <input type="file" name="nicFile" onChange={handleFile} aria-invalid={!!errors.nicFile} />
              {errors.nicFile && <div className="error">{errors.nicFile}</div>}
            </div>

            <div className={`form-row full-width checkbox-row ${errors.agreeTerms ? "has-error" : ""}`}>
              <label className="checkbox-label">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                <span>I agree to the Terms &amp; Conditions *</span>
              </label>
              {errors.agreeTerms && <div className="error">{errors.agreeTerms}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={!canSubmit}>Submit Enrollment</button>
            <button type="button" className="btn-cancel btn-cancel--red" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentPage;
