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
        //backgroundColor: "#CCC",
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
        overflowY: "auto",
    },
    appBar: {},
    toolBar: {
        paddingLeft: theme.spacing(2),
    },
    toolBarIcon: {
        color: theme.palette.common.white,
    },
    formControlTopBar: {
        margin: theme.spacing(1),
        // minWidth: 120,
    },
    formControlTopBarInput: {
        color: theme.palette.common.white,
        marginTop: 0,
    },

    title: {
        flexGrow: 1,
    },

    classInput: {
        padding: theme.spacing(2),
    },
    jsonPretty: {},
}));
