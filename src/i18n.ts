import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false
    },

    resources: {
      en: {
        translation: {
          // GENERAL
          search: "Search...",
          filter: "Filter",
          name: "Name",
          regional: "Regional",
          actions: "Actions",
          create: "Create",
          rows: "Rows",
          weight: "Weight",
          username: "Username",
          email: "Email",
          role: "Role",
          createUser: "Create User",
          createPIC: "Create PIC",
          createJuri: "Create Juri",
          createPeserta: "Create Peserta",
          fullName: "Name",
          password: "Password",
          submit: "Submit",
          submitting: "Submitting...",
          back: "Back",
          requiredNote: "Note: (*) Required fields",
          success: "Success",
          userCreated: "User created successfully.",
          picCreated: "PIC created successfully.",
          juriCreated: "Juri created successfully.",
          userError: "Error creating User.",
          picError: "Error creating PIC.",
          juriError: "Error creating Juri.",
          fullscreen: "Fullscreen",
          editUser: "Edit User",
          editPIC: "Edit PIC",
          editJuri: "Edit Juri",
          userUpdated: "User updated successfully!",
          picUpdated: "PIC updated successfully!",
          juriUpdated: "Juri berhasil diperbarui!",
          save: "Save",
          loading: "Loading...",

          // VALIDATION
          fullNameRequired: "Full Name is required.",
          usernameRequired: "Username is required.",
          emailRequired: "Email is required.",
          passwordRequired: "Password is required.",
          roleRequired: "Role is required.",

          // PESERTA VALIDATION
          pesertaRequired: "Participant name is required.",
          regionalRequired: "Regional is required.",
          weightRequired: "Weight is required.",
          weightMustBeNumber: "Weight must be a valid number.",
          weightPlaceholder: "Example: 60.70",
          pesertaCreated: "Participant created successfully.",
          pesertaError: "Error creating participant.",
          editPeserta: "Edit Participant",
          pesertaUpdated: "Participant updated successfully.",
          pesertaUpdateError: "Error updating participant.",

          // PERTANDINGAN
          match: "Match",
          status: "Status",
          no: "No",
          vs: "VS",
          belum_mulai: "Not Started",
          berlangsung: "Ongoing",
          selesai: "Finished",
          durasi: "Duration",

          // USER MENU
          logout: "Logout",
          confirmLogout: "Confirm Logout",
          confirmQuestion: "Are you sure you want to logout?",
          cancel: "Cancel",
          account: "Account",

          // SCORE
          tournamentTitle: "PENCAK SILAT TOURNAMENT",
          scoreboardTitle: "SCORE BOARD",
          exitFullscreen: "Exit Fullscreen",
          scorePerJudge: "Score Per Judge",
          noJudgeAssigned: "No judges assigned.",
          pause: "Paused",

          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "User Management",
          pic: "PIC",
          peserta: "Participants",
          juri: "Judges",

          turnamen: "Tournament",
          penyisihan: "Qualification",
          perempat: "Quarter Final",
          semiFinal: "Semi Final",
          final: "Final",

          hitungTurnamen: "Tournament Calculation",
          controller: "Controller",
          skor: "Score",
          history: "History"
        }
      },

      id: {
        translation: {
          // GENERAL
          search: "Cari...",
          filter: "Filter",
          name: "Nama",
          regional: "Wilayah",
          actions: "Aksi",
          create: "Tambah",
          rows: "Baris",
          weight: "Berat Badan",
          username: "Nama Pengguna",
          email: "Email",
          role: "Peran",
          createUser: "Tambah User",
          createPIC: "Tambah PIC",
          createJuri: "Tambah Juri",
          createPeserta: "Tambah Peserta",
          fullName: "Nama",
          password: "Kata Sandi",
          submit: "Simpan",
          submitting: "Menyimpan...",
          back: "Kembali",
          requiredNote: "Catatan: (*) Wajib diisi",
          success: "Berhasil",
          userCreated: "User berhasil dibuat.",
          picCreated: "PIC berhasil dibuat.",
          juriCreated: "Juri berhasil dibuat.",
          userError: "Gagal membuat User.",
          picError: "Gagal membuat PIC.",
          juriError: "Gagal membuat Juri.",
          fullscreen: "Layar Penuh",
          editUser: "Edit User",
          editPIC: "Edit PIC",
          editJuri: "Edit Juri",
          userUpdated: "User berhasil diperbarui!",
          picUpdated: "PIC berhasil diperbarui!",
          juriUpdated: "Juri berhasil diperbarui!",
          save: "Simpan",
          loading: "Memuat...",

          // VALIDATION
          fullNameRequired: "Nama wajib diisi.",
          usernameRequired: "Username wajib diisi.",
          emailRequired: "Email wajib diisi.",
          passwordRequired: "Password wajib diisi.",
          roleRequired: "Role wajib diisi.",

          // PESERTA VALIDATION
          pesertaRequired: "Nama peserta wajib diisi.",
          regionalRequired: "Wilayah wajib diisi.",
          weightRequired: "Berat badan wajib diisi.",
          weightMustBeNumber: "Berat badan harus berupa angka.",
          weightPlaceholder: "Contoh: 60.70",
          pesertaCreated: "Peserta berhasil dibuat.",
          pesertaError: "Gagal membuat peserta.",
          editPeserta: "Edit Peserta",
          pesertaUpdated: "Peserta berhasil diperbarui!",
          pesertaUpdateError: "Peserta gagal diperbarui!",

          // PERTANDINGAN
          match: "Pertandingan",
          status: "Status",
          no: "No",
          vs: "VS",
          belum_mulai: "Belum Mulai",
          berlangsung: "Berlangsung",
          selesai: "Selesai",
          durasi: "Durasi",

          // USER MENU
          logout: "Keluar",
          confirmLogout: "Konfirmasi Keluar",
          confirmQuestion: "Apakah kamu yakin ingin keluar?",
          cancel: "Batal",
          account: "Akun",

          // SCORE
          tournamentTitle: "TURNAMEN PENCAK SILAT",
          scoreboardTitle: "SCORE BOARD",
          exitFullscreen: "Keluar Layar Penuh",
          scorePerJudge: "Perolehan Skor Juri",
          noJudgeAssigned: "Belum ada juri yang ditunjuk.",

          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "Manajemen User",
          pic: "PIC",
          peserta: "Peserta",
          juri: "Juri",

          turnamen: "Turnamen",
          penyisihan: "Babak Penyisihan",
          perempat: "Perempat Final",
          semiFinal: "Semi Final",
          final: "Final",

          hitungTurnamen: "Hitung Turnamen",
          controller: "Controller",
          skor: "Skor",
          history: "Riwayat"
        }
      }
    }
  });

export default i18n;