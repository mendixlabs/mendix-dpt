import { makeStyles, Theme } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        height: "100vh",
        overflow: "hidden",
    },
    mainColumn: {
        alignItems: "stretch",
        height: `calc(100vh - ${theme.spacing(6)}px)`,
        marginTop: theme.spacing(6),
        overflow: "hidden",
    },
    leftColumn: {
        maxWidth: "50%",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
    },
    addButton: {
        position: "fixed",
        bottom: theme.spacing(1),
        right: "50%",
    },
    rightColumn: {
        maxWidth: "50%",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "hidden",
    },
    jsonBox: {
        height: "50vh",
        overflowX: "hidden",
        overflowY: "auto",
    },
    classesBox: {
        height: "50vh",
    },
}));
