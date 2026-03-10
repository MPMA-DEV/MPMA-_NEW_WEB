import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EnrollmentPage.css";

const PHONE_RE = /^\+?\d{7,15}$/;
const MOBILE_RE = /^\d{10}$/; // exactly 10 digits
const EMAIL_RE = /\S+@\S+\.\S+/;
const NIC_RE = /(^\d{9}[VXvx]$)|(^\d{12}$)|(^[A-Za-z0-9\-\/]{4,20}$)/;
// file upload removed; no MAX_FILE_BYTES or ALLOWED_FILE_TYPES

// keep a safe fallback in case earlier builds reference CITIES
const CITIES = [];

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
    nameWithInitials: "",
    nic: "",
    dob: "",
    gender: "",
    email: "",
    mobile: "",
    address: "",
    emergencyContact: "",
    // qualification, city, postalCode removed
    agreeTerms: false,
    // AL/OL fields removed
  });

  // location/city list removed

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
      // qualification removed
      case "nameWithInitials":
        if (!v) return "Name with initials is required";
        if (v.length < 2) return "Enter a valid name with initials";
        return null;
      // AL/OL and nicFile validations removed
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
      "nameWithInitials",
      "nic",
      "email",
      "mobile",
      "address",
      "dob",
      "emergencyContact",
      "agreeTerms",
    ];

    fieldsToCheck.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) n[f] = err;
    });
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

  // handleFile removed (no file input)

  const validationErrors = validate();
  const canSubmit = Object.keys(validationErrors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = validate();
    setErrors(n);
    if (Object.keys(n).length) return;

    const payload = {
      course: { courseName, courseCode, totalFee },
      applicant: { ...form },
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

            <div className={`form-row ${errors.nameWithInitials ? "has-error" : ""}`}>
              <label>Name with Initials *</label>
              <input name="nameWithInitials" value={form.nameWithInitials} onChange={handleChange} aria-invalid={!!errors.nameWithInitials} />
              {errors.nameWithInitials && <div className="error">{errors.nameWithInitials}</div>}
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

            {/* Educational qualification and AL/OL sections removed */}

            {/* Location and NIC file upload removed */}

            <div className={`form-row full-width checkbox-row ${errors.agreeTerms ? "has-error" : ""}`}>
              <label className="checkbox-label">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                <span>I agree to the Terms &amp; Conditions *</span>
              </label>
              {errors.agreeTerms && <div className="error">{errors.agreeTerms}</div>}
            </div>
          </div>

          <div className="form-actions row" style={{alignItems: 'center'}}>
            <div className="col-auto">
              <button type="submit" className="btn-submit btn btn-primary" disabled={!canSubmit}>Submit Enrollment</button>
            </div>
            <div className="col-auto">
              <button type="button" className="btn-cancel btn-cancel--red btn btn-danger" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentPage;
