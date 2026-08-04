import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  MenuItem,
  IconButton,
  Tooltip
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";

import {
  // ⚠️ pastikan nama export ini SAMA dengan yang ada di
  // api/turnament/pertandingan/pertandingan.ts kamu.
  // Kalau di file kamu masih bernama getPertandinganById,
  // ganti nama import ini saja jadi getPertandinganById.
  fetchPertandinganById as getPertandinganById,
  updatePertandingan
} from "../../../api/turnament/pertandingan/pertandingan";

import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";

import { useJuriStore } from "../../../stores/JuriStore";
import { useJuri } from "../../../hooks/useJuri";
import { Pertandingan } from "../../../types/pertandingan";

type FormType = {
  pesertaA: number | "";
  pesertaB: number | "";
  juri1: number | "";
  juri2: number | "";
  juri3: number | "";
};

export default function EditPenyisihan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sidebarOpen, pageTitle, setPageTitle } = useStore();

  const drawerWidth = sidebarOpen ? 260 : 70;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [dialog, setDialog] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: ""
  });

  const [form, setForm] = useState<FormType>({
    pesertaA: "",
    pesertaB: "",
    juri1: "",
    juri2: "",
    juri3: ""
  });

  // Menyimpan data pertandingan asli (hasil fetch), supaya field
  // yang TIDAK ditampilkan di form ini (babak, durasi_menit, status,
  // winner_id, waktu_mulai, waktu_selesai, sisa_detik) tetap dikirim
  // apa adanya saat update. Ini WAJIB, karena backend
  // (pertandinganModel.updatePertandingan) meng-overwrite SEMUA
  // kolom itu tanpa peduli mana yang benar-benar berubah — kalau
  // tidak disertakan, nilainya akan jadi NULL di database.
  const [original, setOriginal] = useState<Pertandingan | null>(null);

  const { Peserta: pesertaList } = usePesertaStore();
  const { Juri: juriList } = useJuriStore();

  const { loadPeserta } = usePeserta();
  const { loadJuri } = useJuri();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // ================= FULLSCREEN =================
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ================= TITLE =================
  useEffect(() => {
    setPageTitle(t("edit") + " " + t("penyisihan"));
  }, [setPageTitle, t]);

  useEffect(() => {
    document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
  }, [pageTitle]);

  // ================= LOAD MASTER DATA =================
  useEffect(() => {
    loadPeserta();
    loadJuri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= LOAD DETAIL =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPertandinganById(Number(id));

        setOriginal(res);

        setForm({
          pesertaA: res.peserta1_id,
          pesertaB: res.peserta2_id ?? "",
          // Catatan: res.juri bisa berisi lebih dari 3 entri (lihat
          // catatan bug di createPertandingan backend), jadi index
          // 0/1/2 di sini tidak selalu representasi juri yang
          // sebenarnya dipilih. Fallback "" ditambahkan supaya
          // tidak crash kalau array lebih pendek dari 3.
          juri1: res.juri?.[0]?.id ?? "",
          juri2: res.juri?.[1]?.id ?? "",
          juri3: res.juri?.[2]?.id ?? ""
        });
      } catch (err) {
        console.error(err);
        setDialog({
          open: true,
          status: "error",
          message: t("userError")
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ================= HANDLER =================
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value === "" ? "" : Number(value)
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (form.pesertaA === "" || form.pesertaB === "") {
      setDialog({
        open: true,
        status: "error",
        message: t("peserta") + " harus dipilih"
      });
      return false;
    }

    if (form.pesertaA === form.pesertaB) {
      setDialog({
        open: true,
        status: "error",
        message: t("peserta") + " tidak boleh sama"
      });
      return false;
    }

    const juriIds = [form.juri1, form.juri2, form.juri3];

    if (juriIds.some(j => j === "")) {
      setDialog({
        open: true,
        status: "error",
        message: t("juri") + " harus dipilih"
      });
      return false;
    }

    const unique = new Set(juriIds);

    if (unique.size !== juriIds.length) {
      setDialog({
        open: true,
        status: "error",
        message: t("juri") + " tidak boleh sama"
      });
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validate()) return;

    if (!original) {
      setDialog({
        open: true,
        status: "error",
        message: t("userError")
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        // Field yang memang diubah di form ini.
        peserta1_id: Number(form.pesertaA),
        peserta2_id: Number(form.pesertaB),
        juri: [
          Number(form.juri1),
          Number(form.juri2),
          Number(form.juri3)
        ],

        // Field WAJIB disertakan apa adanya (tidak diubah di form
        // ini), supaya tidak ter-NULL-kan oleh backend. Lihat
        // catatan bug #1 di atas — hapus blok ini HANYA jika
        // backend sudah diperbaiki jadi partial-update.
        babak: original.babak,
        durasi_menit: original.durasi_menit,
        status: original.status,
        winner_id: original.winner_id,
        waktu_mulai: original.waktu_mulai,
        waktu_selesai: original.waktu_selesai,
        sisa_detik: original.sisa_detik
      };

      await updatePertandingan(Number(id), payload);

      setDialog({
        open: true,
        status: "success",
        message: t("success")
      });

      setTimeout(() => {
        navigate("/penyisihan");
      }, 1500);
    } catch (err) {
      console.error(err);
      setDialog({
        open: true,
        status: "error",
        message: t("userError")
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ================= LOADING =================
  if (loadingData) {
    return <Typography p={3}>Loading...</Typography>;
  }

  // ================= RENDER =================
  return (
    <Box display="flex">
      <Box sx={{ width: drawerWidth, position: "fixed" }}>
        <Sidebar />
      </Box>

      <Box ml={`${drawerWidth}px`} p={3} width="100%">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography fontSize={26}>{pageTitle}</Typography>

          <Box display="flex" gap={1}>
            <Tooltip title={t("fullscreen")}>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <UserMenu />
          </Box>
        </Box>

        <Divider />

        {/* FORM */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={3}>

              {/* PESERTA A */}
              <TextField
                select
                label="Peserta A"
                value={form.pesertaA}
                onChange={(e) => handleChange("pesertaA", e.target.value)}
              >
                <MenuItem value="">-- Select --</MenuItem>
                {pesertaList.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* PESERTA B */}
              <TextField
                select
                label="Peserta B"
                value={form.pesertaB}
                onChange={(e) => handleChange("pesertaB", e.target.value)}
              >
                <MenuItem value="">-- Select --</MenuItem>
                {pesertaList.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* JURI */}
              {[1, 2, 3].map((num) => (
                <TextField
                  key={num}
                  select
                  label={`Juri ${num}`}
                  value={form[`juri${num}` as keyof FormType]}
                  onChange={(e) =>
                    handleChange(`juri${num}`, e.target.value)
                  }
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {juriList.map(j => (
                    <MenuItem key={j.id} value={j.id}>
                      {j.name}
                    </MenuItem>
                  ))}
                </TextField>
              ))}

              {/* BUTTON */}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate("/penyisihan")}
                >
                  Back
                </Button>
              </Box>

            </Box>
          </CardContent>
        </Card>

        {/* DIALOG */}
        <Dialog open={dialog.open}>
          <DialogTitle>
            {dialog.status === "success" ? t("success") : t("error")}
          </DialogTitle>
          <DialogContent>
            <Typography>{dialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ open: false, status: "success", message: "" })}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}