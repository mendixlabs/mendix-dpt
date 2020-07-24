import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        nestedLevel1: {
            paddingLeft: theme.spacing(4),
            paddingTop: 0,
            paddingBottom: 0,
        },
        propertyPanel: {
            paddingLeft: theme.spacing(4),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },

        listItemIcon: {
            minWidth: theme.spacing(5),
        },
    }),
);

export default useStyles;
