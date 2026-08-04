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

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";

import { createPertandingan } from "../../../api/turnament/pertandingan/pertandingan";
import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";

import { useJuriStore } from "../../../stores/JuriStore";
import { useJuri } from "../../../hooks/useJuri";

type FormType = {
  pesertaA: number | "";
  pesertaB: number | "";
  durasiMenit: number | "";
  juri1: number | "";
  juri2: number | "";
  juri3: number | "";
  pic: number | "";
};

export default function CreatePenyisihan() {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sidebarOpen, pageTitle, setPageTitle } = useStore();

  const drawerWidth = sidebarOpen ? 260 : 70;

  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: ""
  });

  const [form, setForm] = useState<FormType>({
    pesertaA: "",
    pesertaB: "",
    durasiMenit: "",
    juri1: "",
    juri2: "",
    juri3: "",
    pic: ""
  });

  const { Peserta: pesertaList } = usePesertaStore();
  const { Juri: juriList } = useJuriStore();

  const { loadPeserta } = usePeserta();
  const { loadJuri } = useJuri();
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    setPageTitle(t("create") + " " + t("penyisihan"));
  }, [setPageTitle, t]);

  useEffect(() => {
    document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
  }, [pageTitle]);

  // ================= LOAD DATA =================
  useEffect(() => {
    loadPeserta();
    loadJuri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= HANDLER =================
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value === "" ? "" : Number(value)
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {

    // semua field wajib harus terisi
    if (
      form.pesertaA === "" ||
      form.pesertaB === "" ||
      form.durasiMenit === "" ||
      form.juri1 === "" ||
      form.juri2 === "" ||
      form.juri3 === ""
    ) {
      setDialog({
        open: true,
        status: "error",
        message: t("requiredNote")
      });
      return false;
    }

    if (Number(form.durasiMenit) <= 0) {
      setDialog({
        open: true,
        status: "error",
        message: t("durasi") + " harus lebih dari 0"
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

    setLoading(true);

    try {

      const payload = {
        babak: "penyisihan", // 🔥 wajib ada
        durasi_menit: Number(form.durasiMenit),
        peserta1_id: Number(form.pesertaA),
        peserta2_id: Number(form.pesertaB),
        // Catatan: backend saat ini MENGABAIKAN array juri ini dan
        // otomatis meng-assign semua user berrole "juri". Dikirim
        // tetap untuk jaga-jaga jika backend nanti diupdate.
        juri: [
          Number(form.juri1),
          Number(form.juri2),
          Number(form.juri3),
        ],
      };

      await createPertandingan(payload);

      setDialog({
        open: true,
        status: "success",
        message: t("success")
      });

      setTimeout(() => {
        navigate("/pertandingan/penyisihan");
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

  // ================= RENDER =================
  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
        <Sidebar />
      </Box>
      <Box
        flexGrow={1}
        ml={`${drawerWidth}px`}
        padding={3}
        fontFamily="Roboto, sans-serif"
        bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h2" fontWeight={600} fontSize={26}>
            {pageTitle}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={t("fullscreen")}>
              <IconButton size="medium" aria-label="Toggle fullscreen view" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <FullscreenExitIcon fontSize="medium" />
                ) : (
                  <FullscreenIcon fontSize="medium" />
                )}
              </IconButton>
            </Tooltip>
            <UserMenu />
          </Box>
        </Box>
        <Divider />

        {/* FORM */}
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent>

            <Box display="flex" flexDirection="column" gap={2} mt={2} ml={4} mr={4}>
              <Typography variant="body2" color="error" mb={2}>
                {t("requiredNote")}
              </Typography>

              {/* DURASI (menit) */}
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {t("durasi") + " (menit)"}
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 17.7 }}>
                  *
                </Typography>
                <TextField
                  type="number"
                  value={form.durasiMenit}
                  onChange={(e) => handleChange("durasiMenit", e.target.value)}
                  fullWidth
                  inputProps={{ min: 2 }}
                />
              </Box>

              {/* PESERTA A */}
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {t("peserta") + " 1"}
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 17.7 }}>
                  *
                </Typography>
                <TextField
                  select
                  value={form.pesertaA}
                  onChange={(e) => handleChange("pesertaA", e.target.value)}
                  fullWidth
                >
                  {pesertaList.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {/* PESERTA B */}
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {t("peserta") + " 2"}
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 17.7 }}>
                  *
                </Typography>
                <TextField
                  select
                  value={form.pesertaB}
                  onChange={(e) => handleChange("pesertaB", e.target.value)}
                  fullWidth
                >
                  {pesertaList.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {/* JURI */}
              {[1, 2, 3].map((num) => (
                <Box key={num} display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {`${t("juri")} ${num}`}
                  </Typography>
                  <Typography variant="body1" color="error" sx={{ mr: 17.7 }}>
                    *
                  </Typography>
                  <TextField
                    select
                    value={form[`juri${num}` as keyof FormType]}
                    onChange={(e) =>
                      handleChange(`juri${num}`, e.target.value)
                    }
                    fullWidth
                  >
                    {juriList.map(j => (
                      <MenuItem key={j.id} value={j.id}>
                        {j.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              ))}


              {/* PIC
                <TextField
                  select
                  label="PIC"
                  value={form.pic}
                  onChange={(e) => handleChange("pic", e.target.value)}
                  fullWidth
                >
                  {picList.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField> */}

              {/* BUTTON */}
              <Box display="flex" justifyContent="flex-end" gap={2}>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? t("submitting") : t("submit")}
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate("/pertandingan/penyisihan")}
                >
                  {t("back")}
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