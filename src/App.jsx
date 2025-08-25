import Signup from "./auth/Signup";
import Login from "./auth/Login";
import { Routes, Route } from "react-router-dom"
import Subscriptions from "./admin/Subscriptions"
import AdminDashboard from "./admin/AdminDashboard";
import AdminProfiles from "./admin/AdminProfiles";
import AdminUserProfile from "./admin/AdminUserProfile";
import AdminSuspendedUsers from "./admin/AdminSuspendedUser";
import AdminUsersVerificationRequest from "./admin/AdminUsersVerificationRequest";
import AdminContentModeration from "./admin/AdminContentModeration";
import AdminUsersReport from "./admin/AdminUsersReport";
import AdminCommunicationManagement from "./admin/AdminCommunicationManagement";

function App(){
  return(
    <>
      <Routes>
        {/* authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* admin pages */}
        <Route path="*" element={<AdminDashboard />} /> 
        <Route path="/admin/profiles" element={<AdminProfiles />} />
        <Route path="/admin/subscriptions" element={<Subscriptions />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/report/abuse" element={<AdminUsersReport />} />
        <Route path="/admin/profile/:userId" element={<AdminUserProfile />} />
        <Route path="/admin/suspended/users" element={<AdminSuspendedUsers />} />
        <Route path="/admin/content/moderation" element={<AdminContentModeration />} />
        <Route path="/admin/users/requests" element={<AdminUsersVerificationRequest />} />
        <Route path="/admin/communication-mgt" element={<AdminCommunicationManagement />} />        
      </Routes>
    </>
  )
}

export default App;