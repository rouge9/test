import LoginForm from "@/components/LoginForm";
import RegForm from "@/components/RegForm";
import { useState } from "react";

const LoginPage = () => {
  const [islogin, setLogin] = useState(true);
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Blue background with logo and text */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-900 text-white p-8 flex flex-col justify-center items-center md:w-3/5">
        <div className="mb-8">
          <div className="flex gap-5 items-center justify-center">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 h-20 md:w-52 md:h-52"
            />
            <div className="flex flex-col"></div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center ">
            Vehicle Managment
          </h1>
        </div>
      </div>

      {islogin ? (
        <LoginForm setLogin={setLogin} />
      ) : (
        <RegForm setLogin={setLogin} />
      )}
    </div>
  );
};

export default LoginPage;
