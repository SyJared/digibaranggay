import React from "react"
import Form from "./form"
import { Link } from "react-router-dom"


function Register(){
  return(
    <>
      <Form />
      <div className="text-emerald-900 flex justify-self-center mt-2">
        <Link to="/" className="login-link">Go back to login page</Link>
      </div>
    </>
  )
}

export default Register