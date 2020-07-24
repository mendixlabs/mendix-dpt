import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";

import { DropdownDesignProperty, DropdownDesignPropertyProperty } from "store/objects/design-property";

import MaterialTable from "material-table";
import { tableIcons, TableEdit, TableState } from "./_dropdownTable";
import { useStores } from "../../hooks/use-stores";
import { PropertiesType } from "../../store/properties-store";
import { CLASS_NAME_NATIVE_RULE, CLASS_NAME_WEB_RULE } from "../../util/validationRules";
import { useStyles } from "./style";

import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@material-ui/icons/ArrowDropUpOutlined";

const getTableEdit = (prop: DropdownDesignProperty): TableEdit => {
    return {
        onRowUpdate: async (newData, oldData) => {
            if (oldData && oldData.id && newData.name && newData.className) {
                oldData.setName(newData.name);
                oldData.setClassName(newData.className);
            } else {
                return false;
            }
            return true;
        },
        onRowDelete: async oldData => {
            prop.removeOption(oldData.id);
        },
        onRowAdd: async newData => {
            if (newData.name && newData.className) {
                prop.addOption(newData.name, newData.className);
            }
        },
    };
};

const getTableState = (options: DropdownDesignPropertyProperty[], type: PropertiesType): TableState => {
    return {
        columns: [
            {
                title: "Name",
                field: "name",
                validate: ({ name }) => {
                    if (!name) {
                        return "Name cannot be empty!";
                    }
                    return true;
                },
                sorting: false,
                cellStyle: {
                    padding: 8,
                },
            },
            {
                title: "Class",
                field: "className",
                validate: ({ className }) => {
                    if (!className) {
                        return "Class cannot be empty!";
                    }
                    if (type === "Native" && !className.match(CLASS_NAME_NATIVE_RULE.regExp)) {
                        return CLASS_NAME_NATIVE_RULE.error;
                    }
                    if (type === "Web" && !className.match(CLASS_NAME_WEB_RULE.regExp)) {
                        return CLASS_NAME_WEB_RULE.error;
                    }
                    return true;
                },
                sorting: false,
                cellStyle: {
                    padding: 8,
                },
            },
        ],
        data: options,
    };
};

const DropdownProps: FC<{ prop: DropdownDesignProperty }> = observer(({ prop }) => {
    const { options } = prop;
    const classes = useStyles();
    const { propertiesStore } = useStores();
    const tableState = getTableState(options, propertiesStore.type);
    const editableFunctions: TableEdit = useMemo(() => getTableEdit(prop), [prop]);

    const upButton = () => <ArrowDropUpOutlinedIcon />;
    const downButton = () => <ArrowDropDownOutlinedIcon />;

    const moveUp = (pos: number) => {
        if (pos > 0) {
            prop.moveOption(pos, pos - 1);
        }
    };

    const moveDown = (pos: number) => {
        if (pos < prop.options.length - 1) {
            prop.moveOption(pos, pos + 1);
        }
    };

    return (
        <div className={classes.optionsTable}>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={tableState.columns}
                data={tableState.data}
                editable={editableFunctions}
                options={{
                    paging: false,
                    search: false,
                    headerStyle: {},
                    rowStyle: {
                        padding: 0,
                    },
                }}
                actions={[
                    {
                        icon: downButton,
                        tooltip: "Move down",
                        onClick: (event, rowData) => {
                            if (
                                rowData instanceof DropdownDesignPropertyProperty &&
                                typeof rowData.tableData.id !== "undefined"
                            ) {
                                moveDown(+rowData.tableData.id);
                            }
                        },
                    },
                    {
                        icon: upButton,
                        tooltip: "Move up",
                        onClick: (event, rowData) => {
                            if (
                                rowData instanceof DropdownDesignPropertyProperty &&
                                typeof rowData.tableData.id !== "undefined"
                            ) {
                                moveUp(+rowData.tableData.id);
                            }
                        },
                    },
                ]}
            />
        </div>
    );
});

export default DropdownProps;
