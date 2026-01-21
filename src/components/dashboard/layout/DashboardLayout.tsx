import "@/assets/scss/dashboard/volt.scss";

import { Outlet } from "react-router-dom";
import SideBar from "@/components/dashboard/navigation/SideBar";
import TopBar from "@/components/dashboard/topbar/TopBar";

export default function DashboardLayout() {
  return (
    <>
      <SideBar />
      <main className="content">
        <TopBar />
         <div className="content-main">
          <Outlet />
        </div>
        {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
      </main>
    </>
  )
}
