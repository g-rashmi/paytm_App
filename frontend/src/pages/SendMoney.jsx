import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const token = localStorage.getItem("token");
export const Send = () => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState(0);
  const name = searchParams.get("name");
  const id = searchParams.get("id");
  console.log(id);
  const Transfer = async () => {
    try {
      const data = {
        amount: amount,
        to: id,
      };

      await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        JSON.stringify(data),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Transfer successfull");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="flex justify-center h-screen bg-slate-300 ">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-3 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 ">
            <h2 className="text-3xl font-bold text-center "> Send Money </h2>
          </div>
          <div>
            <div className="flex items-center space-x-4 justify-center p-1.5 ">
              <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-center">
                <span className="text-2xl text-black ">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </div>
              <button
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-slate-600 text-white text-xl"
                onClick={Transfer}
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
