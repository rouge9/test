import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginFormProps } from "@/types";
import { useToast } from "@/hooks/use-toast";

const LoginForm: React.FC<LoginFormProps> = ({ setLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      console.error(error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };
  // Make sure the component returns valid JSX
  return (
    <div className="bg-white p-8 flex flex-col justify-center md:w-2/5">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="sr-only">
              Username
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                className="w-full pl-10 py-8 border-muted rounded-full"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-10 py-8 border-muted rounded-full"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-8 rounded-full hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span
            onClick={() => setLogin(false)}
            className="text-muted-foreground hover:underline cursor-pointer"
          >
            Don&apos;t have an account?
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
