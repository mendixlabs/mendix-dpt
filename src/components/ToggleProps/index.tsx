import React, { FC, useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";

import { useStyles } from "./style";
import { ToggleDesignProperty } from "store/objects/design-property";
import { Paper, IconButton } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useStores } from "../../hooks/use-stores";
import { CLASS_NAME_NATIVE_RULE, CLASS_NAME_WEB_RULE } from "../../util/validationRules";

import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

const ToggleProps: FC<{ prop: ToggleDesignProperty }> = observer(({ prop }) => {
    const { className } = prop;
    const { propertiesStore } = useStores();
    const classes = useStyles();

    const [name, setName] = useState(className || "");

    const [validators, errorMessages] = useMemo(() => {
        const validators = ["required"];
        const errorMessages = [`A class name is required for this property, otherwise it is ignored`];

        if (propertiesStore.type === "Native") {
            validators.push(CLASS_NAME_NATIVE_RULE.rule);
            errorMessages.push(CLASS_NAME_NATIVE_RULE.error);
        } else if (propertiesStore.type === "Web") {
            validators.push(CLASS_NAME_WEB_RULE.rule);
            errorMessages.push(CLASS_NAME_WEB_RULE.error);
        }

        return [validators, errorMessages];
    }, [propertiesStore.type]);

    useEffect(() => {
        setName(className);
        return () => {
            setName("");
        };
    }, [className]);

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setName(target.value);
    };

    const handleSubmit = () => {
        if (name) {
            prop.setClassName(name);
        }
    };

    const reset = () => {
        setName(className);
    };

    return (
        <Paper elevation={2} className={classes.paperMenu}>
            <ValidatorForm onSubmit={handleSubmit} onError={errors => console.warn("Validation errors", errors)}>
                <TextValidator
                    className={classes.toggleInput}
                    id="standard-full-width"
                    label="Class name"
                    placeholder="className"
                    fullWidth
                    onChange={onChange}
                    helperText={className !== name ? "Not saved yet, press Enter to set text" : ""}
                    name="editDialogField1"
                    value={name}
                    validators={validators}
                    errorMessages={errorMessages}
                />
                {className !== name ? (
                    <IconButton aria-label="clear" onClickCapture={reset} size="small" className={classes.toggleClear}>
                        <ClearOutlinedIcon />
                    </IconButton>
                ) : null}
            </ValidatorForm>
        </Paper>
    );
});

export default ToggleProps;
