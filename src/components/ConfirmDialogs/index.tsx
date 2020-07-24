import React, { FC } from "react";

import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from "@material-ui/core";

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onProceed,
    title,
    description,
    confirmText,
    cancelText,
}) => {
    const confirm = confirmText || "Yes";
    const cancel = cancelText || "No";
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {cancel}
                </Button>
                <Button onClick={onProceed} color="primary" autoFocus>
                    {confirm}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;

export interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
}

export const DeleteDialog: FC<DeleteDialogProps> = cancelProps => {
    const dialogProps: ConfirmDialogProps = {
        ...cancelProps,
        title: "Are you sure you want to delete this?",
        description: "This change cannot be undone!",
    };
    return <ConfirmDialog {...dialogProps} />;
};
