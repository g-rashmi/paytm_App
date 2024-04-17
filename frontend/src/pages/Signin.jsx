import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router";
import axios from "axios";
export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="rashmi.gupta7018@gmail.com"
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
                  username,

                  password,
                };
                const headers = {
                  "Content-Type": "application/json",
                };

                try {
                  const response = await axios.post(
                    "http://localhost:3000/api/v1/user/signin",
                    JSON.stringify(data),
                    { headers }
                  );

                  localStorage.setItem("token", response.data.token);
                  alert("Signin successfully");

                  const firstname = response.data.firstname;
                  const lastname = response.data.lastname;
                  const password = response.data.password;
                  console.log(firstname);
                  navigate(
                    "/dashboard?name=" +
                      firstname +
                      "&id=" +
                      username +
                      "&lastname=" +
                      lastname +
                      "&password=" +
                      password
                  );
                } catch (error) {
                  alert(error);
                  console.error("Error:", error);
                }
              }}
              label={"Sign in"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
