import React, { Fragment, FC, useState } from "react";
import { observer } from "mobx-react";

import { List, ListItem, ListItemText, Collapse, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";

import { useStyles } from "./style";
import { useStores } from "../../hooks/use-stores";
import { DropdownDesignProperty, ToggleDesignProperty } from "store/objects/design-property";
import Property from "../Property";
import { Draggable, Droppable } from "react-beautiful-dnd";
import EditComponent from "../EditComponent";
import { grey } from "@material-ui/core/colors";

interface LocalStyleProps {
    ignored?: boolean;
    isDragging?: boolean;
}

const localStyles = makeStyles(() => ({
    textClass: (props: LocalStyleProps) => ({
        cursor: "pointer",
        opacity: props.ignored ? 0.4 : 1,
    }),
    collapse: (props: LocalStyleProps) => {
        return props.isDragging
            ? {
                  pointerEvents: "none",
                  backgroundColor: grey[200],
                  opacity: 0.4,
              }
            : {};
    },
}));

const Item: FC<{
    name: string;
    properties: (DropdownDesignProperty | ToggleDesignProperty)[];
    index: number;
    isDragging?: boolean;
    edit: (name: string) => void;
    add: () => void;
}> = observer(({ name, properties, index, edit, isDragging, add }) => {
    const { propertiesStore } = useStores();
    const classes = useStyles();
    const localClasses = localStyles({ ignored: properties.length === 0, isDragging });

    const [open, toggle] = useState(false);

    const handleClick = () => {
        toggle(!open);
    };

    const deleteObject = () => {
        propertiesStore.deleteProps(name);
    };

    return (
        <Fragment>
            <Draggable draggableId={name} index={index}>
                {provided => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ListItem button className={classes.itemElement}>
                            <AppsOutlinedIcon className={classes.dragHandleButton} />
                            <ListItemText onClick={handleClick} className={localClasses.textClass}>
                                <span className={classes.textElipsis}>{name}</span>
                            </ListItemText>
                            <EditComponent
                                showAddButton={open}
                                onDelete={deleteObject}
                                onEdit={() => edit(name)}
                                onAdd={add}
                            />
                            {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
                        </ListItem>
                        {open ? <Divider /> : null}
                        <Collapse in={open} timeout="auto" unmountOnExit className={localClasses.collapse}>
                            <Droppable droppableId={name} type="INNERLIST" isDropDisabled={isDragging}>
                                {providedItem => (
                                    <List component="div" disablePadding ref={providedItem.innerRef}>
                                        {properties.map((prop, innerIndex) => (
                                            <Draggable draggableId={prop.id} index={innerIndex} key={prop.id}>
                                                {providedInner => (
                                                    <div
                                                        ref={providedInner.innerRef}
                                                        {...providedInner.draggableProps}
                                                        {...providedInner.dragHandleProps}
                                                    >
                                                        <Property property={prop} element={name} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {properties.length === 0 ? (
                                            <ListItem component="div" className={classes.nestedLevel1}>
                                                <ListItemText>
                                                    <span className={classes.textElipsis}>-- Empty --</span>
                                                </ListItemText>
                                            </ListItem>
                                        ) : null}
                                        {providedItem.placeholder}
                                    </List>
                                )}
                            </Droppable>
                        </Collapse>
                    </div>
                )}
            </Draggable>
            <Divider />
        </Fragment>
    );
});

export default Item;
