import { makeStyles, createStyles, Theme, fade } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        introDialogRoot: {
            padding: theme.spacing(1),
        },
        introBackdrop: {
            backgroundColor: "rgba(0,0,0,0.85)",
        },
        introDialogPaper: {
            //height: "100%",
            minHeight: theme.spacing(38),
        },
        introGrid: {
            marginBottom: theme.spacing(1.5),
        },
        introButton: {
            width: "100%",
            padding: theme.spacing(2),
            "& .MuiButton-label": {
                justifyContent: "left",
            },
        },
        introUploadButton: {
            backgroundColor: theme.palette.info.main,
            "&:hover": {
                backgroundColor: fade(theme.palette.info.dark, 0.5),
            },
        },
        uploadRoot: {},
        uploadInput: {
            display: "none",
        },
    }),
);

export default useStyles;
