
import { Button } from "@/components/ui/button";

interface AuthNoticeProps {
  onLogin: () => void;
}

export const AuthNotice = ({ onLogin }: AuthNoticeProps) => {
  return (
    <div className="mt-8 p-4 border border-dashed rounded-md text-center text-muted-foreground">
      <p>You're not logged in. Your alarms will be saved locally but will be lost if you clear your browser data.</p>
      <Button 
        variant="link" 
        onClick={onLogin}
        className="mt-2"
      >
        Log in to save your alarms
      </Button>
    </div>
  );
};
