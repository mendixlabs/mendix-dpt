import React, { FC, useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useStyles } from "./style";
import { DesignPropertyType } from "../../store/objects/design-property";

export interface EditPropertyDialogProps {
    open: boolean;

    initialName?: string | null;
    initialDesciption?: string | null;
    initialType?: DesignPropertyType | null;

    onClose: () => void;
    onProceed: (name: string, description: string, type: DesignPropertyType) => void;
}

export const EditPropertyDialog: FC<EditPropertyDialogProps> = ({
    open,
    initialName,
    initialDesciption,
    initialType,
    onClose,
    onProceed,
}) => {
    const classes = useStyles();

    const [name, setName] = useState(initialName || "");
    const [desciption, setDescription] = useState(initialDesciption || "");
    const [type, setType] = useState<DesignPropertyType>("Dropdown");

    useEffect(() => {
        setName(initialName || "");
        setDescription(initialDesciption || "");
        setType(initialType || "Dropdown");
        return () => {
            setName("");
            setDescription("");
            setType("Dropdown");
        };
    }, [open, initialName, initialDesciption, initialType]);

    const onChangeName = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setName(target.value);
    };

    const onChangeDesciption = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setDescription(target.value);
    };

    const onChangeType = (
        event: React.ChangeEvent<{
            value: unknown;
        }>,
    ) => {
        const target = event.target as HTMLSelectElement;
        setType(target.value as DesignPropertyType);
    };

    const handleSubmit = () => {
        onProceed(name, desciption, type);
    };

    return (
        <Dialog
            open={open}
            maxWidth="md"
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <ValidatorForm onSubmit={handleSubmit} onError={errors => console.warn("Validation errors", errors)}>
                <DialogTitle id="alert-dialog-title">Property : {initialType ? "Edit" : "Add"}</DialogTitle>
                <DialogContent>
                    {initialType ? null : (
                        <FormControl className={classes.fullWidth}>
                            <InputLabel id="type-selector">Type</InputLabel>
                            <Select
                                labelId="type-selector"
                                id="type-selector-select"
                                value={type}
                                onChange={onChangeType}
                            >
                                <MenuItem value={"Dropdown"}>Dropdown</MenuItem>
                                <MenuItem value={"Toggle"}>Toggle</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <TextValidator
                        className={classes.textFieldEditProperty}
                        label={"Name"}
                        fullWidth
                        onChange={onChangeName}
                        name="editDialogField1"
                        value={name}
                        validators={["required"]}
                        errorMessages={[`Name is required`]}
                    />
                    <TextValidator
                        className={classes.textFieldEditProperty}
                        label={"Description"}
                        fullWidth
                        onChange={onChangeDesciption}
                        name="editDialogField2"
                        value={desciption}
                        validators={["required"]}
                        errorMessages={[`Desciption is required`]}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" type="submit">
                        OK
                    </Button>
                </DialogActions>
            </ValidatorForm>
        </Dialog>
    );
};
