import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Search } from "lucide-react";
import VmTable from "@/components/VmTable";
import CreateVM from "@/components/CreateVM";
import { useState } from "react";
import { fetchVehicles, searchVechile } from "@/queries";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const [seacrhQuery, setSearchQuery] = useState<string>("");
  const [seacrhResult, setSearchResult] = useState<any>(null);
  const username = localStorage.getItem("username");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isPending, isError } = useQuery({
    queryKey: ["vehicles", currentPage],
    queryFn: () => fetchVehicles({ page: currentPage, limit: itemsPerPage }),
    // keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: searchVechile,
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seacrhQuery) return;
    mutation.mutate(seacrhQuery);
    setSearchQuery("");
    setSearchResult(mutation?.data);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl shadow-lg md:px-8 md:py-4 h-full overflow-hidden flex flex-col">
        <div className="px-8 py-6">
          <header className="flex justify-between items-center mb-8">
            <div className="hidden md:block" />
            <div className="flex  items-center space-x-4">
              <img
                src="https://avatar.iran.liara.run/public"
                className="w-10 h-10 bg-gray-200 rounded-full"
              />
              <span>Welcome {username}</span>
              <Button
                variant="ghost"
                className="hover:bg-red-700"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <h1 className="3xl:text-4xl text-2xl font-bold text-center md:text-start text-white pb-8">
            Vehicle Management Center
          </h1>

          <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-8">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search by name and status"
                className="md:pl-10 pl-4 text-white bg-slate-800 rounded-full"
                value={seacrhQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2  text-white cursor-pointer"
                size={20}
                onClick={handleSearch}
              />
            </div>
            <CreateVM currentPage={currentPage} />
          </div>

          {data?.vehicles.length <= 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-60 h-60  rounded-full flex items-center justify-center mb-4">
                <img
                  src="/EmptyState.svg"
                  alt="empty state"
                  className="w-60 h-60"
                />
              </div>
              <h2 className="text-xl mb-2 text-white font-semibold">
                No documents
              </h2>
              <p className="text-white text-2xl">Start creating Data</p>
            </div>
          ) : (
            <VmTable
              data={seacrhResult ? seacrhResult : data?.vehicles}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              isPending={isPending || mutation.isPending}
              isError={isError || mutation.isError}
              totalPages={data?.totalPages}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
