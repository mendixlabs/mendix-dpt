import React, { Fragment } from "react";
import { observer, useLocalStore } from "mobx-react";

import { List } from "@material-ui/core";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import { useStores } from "../../hooks/use-stores";
import Item from "../Item";
import { DropdownDesignProperty, ToggleDesignProperty, DesignPropertyType } from "store/objects/design-property";
import { EditSimpleDialog } from "../EditElementDialog";
import { EditPropertyDialog } from "../EditPropertyDialog";

interface Property {
    name: string;
    position: number;
    properties: (DropdownDesignProperty | ToggleDesignProperty)[];
}

const PropertyList = observer(() => {
    const { propertiesStore } = useStores();
    const localStore = useLocalStore(() => ({
        isDragging: false,
        editDialog: false,
        newPropDialog: false,
        initialValue: "",
        selectedProp: "",
        toggleIsDragging(state: boolean) {
            localStore.isDragging = state;
        },
        toggleEdit(state: boolean) {
            localStore.editDialog = state;
        },
        toggleAdd(state: boolean, selectedProp: string) {
            localStore.selectedProp = selectedProp;
            localStore.newPropDialog = state;
        },
        initDialog(name: string) {
            localStore.initialValue = name;
            localStore.editDialog = true;
        },
        get propertyList() {
            return propertiesStore.propertyList;
        },
    }));

    // We do this to make sure it is properly rerendered when it changes
    const { propertyList } = localStore;

    const onDragEnd = (result: DropResult) => {
        localStore.toggleIsDragging(false);
        const { source: src, destination: dest, type } = result;
        if (
            !dest ||
            typeof dest.index === "undefined" ||
            (src.index === dest.index && src.droppableId === dest.droppableId)
        ) {
            return;
        }

        if (type === "ITEM") {
            propertiesStore.changeLocations(src.index, dest.index);
        } else if (type === "INNERLIST") {
            if (src.droppableId === dest.droppableId) {
                propertiesStore.swapPropsInCollection(src.droppableId, src.index, dest.index);
            } else {
                propertiesStore.swapPropsBetweenCollections(src.droppableId, src.index, dest.droppableId, dest.index);
            }
        }
    };

    const onEdit = (elementName: string) => {
        localStore.initDialog(elementName);
    };

    const editItem = (name: string) => {
        if (name && localStore.initialValue && name !== localStore.initialValue) {
            propertiesStore.changeProp(localStore.initialValue, name);
        }
        localStore.toggleEdit(false);
    };

    const createProperty = (name: string, description: string, type: DesignPropertyType) => {
        if ((localStore.selectedProp, name && description && type)) {
            if (type === "Dropdown") {
                propertiesStore.addPropertyToCollection(
                    localStore.selectedProp,
                    new DropdownDesignProperty({
                        name,
                        description,
                        options: [],
                    }),
                );
            } else if (type === "Toggle") {
                propertiesStore.addPropertyToCollection(
                    localStore.selectedProp,
                    new ToggleDesignProperty({
                        name,
                        description,
                        className: "",
                    }),
                );
            }
        }
        localStore.toggleAdd(false, "");
    };

    return (
        <Fragment>
            <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={() => localStore.toggleIsDragging(true)}>
                <Droppable droppableId="list" type="ITEM">
                    {provided => (
                        <List component="nav" ref={provided.innerRef} {...provided.droppableProps}>
                            {propertyList.map((prop, index) => (
                                <Item
                                    key={prop.name}
                                    edit={onEdit}
                                    add={() => localStore.toggleAdd(true, prop.name)}
                                    index={index}
                                    {...prop}
                                    isDragging={localStore.isDragging}
                                />
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
            <EditSimpleDialog
                open={localStore.editDialog}
                initialValue={localStore.initialValue}
                onClose={() => localStore.toggleEdit(false)}
                onProceed={editItem}
                fieldName="Element name"
                elementTitle="Design Property Element"
            />
            <EditPropertyDialog
                open={localStore.newPropDialog}
                element={localStore.selectedProp}
                onClose={() => localStore.toggleAdd(false, "")}
                onProceed={createProperty}
            />
        </Fragment>
    );
});

export default PropertyList;
