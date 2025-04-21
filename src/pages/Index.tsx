
import AlarmList from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";

const Index = () => {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-6">Alarms</h1>
        <AlarmList />
        <AddAlarmButton />
      </div>
    </div>
  );
};

export default Index;
