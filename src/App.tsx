import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import LoginGuard from "./components/guards/LoginGuard";
import Dashboard from "./components/Dashboard";
import Peserta from './components/datamaster/peserta/Peserta';
import CreatePeserta from "./components/datamaster/peserta/CreatePesertaModal";
import EditPeserta from './components/datamaster/peserta/EditPesertaModal';
import BlankPage from "./pages/BlankPage";
import PIC from './components/datamaster/PIC/PIC';
import CreatePIC from "./components/datamaster/PIC/CreatePICModal";
import EditPIC from './components/datamaster/PIC/EditPICModal';
import Juri from './components/datamaster/Juri/Juri';
import CreateJuri from './components/datamaster/Juri/CreateJuriModal';
import EditJuri from './components/datamaster/Juri/EditJuriModal';
import UserManagement from './components/datamaster/usermanagement/UserManagement';
import CreateUser from './components/datamaster/usermanagement/CreateUserModal';
import EditUser from './components/datamaster/usermanagement/EditUserModal';
import HitungTurnamen from './components/hitungTurnamen/Controller';
import Penyisihan from './components/turnament/penyisihan/Penyisihan';
import CreatePenyisihan from './components/turnament/penyisihan/CreatePenyisihanModal';
import Quarter from './components/turnament/perempat/quarter';
import CreateQuarter from './components/turnament/perempat/CreateQuarterModal';
import Semi from './components/turnament/semi/Semi';
import CreateSemi from './components/turnament/semi/CreateSemiModal';
import Final from './components/turnament/final/Final';
import CreateFinal from './components/turnament/final/CreateFinalModal';
import EnambelasBesar from './components/turnament/enambelasbesar/enambelasBesar';
import CreateEnambelasBesar from './components/turnament/enambelasbesar/CreateEnambelasModal';
import ScoreDetail from './components/score/ScoreDetail';
import Scorepenyisihan from './components/score/Scorepenyisihan';
import Score16Besar from './components/score/Score16Besar';
import Scorefinal from './components/score/Scorefinal';
import Scoreperempat from './components/score/Scoreperempat';
import ScoresemiFinal from './components/score/ScoresemiFinal';
import Profile from './components/profile/profile';

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

        {/* Juri */}
        <Route path="/datamaster/usermanagement" element={<UserManagement />} />
        <Route path="/datamaster/usermanagement/create-user" element={<CreateUser />} />
        <Route path="/datamaster/usermanagement/edit/:id" element={<EditUser />} />

        {/* Juri */}
        <Route path="/datamaster/juri" element={<Juri />} />
        <Route path="/datamaster/juri/create-juri" element={<CreateJuri />} />
        <Route path="/datamaster/juri/edit/:id" element={<EditJuri />} />

        {/* Peserta */}
        <Route path="/datamaster/peserta" element={<Peserta />} />
        <Route path="/datamaster/peserta/create-peserta" element={<CreatePeserta />} />
        <Route path="/datamaster/peserta/edit/:id" element={<EditPeserta />} />

        {/* PIC */}
        <Route path="/datamaster/pic" element={<PIC />} />
        <Route path="/datamaster/pic/create-pic" element={<CreatePIC />} />
        <Route path="/datamaster/pic/edit/:id" element={<EditPIC />} />

        {/* pertandingan */}
        <Route path="/pertandingan/penyisihan" element={<Penyisihan />} />
        <Route path="/pertandingan/penyisihan/create-penyisihan" element={<CreatePenyisihan />} />
        <Route path="/pertandingan/perempat-final" element={<Quarter />} />
        <Route path="/pertandingan/perempat-final/create-perempat-final" element={<CreateQuarter />} />
        <Route path="/pertandingan/semi-final" element={<Semi />} />
        <Route path="/pertandingan/semi-final/create-semi-final" element={<CreateSemi />} />
        <Route path="/pertandingan/final" element={<Final />} />
        <Route path="/pertandingan/final/create-final" element={<CreateFinal />} />
        <Route path="/pertandingan/enambelasbesar" element={<EnambelasBesar />} />
        <Route path="/pertandingan/enambelasbesar/create-enambelasbesar" element={<CreateEnambelasBesar />} />

        {/* hitungTurnamen */}
        <Route path="/hitungTurnamen/controller" element={<HitungTurnamen />} />
        <Route path="/hitungTurnamen/controller/:id" element={<HitungTurnamen />} />

        {/* skor */}
        <Route path="/skor/penyisihan" element={<Scorepenyisihan />} />
        <Route path="/skor/enambelasBesar" element={<Score16Besar />} />
        <Route path="/skor/perempat-final" element={<Scoreperempat />} />
        <Route path="/skor/semi-final" element={<ScoresemiFinal />} />
        <Route path="/skor/final" element={<Scorefinal />} />
        <Route path="/skor/:id" element={<ScoreDetail />} />

        {/* profile */}
        <Route path="/profile" element={<Profile />} />

        {/* menu sedang proses */}
        <Route path="/datamaster/category-discipline" element={<BlankPage />} />
        <Route path="/datamaster/sub-category-discipline" element={<BlankPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
