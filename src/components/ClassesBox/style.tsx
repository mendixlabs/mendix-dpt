import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        optionsTable: {
            maxWidth: "100%",
            minHeight: theme.spacing(44),
            "& > .MuiPaper-root": {
                "& > .MuiToolbar-root": {
                    minHeight: theme.spacing(1),
                    position: "relative",
                    "& .MuiButtonBase-root.MuiIconButton-root": {
                        position: "absolute",
                        right: 0,
                        zIndex: 100,
                        top: 0,
                    },
                },
                "& .MuiButtonBase-root": {
                    padding: theme.spacing(1),
                },
                "& .MuiIconButton-root": {
                    padding: theme.spacing(1),
                },
            },
        },
    }),
);

export default useStyles;
