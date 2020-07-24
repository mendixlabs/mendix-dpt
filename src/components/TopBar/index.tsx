import React, { Fragment, useMemo, useState, ChangeEvent, FC } from "react";
import { observer } from "mobx-react";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
    Snackbar,
    FormControl,
    Select,
    MenuItem,
    Link,
    SvgIcon,
} from "@material-ui/core";

import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

import { useStyles } from "./style";
import { useStores } from "../../hooks/use-stores";
import { PropertiesType } from "store/properties-store";

const downloadSupported = (): boolean => {
    try {
        const isSupported = !!new Blob();
        return isSupported;
    } catch (error) {
        console.warn("File download not supported", error);
        return false;
    }
};

const TopBar: FC<{ onHomeClick: () => void }> = observer(({ onHomeClick }) => {
    const { propertiesStore } = useStores();
    const classes = useStyles();

    const isDownloadSupported = useMemo(() => downloadSupported(), []);
    const [copyPopper, setCopyPopper] = useState(false);

    const onCopyClick = () => {
        const jsonString = JSON.stringify(propertiesStore.JSOBject, null, 4);

        copy(jsonString, {
            debug: true,
            format: "text/plain",
            onCopy: () => {
                setCopyPopper(true);
            },
        });
    };

    const onDownloadClick = () => {
        const jsonString = JSON.stringify(propertiesStore.JSOBject, null, 4);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        saveAs(blob, propertiesStore.type === "Native" ? "settings-native.json" : "settings.json");
    };

    const handleChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
        const val = event.target.value as PropertiesType;
        propertiesStore.setType(val);
    };

    return (
        <Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar variant="dense" className={classes.toolBar}>
                    <Typography variant="h6" className={classes.title}>
                        Mendix Design Properties Editor
                    </Typography>
                    <FormControl className={classes.formControlTopBar}>
                        {propertiesStore.type !== null ? (
                            <Select
                                classes={{
                                    root: classes.formControlTopBarInput,
                                    disabled: classes.formControlTopBarInput,
                                }}
                                id="type-selection"
                                value={propertiesStore.type}
                                onChange={handleChange}
                                disabled
                            >
                                <MenuItem value={"Web"}>Web</MenuItem>
                                <MenuItem value={"Native"}>Native</MenuItem>
                            </Select>
                        ) : null}
                    </FormControl>
                    <Tooltip title="Home">
                        <IconButton aria-label="Download JSON" onClick={onHomeClick}>
                            <HomeOutlinedIcon fontSize="small" className={classes.toolBarIcon} />
                        </IconButton>
                    </Tooltip>
                    {isDownloadSupported ? (
                        <Tooltip title="Download JSON">
                            <IconButton aria-label="Download JSON" onClick={onDownloadClick}>
                                <CloudDownloadOutlinedIcon fontSize="small" className={classes.toolBarIcon} />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    <Tooltip title="Copy to Clipboard">
                        <IconButton aria-label="Copy to Clipboard" onClick={onCopyClick}>
                            <FileCopyOutlinedIcon fontSize="small" className={classes.toolBarIcon} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Info">
                        <Link href="https://docs.mendix.com/apidocs-mxsdk/apidocs/design-properties" target="_blank">
                            <IconButton aria-label="Info">
                                <HelpOutlineOutlinedIcon fontSize="small" className={classes.toolBarIcon} />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Info">
                        <Link href="https://github.com/JelteMX/mendix-dpt" target="_blank">
                            <IconButton aria-label="Info">
                                <SvgIcon viewBox="0 0 30.47 29.72" style={{ width: "20px" }}>
                                    <path
                                        d={
                                            "M15.23,0a15.24,15.24,0,0,0-4.81,29.69c.76.14,1-.33,1-.73s0-1.32,0-2.59c-4.24.92-5.13-2.05-5.13-2.05a4.07,4.07,0,0,0-1.7-2.23c-1.38-.94.11-.92.11-.92a3.19,3.19,0,0,1,2.33,1.57A3.25,3.25,0,0,0,11.49,24a3.28,3.28,0,0,1,1-2c-3.38-.39-6.94-1.69-6.94-7.53a5.93,5.93,0,0,1,1.57-4.09,5.51,5.51,0,0,1,.15-4s1.28-.41,4.19,1.56a14.52,14.52,0,0,1,7.63,0c2.91-2,4.18-1.56,4.18-1.56a5.48,5.48,0,0,1,.16,4A5.92,5.92,0,0,1,25,14.44C25,20.29,21.39,21.58,18,22a3.66,3.66,0,0,1,1,2.82c0,2,0,3.68,0,4.18s.28.88,1,.73A15.24,15.24,0,0,0,15.23,0Z"
                                        }
                                        fill="#FFF"
                                        //style="fill:#191717;fill-rule:evenodd"
                                    />
                                </SvgIcon>
                            </IconButton>
                        </Link>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Snackbar
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                open={copyPopper}
                onClose={() => {
                    setCopyPopper(false);
                }}
                message="JSON copied to clipboard"
            />
        </Fragment>
    );
});

export default TopBar;
