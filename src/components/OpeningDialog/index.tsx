import React, { FC, useCallback } from "react";

import { Dialog, DialogContent, Grid, Button, DialogTitle } from "@material-ui/core";
import { observer } from "mobx-react";

import MobileScreenShareOutlinedIcon from "@material-ui/icons/MobileScreenShareOutlined";
import WebAssetOutlinedIcon from "@material-ui/icons/WebAssetOutlined";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@material-ui/icons/PlayCircleFilledWhiteOutlined";

import { useStores } from "../../hooks/use-stores";

import SettingsWebAtlas from "../../examples/settings.json";
import SettingsNativeAtlas from "../../examples/settings-native.json";
import SettingsWebEmpty from "../../examples/settings-empty.json";
import SettingsNativeEmpty from "../../examples/settings-native-empty.json";
import { useStyles } from "./style";

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
}

const OpeningDialog: FC<ConfirmDialogProps> = observer(({ open, onClose }) => {
    const classes = useStyles();
    const { propertiesStore } = useStores();

    const isEmpty = !propertiesStore.hasLocalStorage || propertiesStore.isEmpty;

    const onLoadAtlasWeb = useCallback(() => {
        propertiesStore.populateFromJSON(JSON.stringify(SettingsWebAtlas));
        onClose();
    }, []);

    const onLoadAtlasNative = useCallback(() => {
        propertiesStore.populateFromJSON(JSON.stringify(SettingsNativeAtlas));
        onClose();
    }, []);

    const onLoadEmptyWeb = useCallback(() => {
        propertiesStore.populateFromJSON(JSON.stringify(SettingsWebEmpty));
        onClose();
    }, []);

    const onLoadEmptyNative = useCallback(() => {
        propertiesStore.populateFromJSON(JSON.stringify(SettingsNativeEmpty));
        onClose();
    }, []);

    const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
            const res = evt.target?.result;
            if (res) {
                try {
                    propertiesStore.populateFromJSON(res.toString());
                    onClose();
                } catch (error) {
                    console.error(error);
                }
            }
        };
        reader.readAsText(file);
    }, []);

    return (
        <Dialog
            open={open}
            maxWidth="lg"
            onClose={onClose}
            disableBackdropClick
            disableEscapeKeyDown
            BackdropProps={{
                className: classes.introBackdrop,
            }}
            classes={{
                root: classes.introDialogRoot,
                paper: classes.introDialogPaper,
            }}
            // aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle id="alert-dialog-title">Welcome</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} className={classes.introGrid}>
                    <Grid item xs={6}>
                        <Button
                            className={classes.introButton}
                            variant="contained"
                            color="primary"
                            onClick={onLoadAtlasNative}
                            startIcon={<MobileScreenShareOutlinedIcon />}
                        >
                            Load Atlas UI - Native Mobile file (settings-native.json)
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            className={classes.introButton}
                            variant="contained"
                            color="secondary"
                            onClick={onLoadAtlasWeb}
                            startIcon={<WebAssetOutlinedIcon />}
                        >
                            Load Atlas UI - Web file (settings.json)
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            className={classes.introButton}
                            color="primary"
                            variant="contained"
                            onClick={onLoadEmptyNative}
                            startIcon={<MobileScreenShareOutlinedIcon />}
                        >
                            Start empty Native Mobile file (settings-native.json)
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            className={classes.introButton}
                            variant="contained"
                            color="secondary"
                            onClick={onLoadEmptyWeb}
                            startIcon={<WebAssetOutlinedIcon />}
                        >
                            Start empty Web file (settings.json)
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.uploadRoot}>
                            <input
                                accept=".json"
                                className={classes.uploadInput}
                                id="contained-button-file"
                                onChange={onFileChange}
                                type="file"
                            />
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={<CloudUploadOutlinedIcon />}
                                    className={classes.introButton}
                                >
                                    Upload
                                </Button>
                            </label>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            className={classes.introButton}
                            variant="contained"
                            disabled={isEmpty}
                            onClick={onClose}
                            startIcon={<PlayCircleFilledWhiteOutlinedIcon />}
                        >
                            Continue from local storage {!isEmpty ? null : "[empty]"}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
});

export default OpeningDialog;
