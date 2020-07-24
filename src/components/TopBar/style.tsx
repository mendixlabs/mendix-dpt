import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            textAlign: "right",
        },
        title: {
            flexGrow: 1,
        },
        appBar: {},
    }),
);
