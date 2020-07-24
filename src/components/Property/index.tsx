import React, { FC, useState, Fragment } from "react";
import { observer } from "mobx-react";

import { ListItem, ListItemText, ListItemIcon, Collapse } from "@material-ui/core";

import ToggleOffOutlinedIcon from "@material-ui/icons/ToggleOffOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { DropdownDesignProperty, ToggleDesignProperty } from "store/objects/design-property";
import { useStores } from "hooks/use-stores";

import { makeStyles } from "@material-ui/core/styles";
import DropdownProps from "../DropdownProps";
import ToggleProps from "../ToggleProps";
import EditComponent from "../EditComponent";
import { useStyles } from "./style";
import { EditPropertyDialog } from "../EditPropertyDialog";

interface LocalStyleProps {
    ignored?: boolean;
}
const localStyles = makeStyles(() => ({
    textClass: (props: LocalStyleProps) => ({
        opacity: props.ignored ? 0.4 : 1,
    }),
}));

const Property: FC<{
    property: DropdownDesignProperty | ToggleDesignProperty;
}> = observer(({ property }) => {
    const { propertiesStore } = useStores();
    const classes = useStyles();
    const localClasses = localStyles({ ignored: property.ignored });
    const { name, description, type } = property;

    const [open, toggle] = useState(false);
    const [editDialog, toggleEditDialog] = useState(false);

    const handleClick = () => {
        toggle(!open);
    };

    const deleteObject = () => {
        propertiesStore.deleteSingleProp(property.id);
    };

    const updateObject = (name: string, description: string) => {
        if (name && description) {
            property.setName(name);
            property.setDescription(description);
        }
        toggleEditDialog(false);
    };

    return (
        <Fragment>
            <ListItem className={classes.nestedLevel1} button>
                <ListItemIcon className={classes.listItemIcon} onClick={handleClick}>
                    {type === "Dropdown" ? <ListOutlinedIcon /> : <ToggleOffOutlinedIcon />}
                </ListItemIcon>
                <ListItemText
                    className={localClasses.textClass}
                    primary={name}
                    secondary={description}
                    onClick={handleClick}
                />
                <EditComponent
                    showAddButton={false}
                    onEdit={() => {
                        toggleEditDialog(true);
                    }}
                    onDelete={() => {
                        deleteObject();
                    }}
                />
                {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit className={classes.propertyPanel}>
                {property instanceof DropdownDesignProperty ? (
                    <DropdownProps prop={property as DropdownDesignProperty} />
                ) : (
                    <ToggleProps prop={property as ToggleDesignProperty} />
                )}
            </Collapse>
            <EditPropertyDialog
                open={editDialog}
                onClose={() => toggleEditDialog(false)}
                initialName={property.name}
                initialDesciption={property.description}
                initialType={property.type}
                onProceed={updateObject}
            />
        </Fragment>
    );
});

export default Property;
