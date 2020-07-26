import React, { FC, useEffect, useState } from "react";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useStyles } from "./style";
import { DESIGN_PROPERTY_RULE } from "../../util/validationRules";
import { useStores } from "../../hooks/use-stores";

export interface EditSimpleDialogProps {
    open: boolean;
    elementTitle: string;
    fieldName?: string;
    initialValue?: string | null;
    onClose: () => void;
    onProceed: (value: string) => void;
}

export const EditSimpleDialog: FC<EditSimpleDialogProps> = ({
    open,
    onClose,
    onProceed,
    initialValue,
    elementTitle,
    fieldName,
}) => {
    const classes = useStyles();
    const [name, setName] = useState(initialValue || "");
    const field = fieldName || "Name";
    const { propertiesStore } = useStores();

    useEffect(() => {
        setName(initialValue || "");
        return () => {
            setName("");
        };
    }, [open, initialValue]);

    useEffect(() => {
        ValidatorForm.addValidationRule("elementName", (value: string) => {
            if (value && value !== initialValue && propertiesStore.keys.includes(value)) {
                return false;
            }
            return true;
        });
        const cleanup = () => {
            ValidatorForm.removeValidationRule("elementName");
        };
        return cleanup;
    });

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setName(target.value);
    };

    const handleSubmit = () => {
        onProceed(name);
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
                <DialogTitle id="alert-dialog-title">
                    {elementTitle} : {initialValue ? "Edit" : "Add"}
                </DialogTitle>
                <DialogContent>
                    <TextValidator
                        className={classes.textFieldEdit}
                        label={field}
                        fullWidth
                        onChange={onChange}
                        name="editDialogField1"
                        value={name}
                        validators={["required", "elementName", DESIGN_PROPERTY_RULE.rule]}
                        errorMessages={[
                            `${field} is required`,
                            `Element with name '${name}' already exists`,
                            DESIGN_PROPERTY_RULE.error,
                        ]}
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
