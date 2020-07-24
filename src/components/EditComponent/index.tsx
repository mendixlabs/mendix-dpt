import React, { Fragment, FC, useState } from "react";
import { observer } from "mobx-react";

import { IconButton } from "@material-ui/core";

import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

import { DeleteDialog } from "../ConfirmDialogs";

const EditComponent: FC<{
    showAddButton?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onAdd?: () => void;
}> = observer(({ showAddButton, onDelete, onEdit, onAdd }) => {
    const [dialogOpen, toggleDialog] = useState(false);

    const handleClose = () => {
        toggleDialog(false);
    };

    const deleteObject = () => {
        toggleDialog(false);
        onDelete ? onDelete() : console.warn("Not implemented yet");
    };

    const handleEdit = () => {
        onEdit ? onEdit() : console.warn("Not implemented yet");
    };

    const handleAdd = () => {
        onAdd ? onAdd() : console.warn("Not implemented yet");
    };

    return (
        <Fragment>
            {showAddButton ? (
                <IconButton aria-label="add" onClick={handleAdd} size="small" disabled={!onAdd}>
                    <AddOutlinedIcon />
                </IconButton>
            ) : null}
            <IconButton aria-label="edit" onClick={handleEdit} size="small" disabled={!onEdit}>
                <EditOutlinedIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => toggleDialog(true)} size="small" disabled={!onDelete}>
                <DeleteOutlined />
            </IconButton>
            <DeleteDialog open={dialogOpen} onClose={handleClose} onProceed={deleteObject} />
        </Fragment>
    );
});

export default EditComponent;
