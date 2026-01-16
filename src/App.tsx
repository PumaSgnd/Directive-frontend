import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import LoginGuard from "./components/guards/LoginGuard";
import Dashboard from "./components/Dashboard";
import Discipline from './components/datamaster/discipline/Discipline';
import CreateDiscipline from "./components/datamaster/discipline/CreateDisciplineModal";
import EditDiscipline from './components/datamaster/discipline/EditDisciplineModal';
import BlankPage from "./pages/BlankPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<LoginGuard> <Dashboard /> </LoginGuard>}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/datamaster/discipline/discipline" element={<Discipline />} />
        <Route path="/datamaster/discipline/discipline/create-discipline" element={<CreateDiscipline />} />
        <Route path="/datamaster/discipline/discipline/edit/:id" element={<EditDiscipline />} />

        {/* menu sedang proses */}
        <Route path="/datamaster/pic" element={<BlankPage />} />
        <Route path="/datamaster/category-discipline" element={<BlankPage />} />
        <Route path="/datamaster/sub-category-discipline" element={<BlankPage />} />
        <Route path="/data-master/email-receive" element={<BlankPage />} />
        <Route path="/data-master/hotel" element={<BlankPage />} />
        <Route path="/data-master/signature" element={<BlankPage />} />
        <Route path="/competition" element={<BlankPage />} />
        <Route path="/accommodation" element={<BlankPage />} />
        <Route path="/directive" element={<BlankPage />} />
        <Route path="/registration" element={<BlankPage />} />
        <Route path="/apply-accommodation" element={<BlankPage />} />
        <Route path="/report" element={<BlankPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
