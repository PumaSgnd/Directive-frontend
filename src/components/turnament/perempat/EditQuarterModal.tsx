// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   MenuItem,
//   IconButton,
//   Tooltip
// } from "@mui/material";
// import FullscreenIcon from "@mui/icons-material/Fullscreen";
// import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// import { useNavigate, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import Sidebar from "../../bar/Sidebar";
// import UserMenu from "../../header/UserMenu";
// import { useStore } from "../../../hooks/useStore";

// import {
//   getPertandinganById,
//   updatePertandingan
// } from "../../../api/turnament/pertandingan/pertandingan";

// import { usePesertaStore } from "../../../stores/PesertaStore";
// import { usePeserta } from "../../../hooks/usePeserta";

// import { useJuriStore } from "../../../stores/JuriStore";
// import { useJuri } from "../../../hooks/useJuri";

// type FormType = {
//   pesertaA: number | "";
//   pesertaB: number | "";
//   juri1: number | "";
//   juri2: number | "";
//   juri3: number | "";
// };

// export default function EditPenyisihan() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { sidebarOpen, pageTitle, setPageTitle } = useStore();

//   const drawerWidth = sidebarOpen ? 260 : 70;

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(true);

//   const [dialog, setDialog] = useState({
//     open: false,
//     message: ""
//   });

//   const [form, setForm] = useState<FormType>({
//     pesertaA: "",
//     pesertaB: "",
//     juri1: "",
//     juri2: "",
//     juri3: ""
//   });

//   const { Peserta: pesertaList } = usePesertaStore();
//   const { Juri: juriList } = useJuriStore();

//   const { loadPeserta } = usePeserta();
//   const { loadJuri } = useJuri();

//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // ================= FULLSCREEN =================
//   useEffect(() => {
//     const handleChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener("fullscreenchange", handleChange);
//     return () =>
//       document.removeEventListener("fullscreenchange", handleChange);
//   }, []);

//   // ================= TITLE =================
//   useEffect(() => {
//     setPageTitle(t("edit") + " " + t("penyisihan"));
//   }, [setPageTitle, t]);

//   useEffect(() => {
//     document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
//   }, [pageTitle]);

//   // ================= LOAD MASTER DATA =================
//   useEffect(() => {
//     loadPeserta();
//     loadJuri();
//   }, []);

//   // ================= LOAD DETAIL =================
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getPertandinganById(Number(id));

//         setForm({
//           pesertaA: res.peserta1_id,
//           pesertaB: res.peserta2_id,
//           juri1: res.juri[0],
//           juri2: res.juri[1],
//           juri3: res.juri[2]
//         });
//       } catch (err) {
//         console.error(err);
//         setDialog({
//           open: true,
//           message: "Gagal load data"
//         });
//       } finally {
//         setLoadingData(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   // ================= HANDLER =================
//   const handleChange = (field: string, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: value === "" ? "" : Number(value)
//     }));
//   };

//   // ================= VALIDATION =================
//   const validate = () => {
//     if (!form.pesertaA || !form.pesertaB) {
//       setDialog({
//         open: true,
//         message: "Peserta harus dipilih"
//       });
//       return false;
//     }

//     if (form.pesertaA === form.pesertaB) {
//       setDialog({
//         open: true,
//         message: "Peserta tidak boleh sama"
//       });
//       return false;
//     }

//     const juriIds = [form.juri1, form.juri2, form.juri3];
//     const unique = new Set(juriIds);

//     if (unique.size !== juriIds.length) {
//       setDialog({
//         open: true,
//         message: "Juri tidak boleh sama"
//       });
//       return false;
//     }

//     return true;
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);

//     try {
//       const payload = {
//         peserta1_id: Number(form.pesertaA),
//         peserta2_id: Number(form.pesertaB),
//         juri: [
//           Number(form.juri1),
//           Number(form.juri2),
//           Number(form.juri3)
//         ]
//       };

//       await updatePertandingan(Number(id), payload);

//       setDialog({
//         open: true,
//         message: t("success")
//       });

//       setTimeout(() => {
//         navigate("/penyisihan");
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setDialog({
//         open: true,
//         message: t("userError")
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   // ================= LOADING =================
//   if (loadingData) {
//     return <Typography p={3}>Loading...</Typography>;
//   }

//   // ================= RENDER =================
//   return (
//     <Box display="flex">
//       <Box sx={{ width: drawerWidth, position: "fixed" }}>
//         <Sidebar />
//       </Box>

//       <Box ml={`${drawerWidth}px`} p={3} width="100%">
//         {/* HEADER */}
//         <Box display="flex" justifyContent="space-between" mb={3}>
//           <Typography fontSize={26}>{pageTitle}</Typography>

//           <Box display="flex" gap={1}>
//             <Tooltip title={t("fullscreen")}>
//               <IconButton onClick={toggleFullscreen}>
//                 {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
//               </IconButton>
//             </Tooltip>
//             <UserMenu />
//           </Box>
//         </Box>

//         <Divider />

//         {/* FORM */}
//         <Card sx={{ mt: 3 }}>
//           <CardContent>
//             <Box display="flex" flexDirection="column" gap={3}>

//               {/* PESERTA A */}
//               <TextField
//                 select
//                 label="Peserta A"
//                 value={form.pesertaA}
//                 onChange={(e) => handleChange("pesertaA", e.target.value)}
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {pesertaList.map(p => (
//                   <MenuItem key={p.id} value={p.id}>
//                     {p.name}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               {/* PESERTA B */}
//               <TextField
//                 select
//                 label="Peserta B"
//                 value={form.pesertaB}
//                 onChange={(e) => handleChange("pesertaB", e.target.value)}
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {pesertaList.map(p => (
//                   <MenuItem key={p.id} value={p.id}>
//                     {p.name}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               {/* JURI */}
//               {[1, 2, 3].map((num) => (
//                 <TextField
//                   key={num}
//                   select
//                   label={`Juri ${num}`}
//                   value={form[`juri${num}` as keyof FormType]}
//                   onChange={(e) =>
//                     handleChange(`juri${num}`, e.target.value)
//                   }
//                 >
//                   <MenuItem value="">-- Select --</MenuItem>
//                   {juriList.map(j => (
//                     <MenuItem key={j.id} value={j.id}>
//                       {j.name}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               ))}

//               {/* BUTTON */}
//               <Box display="flex" justifyContent="flex-end" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? "Updating..." : "Update"}
//                 </Button>

//                 <Button
//                   variant="contained"
//                   color="warning"
//                   onClick={() => navigate("/penyisihan")}
//                 >
//                   Back
//                 </Button>
//               </Box>

//             </Box>
//           </CardContent>
//         </Card>

//         {/* DIALOG */}
//         <Dialog open={dialog.open}>
//           <DialogTitle>Info</DialogTitle>
//           <DialogContent>
//             <Typography>{dialog.message}</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDialog({ open: false, message: "" })}>
//               OK
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// }