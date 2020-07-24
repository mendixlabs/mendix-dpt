import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemElement: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        textElipsis: {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        dragHandleButton: {
            color: grey[500],
            marginRight: theme.spacing(1),
        },
        nestedLevel1: {
            paddingLeft: theme.spacing(4),
            paddingTop: 0,
            paddingBottom: 0,
        },
    }),
);
