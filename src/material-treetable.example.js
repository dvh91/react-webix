import MaterialWebix from "./material-react-webix";
import {
  renderReactCell,
  renderReactTooltip,
  renderStatefulCell
} from "./react-webix";
import generateData from "./utils";
import React, { useCallback, useState, useRef } from "react";
import { MenuItem, IconButton, Menu, Checkbox } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

function TableTooltip(props) {
  const { column, row } = props;
  return (
    <div>
      {column.header[0].text}
      <br />
      {row[column.id]}
      <span>⚛</span>
    </div>
  );
}

function TableCell(props) {
  const { value } = props;
  return (
    <div>
      {value} <span>⚛</span>
    </div>
  );
}

function TableRowActionsCell(props) {
  const { row, tableRef } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteRow = () => {
    tableRef.remove(row.id);
    handleClose();
  }

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteRow}>Delete {row.name}</MenuItem>
      </Menu>
    </div>
  );
}

function TreeTablePrimaryCell(props) {
  const { row, value } = props;
  return (
    <div style={{ paddingLeft: (row.$level - 1) * 16 }} className="expand">
      {value} <span>⚛</span>
    </div>
  );
}

function TableCheckboxCell(props) {
  const { row, tableRef } = props;

  const handleChange = (event, value) => {
    if (value) {
      tableRef.checkItem(row.id)
    }
    else {
      tableRef.uncheckItem(row.id)
    }
  }

  return <Checkbox checked={row.checked} onChange={handleChange} size="small" />;
}

function TreeTableExample({ dense = false }) {
  const tableRef = useRef();
  const [data, setData] = useState(generateData(50));
  const [leftSplit, setLeftSplit] = useState(0);
  const [rightSplit, setRightSplit] = useState(0);
  const [topSplit, setTopSplit] = useState(0);
  const [yCount, setYCount] = useState();
  const [columns, setColumns] = useState([
    {
      id: 'checkbox',
      header: {
        text: ''
      },
      template: renderStatefulCell.bind(this, TableCheckboxCell, tableRef),
      width: 64,
      tooltip: false
    },
    {
      id: "name",
      header: "Name",
      sort: "string",
      adjust: true,
      fillspace: true,
      minWidth: 200,
      template: renderReactCell.bind(this, TreeTablePrimaryCell)
    },
    {
      id: "phone",
      header: "Phone",
      sort: "string",
      template: renderReactCell.bind(this, TableCell),
      minWidth: 200,
    },
    ...new Array(10).fill().map((_, i) => ({
      id: "random_" + i,
      header: `Random (${i})`,
      sort: "string",
      minWidth: 150,
      template: renderReactCell.bind(this, TableCell)
    })),
    {
      id: "actions",
      header: "",
      css: { "text-align": "right" },
      template: renderStatefulCell.bind(this, TableRowActionsCell, tableRef),
      tooltip: false,
      minWidth: 100
    }
  ]);

  const onItemClick = useCallback(function ({ row: rowId }) {
    console.log("onItemClick");
  }, []);

  const onDeleteButtonClick = useCallback(function () {
    console.log("hellloo");
  }, []);

  const onExpandClick = useCallback(function (event, config) {
    const { row: rowId } = config;
    this.parse({
      data: generateData(2),
      parent: rowId
    });
    const item = this.getItem(rowId);
    item.open ? this.close(rowId) : this.open(rowId);
  }, []);

  const handleColumnChange = () => {
    const next = [
      {
        id: 'checkbox',
        header: '',
        template: renderStatefulCell.bind(this, TableCheckboxCell, tableRef),
        width: 64,
        tooltip: false
      },
      {
        id: "name",
        header: "Name",
        sort: "string",
        fillspace: true,
        minWidth: 200,
        template: renderReactCell.bind(this, TreeTablePrimaryCell)
      },
      {
        id: "phone",
        header: "Phone",
        sort: "string",
        template: renderReactCell.bind(this, TableCell),
        minWidth: 200,
      },
      ...new Array(20).fill().map((_, i) => ({
        id: "random_" + i,
        header: `Random (${i})`,
        sort: "string",
        minWidth: 150,
        template: renderReactCell.bind(this, TableCell)
      })),
      {
        id: "actions",
        header: "",
        width: 64,
        css: { "text-align": "right" },
        template: renderStatefulCell.bind(this, TableRowActionsCell),
        tooltip: false
      }
    ]

    setColumns(next);
  }

  const config = {
    view: "treetable",
    autoheight: true,
    data,
    columns,
    leftSplit,
    rightSplit,
    topSplit,
    yCount,
    tooltip: renderReactTooltip.bind(this, TableTooltip),
    onClick: {
      expand: onExpandClick,
      deleteButton: onDeleteButtonClick
    },
    on: {
      onItemClick
    }
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => setData(generateData())}>update data</button>
        <button onClick={handleColumnChange}>update columns</button>
        <button onClick={() => setLeftSplit(2)}>update left split</button>
        <button onClick={() => setRightSplit(1)}>update right split</button>
        <button onClick={() => setTopSplit(2)}>update top split</button>
        <button onClick={() => setYCount(10)}>update yCount (10)</button>
        <button onClick={() => setYCount(80)}>update yCount (80)</button>
      </div>

      <MaterialWebix dense={dense} config={config} onReady={(ref) => tableRef.current = ref} />
    </div>
  );
}

export default TreeTableExample;
