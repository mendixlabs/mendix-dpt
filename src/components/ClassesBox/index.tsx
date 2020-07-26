import React, { FC } from "react";
import { observer } from "mobx-react";

import { useStyles } from "./style";
import { useStores } from "../../hooks/use-stores";
import MaterialTable, { Column } from "material-table";
import { tableIcons } from "components/DropdownProps/_dropdownTable";

interface ClassListObject {
    el: string;
    prop: string;
    class: string;
}

export interface ClassTableState {
    columns: Array<Column<ClassListObject>>;
    data: ClassListObject[];
}

const getTableState = (data: ClassListObject[]): ClassTableState => {
    return {
        columns: [
            {
                title: "Class",
                field: "class",
                cellStyle: {
                    padding: 8,
                },
            },
            {
                title: "Property",
                field: "prop",
                cellStyle: {
                    padding: 8,
                },
            },
            {
                title: "Element",
                field: "el",
                cellStyle: {
                    padding: 8,
                },
            },
        ],
        data,
    };
};

const ClassesBox: FC<{}> = observer(() => {
    const { propertiesStore } = useStores();
    const tableState = getTableState(propertiesStore.classList);
    const classes = useStyles();

    return (
        <div className={classes.optionsTable}>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={tableState.columns}
                data={tableState.data}
                options={{
                    pageSize: 5,
                    pageSizeOptions: [5],
                    headerStyle: {
                        padding: 0,
                    },
                    rowStyle: {
                        padding: 0,
                    },
                }}
            />
        </div>
    );
});

export default ClassesBox;
