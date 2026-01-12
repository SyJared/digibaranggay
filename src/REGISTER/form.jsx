import React, { useState } from "react";
import "./form.css";

function Form() {
  const [form, setForm] = useState(
    { firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      password: "",
      address: "",
      birthdate: "",
      gender: ""}
  );
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
        setForm({ firstname: "", middlename: "", lastname: "", email: "", password: "", address: "", birthdate: "", gender: ""});
        setConfirmPassword("");
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

        <div>
          <label htmlFor="birthdate">Birth Date</label>
          <input id="birthDate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Enter your address" />
        </div>

        <div>
          <label htmlFor="password">Password *</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block mb-2 label-form">Gender *</label>

        <div className="flex gap-6 transition-all ">
          <label className={`flex items-center gap-2 font-medium px-3 rounded-full duration-300
            ${form.gender ==='Male' ?'text-white primary-color ' :'text-gray-800'}`}>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={handleChange}
              required
            />
            Male
          </label>

          <label className={`flex items-center gap-2 font-medium px-3 rounded-full duration-300
            ${form.gender ==='Female' ?'text-white primary-color ' :'text-gray-800'}`}>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={handleChange}
            />
            Female
          </label>

  </div>
</div>

      <button className="submit primary-color" type="submit">Submit</button>

      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default Form;