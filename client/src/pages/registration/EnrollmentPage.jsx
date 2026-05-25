import React, { useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaTag } from "react-icons/fa";
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


//--------------------------------------------------------------------------------------------------------------------------------------------------

const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selected = location.state

  const [coursess,setCourse] = useState()
  const [fees,setFees] = useState(null)


  useEffect(()=>{
        const courses = selected.map((sel)=> sel.course)
        
        setCourse(courses.join(" | "))
        

        const fees = selected.map((sel)=> sel.fees)

        const total = fees.reduce((total,i)=> total + i,0);
        setFees(total)
       setForm((prev)=> ({...prev,courses}))

       
        
  },[])
  


  const [form, setForm] = useState({

    full_name: "",
    nic: "",
    date_of_birth: "",
    gender: "",
    email: "",
    mobile_number: "",
    address: ""
  
  });

  const [showInstallments, setShowInstallments] = useState(false);
  const [checked, setChecked] = useState(false);

  const isChecked =()=>{
    if(checked){
      setChecked(false)
    }else{
      setChecked(true)
    }
  }
 


  const [errors, setErrors] = useState({});

 

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
      // case "agreeTerms":
      //   if (!v) return "You must agree to the terms";
      //   return null;
      default:
        return null;
    }
  };

  const validate = () => {
    const n = {};
    const fieldsToCheck = [
      "full_name",
      "nic",
      "email",
      "mobile_number",
      "address",
      "date_of_birth",
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
  
  const validationErrors = validate();
  const canSubmit = Object.keys(validationErrors).length === 0;

  const handleSubmit = async(e) => {
     e.preventDefault();
    const n = validate();
    setErrors(n);
    if (Object.keys(n).length) return;
  try{

    
    const response = await fetch(process.env.REACT_APP_REGISTER_USER_API, {
      method: 'POST',
      headers: {
    "Content-Type": "application/json"
      },
     body: JSON.stringify(form)
     
    });

    
    const data = await response.json();
    console.log(data)
 
   if(data.success){
    alert("Student enrollment successfully. We will send confirmation mail to your email.");
    navigate('/')
   }else{
    alert("Something went wrong!!")
   }

  }catch(err){
    console.log(err)
    
  }

    

   
   };

  return (
    <div className="enroll-page">
      <div className="enroll-card">
        <div className="course-header">
          <div className="course-title-wrap">
            <h2 className="course-title">Selected Course & Fee</h2>
          </div>

          <div className="course-summary-box">
            <div className="course-info-grid">
              {/* Course Info Card */}
              <div className="info-item">
                <span className="info-icon">
                  <FaBook />
                </span>
                <div className="info-content">
                  <p className="info-label">Selected Course</p>
                  <p className="info-value">{coursess}</p>
                </div>
              </div>

              {/* Fee / Installments Clickable Card */}
              <div 
                className="info-item clickable"
                onClick={() => setShowInstallments(!showInstallments)}
              >
                <span className="info-icon" style={{ background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)' }}>
                  <FaTag />
                </span>
                <div className="info-content">
                  <p className="info-label">Course Fee (Click to view plans)</p>
                  <p className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Rs. {fees?.toLocaleString()}
                    <span style={{ transform: showInstallments ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block', fontSize: '10px' }}>▼</span>
                  </p>
                </div>
              </div>
            </div>

            {showInstallments && (
              <div className="installments-dropdown" style={{ 
                marginTop: '5px', 
                paddingTop: '15px', 
                borderTop: '1px dashed #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Registration Fee:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Rs. 1,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Installment Plan:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>2 Installments (50% upfront, 50% midway)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <form className="enroll-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className={`form-row ${errors.full_name ? "has-error" : ""}`}>
              <label>Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} aria-invalid={!!errors.full_name} />
              {errors.full_name && <div className="error">{errors.full_name}</div>}
            </div>

            <div className={`form-row ${errors.nic ? "has-error" : ""}`}>
              <label>NIC *</label>
              <input name="nic" value={form.nic} onChange={handleChange} aria-invalid={!!errors.nic} />
              {errors.nic && <div className="error">{errors.nic}</div>}
            </div>

            <div className={`form-row ${errors.date_of_birth ? "has-error" : ""}`}>
              <label>Date of Birth</label>
              <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} aria-invalid={!!errors.date_of_birth} />
              {errors.date_of_birth && <div className="error">{errors.date_of_birth}</div>}
            </div>

            <div className={`form-row ${errors.gender ? "has-error" : ""}`}>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={`form-row ${errors.email ? "has-error" : ""}`}>
              <label>Email Address *</label>
              <input name="email" value={form.email} onChange={handleChange} aria-invalid={!!errors.email} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className={`form-row ${errors.mobile_number ? "has-error" : ""}`}>
              <label>Mobile Number *</label>
              <input name="mobile_number" value={form.mobile_number} onChange={handleChange} aria-invalid={!!errors.mobile} />
              {errors.mobile && <div className="error">{errors.mobile}</div>}
            </div>

            <div className={`form-row full-width ${errors.address ? "has-error" : ""}`}>
              <label>Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} aria-invalid={!!errors.address} />
              {errors.address && <div className="error">{errors.address}</div>}
            </div>

            <div className={`form-row full-width checkbox-row ${errors.agreeTerms ? "has-error" : ""}`}>
              <label className="checkbox-label">
                <input type="checkbox"  checked={checked} onChange={isChecked} />
                <span>I agree to the Terms &amp; Conditions *</span>
              </label>
              {errors.agreeTerms && <div className="error">{errors.agreeTerms}</div>}
            </div>
          </div>

          <div className="form-actions row" style={{alignItems: 'center'}}>
            <div className="col-auto">
              <button type="button" className="btn-submit btn btn-primary" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn-submit btn btn-primary" >Submit Enrollment</button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentPage;
