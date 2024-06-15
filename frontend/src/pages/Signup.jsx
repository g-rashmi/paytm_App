import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { BACKEND_URL } from "../components/configg";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="rashmi"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Gupta"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="rashmi@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                const data = {
                  username: email,
                  firstName: firstname,
                  lastName: lastname,
                  password: password,
                };

                const headers = {
                  "Content-Type": "application/json",
                };

                try {
                  const response = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signup`,
                    JSON.stringify(data),
                    { headers }
                  );

                  if (response.data.success) {
                    toast.success(response.data.msg);
                    localStorage.setItem("token", response.data.token);
                    navigate(
                      `/dashboard?name=${firstname}&id=${email}&lastname=${lastname}&password=${password}`
                    );
                  } else {
                    toast.error(response.data.msg);
                  }
                } catch (error) {
                  toast.error(error.message);
                  console.error("Error:", error);
                }
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
