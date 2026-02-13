import React, { useState } from "react";
import "./form.css";
import { Link } from "react-router";

function Form() {
  const [form, setForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    address: "",
    birthdate: "",
    gender: "",
    housenumber: "",
    contactnumber: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim() || !form.password) {
      setMessage("Please fill in all required fields.");
      return;
    }
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (form.password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setMessage("Registration submitted — thank you!");
    
    try {
      const res = await fetch("http://localhost/digibaranggay/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
      
      if (data.success) {
        setForm({
          firstname: "",
          middlename: "",
          lastname: "",
          email: "",
          password: "",
          address: "",
          birthdate: "",
          gender: "",
          housenumber: "",
          contactnumber: ""
        });
        setConfirmPassword("");
        setShowModal(true);
      }
    } catch (err) {
      setMessage("Error submitting form");
      console.error(err);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <span className="title-register primary-color-text">Register</span>

      <div className="fields label-form">
        {/* Name Fields */}
        <div>
          <label htmlFor="firstname">First Name *</label>
          <input id="firstName" name="firstname" value={form.firstname} onChange={handleChange} placeholder="Enter your first name" required />
        </div>

        <div>
          <label htmlFor="middlename">Middle Name</label>
          <input id="middleName" name="middlename" value={form.middlename} onChange={handleChange} placeholder="Enter your middle name" />
        </div>

        <div>
          <label htmlFor="lastname">Last Name *</label>
          <input id="lastName" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Enter your last name" required />
        </div>

        {/* Birthdate */}
        <div>
          <label htmlFor="birthdate">Birth Date</label>
          <input id="birthDate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Enter your address" />
        </div>

        {/* Household Number */}
        <div>
          <label htmlFor="housenumber">Household Number</label>
          <input id="housenumber" name="housenumber" type="text" value={form.housenumber} onChange={handleChange} placeholder="Enter your household number" />
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactnumber">Contact Number</label>
          <input id="contactnumber" name="contactnumber" type="text" value={form.contactnumber} onChange={handleChange} placeholder="Enter your contact number" />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password *</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
        </div>
      </div>

      {/* Gender */}
      <div className="md:col-span-2">
        <label className="block mb-2 label-form">Gender *</label>
        <div className="flex gap-6 transition-all">
          <label className={`flex items-center gap-2 font-medium px-3 rounded-full duration-300 ${form.gender === 'Male' ? 'text-white primary-color' : 'text-gray-800'}`}>
            <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} required />
            Male
          </label>

          <label className={`flex items-center gap-2 font-medium px-3 rounded-full duration-300 ${form.gender === 'Female' ? 'text-white primary-color' : 'text-gray-800'}`}>
            <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} />
            Female
          </label>
        </div>
      </div>

      {/* Submit */}
      <button className="submit primary-color" type="submit">Submit</button>

      {message && <p className="message">{message}</p>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-96 shadow-xl relative text-center">
            <h2 className="text-2xl font-semibold mb-4">Registration Successful!</h2>
            <p className="text-gray-700 mb-6 font-semibold">
              Your account has been <span className="primary-color-text">registered</span>. Please wait for approval.
            </p>
            <button className="primary-color text-white px-6 py-2 rounded-full hover:opacity-90 transition">
              Go <Link to="/" className="login-link"> back to login </Link>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default Form;
