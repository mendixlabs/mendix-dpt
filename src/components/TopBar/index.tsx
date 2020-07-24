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
} from "@material-ui/core";

import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

import { useStyles } from "../../styling/App";
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
        saveAs(blob, "settings.json");
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
