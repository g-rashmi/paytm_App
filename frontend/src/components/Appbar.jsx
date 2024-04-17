import { useNavigate } from "react-router";
export const Appbar = ({ name, lastname, password }) => {
  const navigate = useNavigate();
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">PayTM App</div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">{name}</div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <button
            className="flex flex-col justify-center h-full text-xl"
            onClick={() => {
              navigate(
                "/profile?name=" +
                  name +
                  "&lastname=" +
                  lastname +
                  "&password=" +
                  password
              );
            }}
          >
            {name[0]}
          </button>
        </div>
      </div>
    </div>
  );
};
