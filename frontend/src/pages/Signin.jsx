import React, { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router";
import axios from "axios";
import { BACKEND_URL } from "../components/configg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
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
        `${BACKEND_URL}/api/v1/user/signin`,
        JSON.stringify(data),
        { headers }
      );

      if (response.data.s === "true") {
        toast.success(response.data.msg); // Display success message
        const { firstname, lastname } = response.data; // Destructure firstname and lastname
        navigate(
          `/dashboard?name=${firstname}&id=${username}&lastname=${lastname}&password=${password}`
        );
      } else {
        toast.error(response.data.msg); // Display error message
      }
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="rashmi.gupta7018@gmail.com"
            label={"Email"}
          />
          <InputBox
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} />
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
