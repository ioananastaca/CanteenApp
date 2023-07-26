import React, { useState } from "react";
import { useRegisterUserMutation } from "../Apis/authApi";
import { inputHelper, toastNotify } from "../Helper";
import { apiResponse } from "../Interfaces";
import { SD_Roles } from "../Utility/SD";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";

function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Email validation
    if (!userInput.userName.endsWith("@usv.ro")) {
      // Invalid email format
      toastNotify(
        "Te rugam să folosești adresa furnizată de universitate. Ex:  nume@usv.ro",
        "error"
      );
      return;
    }
  
    setLoading(true);
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });
  
    if (response.data) {
      toastNotify("Înregistrare cu succes! Te rugăm să te autentifici.");
      navigate("/login");
    } else if (response.error) {
      const errorMessages = response.error.data.errorMessages;
      if (errorMessages && errorMessages.length > 0) {
        if (errorMessages[0] === "Username already exists") {
          toastNotify("Utilizatorul există!", "error");
        } else {
          toastNotify(errorMessages[0], "error");
        }
      } else {
        toastNotify("Utilizatorul exista!", "error");
      }
    }
  
    setLoading(false);
  };
  

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">CREARE CONT</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nume"
              required
              name="name"
              value={userInput.name}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Parola"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              required
              value={userInput.role}
              name="role"
              onChange={handleUserInput}
            >
              <option value="">--Selectează rol--</option>
              <option value={`${SD_Roles.CUTOMER}`}>Student</option>
              {userInput.userName.endsWith("@admin") && (
                <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-success" disabled={loading}>
            Înregistrează-te!
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
