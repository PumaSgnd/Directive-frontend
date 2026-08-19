import { useEffect, useRef, useState } from "react";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    AccountCircle,
    Badge,
    Close,
    Email,
    Edit,
    Fullscreen,
    FullscreenExit,
    Person,
    PhotoCamera,
    Save,
} from "@mui/icons-material";

import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";

import { useStore } from "../../hooks/useStore";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "react-i18next";


const BACKEND_URL = "http://localhost:5000";


const getPhotoUrl = (
    photo: string | null
) => {
    if (!photo) {
        return undefined;
    }

    return `${BACKEND_URL}/uploads/userphoto/${photo}`;
};


const capitalizeWords = (
    value: string
) => {
    return value.replace(
        /\b\w/g,
        (char) => char.toUpperCase()
    );
};


const Profile = () => {
    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
    } = useStore();

    const {
        profile,
        loading,
        updating,
        error,
        loadProfile,
        saveProfile,
    } = useProfile();

    const { t } = useTranslation();


    const drawerWidth =
        sidebarOpen ? 260 : 70;


    const [
        isFullscreen,
        setIsFullscreen
    ] = useState(false);


    const [
        isEditing,
        setIsEditing
    ] = useState(false);


    const [
        fullName,
        setFullName
    ] = useState("");


    const [
        username,
        setUsername
    ] = useState("");


    const [
        email,
        setEmail
    ] = useState("");


    const [
        photoFile,
        setPhotoFile
    ] = useState<File | null>(null);


    const [
        photoPreview,
        setPhotoPreview
    ] = useState<string | null>(null);


    const [
        formError,
        setFormError
    ] = useState("");


    const fileInputRef =
        useRef<HTMLInputElement | null>(null);


    /*
     * LOAD PROFILE
     */
    useEffect(() => {

        loadProfile().catch(() => {});

        setPageTitle(
            t("profile")
        );

    }, [t]);


    /*
     * DOCUMENT TITLE
     */
    useEffect(() => {

        document.title =
            `Turnament Pencak Silat${
                pageTitle
                    ? " | " + pageTitle
                    : ""
            }`;

    }, [pageTitle]);


    /*
     * ISI FORM DARI PROFILE
     */
    useEffect(() => {

        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            )
            || null
        );

    }, [profile]);


    /*
     * FULLSCREEN
     */
    const toggleFullscreen = () => {

        if (!document.fullscreenElement) {

            document.documentElement
                .requestFullscreen();

            setIsFullscreen(true);

        } else {

            if (document.exitFullscreen) {

                document.exitFullscreen();

                setIsFullscreen(false);

            }

        }

    };


    /*
     * DETECT FULLSCREEN CHANGE
     */
    useEffect(() => {

        const handleChange = () => {

            setIsFullscreen(
                !!document.fullscreenElement
            );

        };

        document.addEventListener(
            "fullscreenchange",
            handleChange
        );

        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleChange
            );

        };

    }, []);


    /*
     * EDIT PROFILE
     */
    const handleEdit = () => {

        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoFile(null);

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            ) || null
        );

        setFormError("");

        setIsEditing(true);

    };


    /*
     * CANCEL
     */
    const handleCancel = () => {

        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoFile(null);

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            ) || null
        );

        setFormError("");

        setIsEditing(false);

    };


    /*
     * PILIH FOTO
     */
    const handlePhotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/png",
            "image/jpeg",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setFormError(
                "Foto harus berformat PNG, JPG, atau JPEG."
            );

            return;

        }


        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            setFormError(
                "Ukuran foto maksimal 5 MB."
            );

            return;

        }


        setFormError("");

        setPhotoFile(file);


        const previewUrl =
            URL.createObjectURL(file);

        setPhotoPreview(
            previewUrl
        );

    };


    /*
     * SIMPAN PROFILE
     */
    const handleSave = async () => {

        setFormError("");


        if (!fullName.trim()) {

            setFormError(
                "Nama lengkap wajib diisi."
            );

            return;

        }


        if (!username.trim()) {

            setFormError(
                "Username wajib diisi."
            );

            return;

        }


        if (!email.trim()) {

            setFormError(
                "Email wajib diisi."
            );

            return;

        }


        try {

            await saveProfile({

                full_name:
                    fullName.trim(),

                username:
                    username.trim(),

                email:
                    email.trim(),

                photo:
                    photoFile,

            });


            setIsEditing(false);

            setPhotoFile(null);

        } catch (error: any) {

            console.error(error);

            setFormError(
                error?.response?.data?.message ||
                "Gagal memperbarui profile."
            );

        }

    };


    /*
     * LOADING
     */
    if (
        loading &&
        !profile
    ) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );

    }


    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                minHeight: "100vh",
                width: "100vw",
                overflowX: "hidden",
            }}
        >

            {/* SIDEBAR */}

            <Box
                sx={{
                    width: drawerWidth,
                    transition:
                        "width 0.3s",
                    position: "fixed",
                    height: "100vh",
                }}
            >

                <Sidebar />

            </Box>


            {/* MAIN CONTENT */}

            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                padding={3}
                fontFamily="Roboto, sans-serif"
                sx={{
                    transition:
                        "margin-left 0.3s",
                }}
            >

                {/* HEADER */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {pageTitle}
                    </Typography>


                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >

                        <Tooltip
                            title={t("fullscreen")}
                        >

                            <IconButton
                                size="medium"
                                aria-label="Toggle fullscreen view"
                                onClick={
                                    toggleFullscreen
                                }
                            >

                                {isFullscreen ? (

                                    <FullscreenExit
                                        fontSize="medium"
                                    />

                                ) : (

                                    <Fullscreen
                                        fontSize="medium"
                                    />

                                )}

                            </IconButton>

                        </Tooltip>


                        <UserMenu />

                    </Box>

                </Box>


                <Divider />


                {/* PROFILE CONTENT */}

                <Box
                    sx={{
                        mt: 10,
                        maxWidth: 1500,
                        mx: "auto",
                    }}
                >

                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid",
                            borderColor:
                                "divider",
                            borderRadius: 3,
                        }}
                    >

                        <CardContent
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                },
                            }}
                        >

                            {/* PROFILE HEADER */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                alignItems={{
                                    xs: "center",
                                    sm: "flex-start",
                                }}
                                spacing={3}
                            >

                                {/* FOTO */}

                                <Box
                                    sx={{
                                        position:
                                            "relative",
                                    }}
                                >

                                    <Avatar
                                        src={
                                            photoPreview ||
                                            getPhotoUrl(
                                                profile?.photo ||
                                                null
                                            )
                                        }
                                        alt={
                                            profile?.full_name ||
                                            "Profile"
                                        }
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            fontSize: 48,
                                        }}
                                    >

                                        {!photoPreview &&
                                            !profile?.photo && (
                                                <Person
                                                    sx={{
                                                        fontSize: 64,
                                                    }}
                                                />
                                            )}

                                    </Avatar>


                                    {isEditing && (

                                        <>
                                            <IconButton
                                                onClick={() =>
                                                    fileInputRef
                                                        .current
                                                        ?.click()
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    right: -5,
                                                    bottom: -5,
                                                    backgroundColor:
                                                        "primary.main",
                                                    color:
                                                        "white",

                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "primary.dark",
                                                        },
                                                }}
                                            >

                                                <PhotoCamera />

                                            </IconButton>


                                            <input
                                                ref={
                                                    fileInputRef
                                                }
                                                type="file"
                                                hidden
                                                accept=".png,.jpg,.jpeg"
                                                onChange={
                                                    handlePhotoChange
                                                }
                                            />

                                        </>

                                    )}

                                </Box>


                                {/* NAMA + ROLE */}

                                <Box
                                    flex={1}
                                    textAlign={{
                                        xs: "center",
                                        sm: "left",
                                    }}
                                >

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {
                                            profile?.full_name ||
                                            "Unknown User"
                                        }
                                    </Typography>


                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        @
                                        {
                                            profile?.username ||
                                            "username"
                                        }
                                    </Typography>


                                    <Box
                                        sx={{
                                            display:
                                                "inline-flex",
                                            alignItems:
                                                "center",
                                            gap: 0.7,
                                            mt: 1.5,
                                            px: 1.5,
                                            py: 0.6,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "action.hover",
                                        }}
                                    >

                                        <Badge
                                            fontSize="small"
                                            color="action"
                                        />

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {capitalizeWords(
                                                profile?.role ||
                                                "unknown"
                                            )}
                                        </Typography>

                                    </Box>

                                </Box>


                                {/* EDIT BUTTON */}

                                {!isEditing && (

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <Edit />
                                        }
                                        onClick={
                                            handleEdit
                                        }
                                    >
                                        Edit Profile
                                    </Button>

                                )}

                            </Stack>


                            <Divider
                                sx={{
                                    my: 4,
                                }}
                            />


                            {/* INFORMASI PROFILE */}

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    mb: 2.5,
                                }}
                            >
                                Informasi Profile
                            </Typography>


                            <Stack
                                spacing={2.5}
                            >

                                {/* FULL NAME */}

                                <TextField
                                    fullWidth
                                    label="Nama Lengkap"
                                    value={
                                        fullName
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Person
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />


                                {/* USERNAME */}

                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={
                                        username
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <AccountCircle
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />


                                {/* EMAIL */}

                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={
                                        email
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Email
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />


                                {/* ROLE */}

                                <TextField
                                    fullWidth
                                    label="Role"
                                    value={
                                        capitalizeWords(
                                            profile?.role ||
                                            "Unknown"
                                        )
                                    }
                                    disabled
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Badge
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />

                            </Stack>


                            {/* ERROR */}

                            {(formError ||
                                error) && (

                                <Typography
                                    color="error"
                                    variant="body2"
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    {
                                        formError ||
                                        error
                                    }
                                </Typography>

                            )}


                            {/* ACTION */}

                            {isEditing && (

                                <Stack
                                    direction={{
                                        xs: "column-reverse",
                                        sm: "row",
                                    }}
                                    spacing={1.5}
                                    justifyContent="flex-end"
                                    sx={{
                                        mt: 3,
                                    }}
                                >

                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={
                                            <Close />
                                        }
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={
                                            updating
                                        }
                                    >
                                        Batal
                                    </Button>


                                    <Button
                                        variant="contained"
                                        startIcon={
                                            updating ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            ) : (
                                                <Save />
                                            )
                                        }
                                        onClick={
                                            handleSave
                                        }
                                        disabled={
                                            updating
                                        }
                                    >
                                        {updating
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>

                                </Stack>

                            )}

                        </CardContent>

                    </Card>

                </Box>

            </Box>

        </Box>

    );
}


export default Profile;