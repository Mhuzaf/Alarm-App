
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";
import AlarmList from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import { Header } from "@/components/Header";
import { AuthNotice } from "@/components/AuthNotice";
import { useAlarms } from "@/hooks/useAlarms";

const Index = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { 
    alarms,
    handleAddAlarm,
    handleToggleAlarm,
    handleDeleteAlarm,
    handleEditAlarm
  } = useAlarms(user);

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto">
        <Header user={user} />

        <AlarmList 
          alarms={alarms}
          onToggleAlarm={handleToggleAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onEditAlarm={handleEditAlarm}
        />
        <AddAlarmButton onAddAlarm={handleAddAlarm} />

        {!user && <AuthNotice onLogin={() => navigate('/auth')} />}
      </div>
    </div>
  );
};

export default Index;
