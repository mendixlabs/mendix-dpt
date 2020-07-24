import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: "100%",
        },
        textFieldEditProperty: {
            minWidth: theme.spacing(60),
            marginBottom: theme.spacing(1),
        },
    }),
);
