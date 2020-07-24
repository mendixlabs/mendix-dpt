import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperMenu: {
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
        },
        toggleClear: {
            display: "inline-flex",
            marginTop: theme.spacing(4),
            marginLeft: 0 - theme.spacing(2),
        },
        toggleInput: {
            padding: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(4)}px)`,
        },
    }),
);

export default useStyles;
