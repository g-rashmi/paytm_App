import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
const token = localStorage.getItem("token");
export const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(searchParams.get("name"));
  const [lastName, setLastName] = useState(searchParams.get("lastname"));
  const email = searchParams.get("id");
  const [password, setPassword] = useState(searchParams.get("password"));

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = {
        firstName,
        lastName,
        password,
      };
      // Make a PUT request to update the profile
      const response = await axios.put(
        "http://localhost:3000/api/v1/user/",
        JSON.stringify(data),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      navigate(
        "/dashboard?name=" +
          firstName +
          "&id=" +
          email +
          "&lastname=" +
          lastName +
          "&password=" +
          password
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl  m-6">
      <div className="p-8">
        <div className="uppercase tracking-wide  text-gray-500 font-bold text-center text-2xl">
          Profile
        </div>
        <div className="mt-2">
          <div className="flex">
            <div className="mr-4">
              <label
                className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="firstName"
              >
                First Name:
              </label>
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="lastName"
              >
                Last Name:
              </label>
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={updateProfile}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
