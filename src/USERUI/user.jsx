import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../rolecontext";
import Announcement from "./announcement";
import Request from "./request";

function User() {
  const { user } = useContext(RoleContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/LOGIN/login"); // redirect if not logged in
    }
  }, [user]);

  if (!user) return null; // optionally render nothing until redirect

  return (
    <>
      <Announcement />
      <Request />
    </>
  );
}

export default User;