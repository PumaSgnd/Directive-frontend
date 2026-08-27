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
          turnamentTitle: "PENCAK SILAT TOURNAMENT",
          toggleFullscreen: "Toggle fullscreen view",
          edit: "Edit",

          // DASHBOARD
          totalAllParticipants: "Total All Participants",
          totalParticipantsQualification: "Total Participants in Qualification Round",
          totalParticipantsRound16: "Total Participants in Round of 16",
          totalParticipantsQuarterFinal: "Total Participants in Quarter Final",
          totalParticipantsSemiFinal: "Total Participants in Semi Final",
          totalParticipantsFinal: "Total Participants in Final",
          listCompetition: "List Competition",
          listMatches: "List Matches",
          totalMatches: "Total Matches",
          allRounds: "All Rounds",
          ongoingMatches: "Ongoing Matches",
          currently: "Currently",
          finishedMatches: "Finished Matches",

          loadMatchError: "Failed to load matches.",
          getMatchError: "Failed to retrieve match data.",

          // VALIDATION
          fullNameRequired: "Full Name is required.",
          usernameRequired: "Username is required.",
          emailRequired: "Email is required.",
          passwordRequired: "Password is required.",
          roleRequired: "Role is required.",

          // PESERTA VALIDATION
          pesertaTitle: "Input Participant Data",
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
          pause: "Paused",
          selesai: "Finished",
          durasi: "Duration",
          peserta1: "Participant 1",
          peserta2: "Participant 2",
          round: "Round",
          round1: "Round 1",
          round2: "Round 2",
          round3: "Round 3",
          mainJudge: "Main Judges",
          reserveJudge: "Reserve Judges",
          bye: "BYE",
          semua: "All",
          of: "of",

          // USER MENU
          logout: "Logout",
          confirmLogout: "Confirm Logout",
          confirmQuestion: "Are you sure you want to logout?",
          cancel: "Cancel",
          account: "Account",

          // SCORE
          tournamentTitle: "PENCAK SILAT TOURNAMENT",
          scoreboardTitle: "SCORE BOARD",
          noMatchesFound: "No Matches Yet",
          exitFullscreen: "Exit Fullscreen",
          scorePerJudge: "Score Per Judge",
          noJudgeAssigned: "No judges assigned.",

          // CONTROLLER
          noMatchSelected: "No match selected yet",
          goToMatchDataDescription:
            "Open the Match Data page, then select a match to start scoring.",
          goToMatchData: "Go to Match Data",

          matchNotStarted:
            "The match has not started yet. Press Play to start.",
          matchPaused: "The match is paused.",
          matchFinished:
            "The match is finished. Score input is disabled.",

          roundLabel: "Round",
          roundFinished: "Finish Round",
          finishMatch: "Finish Match",
          finished: "Finished",

          judgeReplacement: "Judge Replacement",
          replace: "Replace",
          replaceJudge: "Replace Judge",
          noActiveMainJudge: "No active main judges.",
          noActiveReserveJudge: "No active reserve judges.",

          undoLastScore: "Undo the last score input from this judge",

          roundNotFinished: "Failed to finish the round.",
          judgeReplacementError: "Failed to replace judge.",
          startMatchError: "Failed to start the match.",
          pauseMatchError: "Failed to pause the match.",
          resumeMatchError: "Failed to resume the match.",
          finishMatchError: "Failed to finish the match.",

          roundStatus: "Round",

          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "User Management",
          pic: "PIC",
          peserta: "Participants",
          juri: "Judges",

          turnamen: "Tournament",
          penyisihan: "Qualification Round",
          enambelasBesar: "Round of 16",
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
          turnamentTitle: "Turnament Pencak Silat",
          toggleFullscreen: "Aktifkan tampilan layar penuh",
          edit: "Edit",

          // DASHBOARD
          totalAllParticipants: "Total Semua Peserta",
          totalParticipantsQualification: "Total Peserta Babak Penyisihan",
          totalParticipantsRound16: "Total Peserta Babak 16 Besar",
          totalParticipantsQuarterFinal: "Total Peserta Babak Perempat Final",
          totalParticipantsSemiFinal: "Total Peserta Babak Semi Final",
          totalParticipantsFinal: "Total Peserta Babak Final",
          listCompetition: "Daftar Kompetisi",
          listMatches: "Daftar Pertandingan",

          totalMatches: "Total Pertandingan",
          allRounds: "Semua Babak",
          ongoingMatches: "Pertandingan Berlangsung",
          currently: "Saat Ini",
          finishedMatches: "Pertandingan Selesai",

          loadMatchError: "Gagal memuat pertandingan.",
          getMatchError: "Gagal mengambil data pertandingan.",

          // VALIDATION
          fullNameRequired: "Nama wajib diisi.",
          usernameRequired: "Username wajib diisi.",
          emailRequired: "Email wajib diisi.",
          passwordRequired: "Password wajib diisi.",
          roleRequired: "Role wajib diisi.",

          // PESERTA VALIDATION
          pesertaTitle: "Masukkan Data Peserta",
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
          pause: "Dijeda",
          selesai: "Selesai",
          durasi: "Durasi",
          peserta1: "Peserta 1",
          peserta2: "Peserta 2",
          round: "Ronde",
          round1: "Ronde 1",
          round2: "Ronde 2",
          round3: "Ronde 3",
          mainJudge: "Juri Utama",
          reserveJudge: "Juri Cadangan",
          bye: "BYE",
          semua: "Semua",
          of: "dari",

          // USER MENU
          logout: "Keluar",
          confirmLogout: "Konfirmasi Keluar",
          confirmQuestion: "Apakah kamu yakin ingin keluar?",
          cancel: "Batal",
          account: "Akun",

          // SCORE
          tournamentTitle: "Turnament Pencak Silat",
          scoreboardTitle: "SCORE BOARD",
          noMatchesFound: "Belum ada pertandingan",
          exitFullscreen: "Keluar Layar Penuh",
          scorePerJudge: "Perolehan Skor Juri",
          noJudgeAssigned: "Belum ada juri yang ditunjuk.",

          // CONTROLLER
          noMatchSelected: "Belum ada pertandingan yang dipilih",
          goToMatchDataDescription:
            "Buka halaman Data Pertandingan, lalu pilih salah satu pertandingan untuk mulai menghitung skor.",
          goToMatchData: "Ke Data Pertandingan",

          matchNotStarted:
            "Pertandingan belum dimulai. Tekan tombol Play untuk memulai.",
          matchPaused: "Pertandingan sedang di-pause.",
          matchFinished:
            "Pertandingan sudah selesai. Input skor dinonaktifkan.",

          roundLabel: "Ronde",
          roundFinished: "Selesaikan Ronde",
          finishMatch: "Selesaikan Pertandingan",
          finished: "Selesai",

          judgeReplacement: "Pergantian Juri",
          replace: "Ganti",
          replaceJudge: "Ganti Juri",
          noActiveMainJudge: "Tidak ada juri utama aktif.",
          noActiveReserveJudge: "Tidak ada juri cadangan aktif.",

          undoLastScore: "Undo input terakhir milik juri ini",

          roundNotFinished: "Gagal menyelesaikan ronde.",
          judgeReplacementError: "Gagal melakukan pergantian juri.",
          startMatchError: "Gagal memulai pertandingan.",
          pauseMatchError: "Gagal melakukan pause.",
          resumeMatchError: "Gagal melanjutkan pertandingan.",
          finishMatchError: "Gagal menyelesaikan pertandingan.",

          roundStatus: "Ronde",
          
          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "Manajemen User",
          pic: "PIC",
          peserta: "Peserta",
          juri: "Juri",

          turnamen: "Turnamen",
          penyisihan: "Babak Penyisihan",
          enambelasBesar: "Babak 16 Besar",
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