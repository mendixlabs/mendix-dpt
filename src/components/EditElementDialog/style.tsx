import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textFieldEdit: {
            minWidth: theme.spacing(60),
        },
    }),
);
