import React, { useState } from "react";
import { useLoginUserMutation } from "../Apis/authApi";
import { apiResponse, userModel } from "../Interfaces";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { MainLoader } from "../Components/Page/Common";
import { inputHelper } from "../Helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [error, setError] = useState("");
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: apiResponse = await loginUser({
        userName: userInput.userName,
        password: userInput.password,
      });
      if (response.data) {
        const { token } = response.data.result;
        const { fullName, id, email, role }: userModel = jwt_decode(token);
        localStorage.setItem("token", token);
        dispatch(setLoggedInUser({ fullName, id, email, role }));
        navigate("/");
      } else {
        throw new Error("Username or password is incorrect");
      }
    } catch (errorMessage) {
      const errorMessagee = error || "Parola sau adresa de email incorecte";
      setError(errorMessagee);
      toast.error("Parola sau adresa de email incorecte");
    }
    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">AUTENTIFICARE</h1>
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
              type="password"
              className="form-control"
              placeholder="Parola"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
        </div>

        <div className="mt-2">
          {error && <p className="text-danger">{error}</p>}
          <br> 
          
          
          </br>
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            Login
          </button>
        </div>
      </form>
      <br>
      
      
      
      
      </br>
      <ToastContainer />
      <br>
      
      


      
      

      
      </br>
    </div>
  );
}

export default Login;
