import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";

import "./styling/App.scss";

import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Grid, Fab } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/adventure_time.css";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import { useStyles } from "./styling/App";
import { useStores } from "./hooks/use-stores";
import PropertyList from "components/PropertyList";
import TopBar from "components/TopBar";
import { EditSimpleDialog } from "components/EditElementDialog";
import OpeningDialog from "components/OpeningDialog";

const App = observer(() => {
    const { appStore, propertiesStore } = useStores();
    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: appStore.darkMode ? "dark" : "light",
                    primary: {
                        main: "#000",
                    },
                },
            }),
        [appStore.darkMode],
    );

    const classes = useStyles(theme);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [openingDialog, switchOpeningDialog] = useState(true);

    const onAddProp = (value: string) => {
        if (value) {
            propertiesStore.addProp(value);
        }
        setAddDialogOpen(false);
    };

    return (
        <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className={classes.root}>
                    <TopBar onHomeClick={() => switchOpeningDialog(true)} />
                    <Grid container spacing={2} className={classes.mainColumn}>
                        <Grid item xs className={classes.leftColumn}>
                            <PropertyList />
                            <Fab
                                color="primary"
                                aria-label="Add"
                                className={classes.addButton}
                                size="small"
                                onClick={() => setAddDialogOpen(true)}
                            >
                                <AddCircleOutlinedIcon />
                            </Fab>
                        </Grid>
                        <Grid item xs className={classes.rightColumn}>
                            <Grid item className={classes.jsonBox}>
                                <JSONPretty data={propertiesStore.JSOBject} />
                            </Grid>
                            <Grid item className={classes.classesBox}>
                                Classes
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <EditSimpleDialog
                    open={addDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onProceed={onAddProp}
                    fieldName="Element name"
                    elementTitle="Design Property Element"
                />
                <OpeningDialog open={openingDialog} onClose={() => switchOpeningDialog(false)} />
            </ThemeProvider>
        </StylesProvider>
    );
});

export default App;
