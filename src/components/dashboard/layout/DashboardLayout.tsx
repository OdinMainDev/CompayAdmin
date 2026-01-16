import "@/assets/scss/dashboard/volt.scss";

import { Outlet } from "react-router-dom";
import SideBar from "../navigation/SideBar";
import TopBar from "../navigation/TopBar";

export default function DashboardLayout() {
  return (
    <>
      <SideBar />
      <main className="content">
        <TopBar />
        <Outlet />
        {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
      </main>
      <Outlet />
    </>
  )
}
