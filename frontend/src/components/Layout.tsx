import { Home, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-blue-700 overflow-hidden">
      <aside className="md:flex hidden w-20 bg-blue-700 pt-8 pl-8 flex-col items-center space-y-4 border-none">
        <div className="flex flex-col items-center justify-center pb-8">
          <Link to="/" className="flex flex-col items-center justify-center">
            {/* <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10 cursor-pointer"
            /> */}
            <Ticket className="w-10 h-10 text-black" />
            <span className="text-white font-bold">TS</span>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center cursor-pointer backdrop-filter backdrop-blur bg-opacity-20 bg-white">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-sm">Dashboard</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:flex-1 md:p-8 justify-center items-center h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
