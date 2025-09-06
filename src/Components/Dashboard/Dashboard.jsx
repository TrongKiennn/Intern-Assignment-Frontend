import { ChartInteractive } from "./Chart";
import DashboardContacts from "./Contact/DashboardContacts";


export default function Dashboard() {
  return (
    <div className="min-h-screen w-full  p-4 sm:p-6 space-y-6">
      {/* Chart */}
      <div>
        <ChartInteractive />
      </div>

      {/* Contacts */}
      <div>
        <DashboardContacts />
      </div>
    </div>
  );
}
