
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  user: any;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="flex items-center mb-6">
      <h1 className="text-4xl font-bold flex items-center gap-2 flex-1 justify-center">
        <Bell className="h-8 w-8" /> Alarms
      </h1>
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          onClick={user ? handleLogout : handleLogin}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
