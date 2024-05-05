import { Users } from "../components/Users";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../components/configg";
const token = localStorage.getItem("token");
export const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const username = searchParams.get("id");
  const lastname = searchParams.get("lastname");
  const password = searchParams.get("password");
  const [balance, setBalance] = useState(0);
  axios
    .get(`${BACKEND_URL}/api/v1/account/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setBalance(response.data.balance);
    })
    .catch((error) => {
      alert(error);
    });

  return (
    <div>
      <Appbar name={name} lastname={lastname} password={password} />
      <div>
        <Balance balance={balance} />
        <Users username={username} />
      </div>
    </div>
  );
};
