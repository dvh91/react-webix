import MaterialWebix from "./material-react-webix";
import {
  renderReactCell,
  renderReactTooltip,
  renderStatefulCell
} from "./react-webix";
import generateData from "./utils";
import React, { useCallback, useState, useRef } from "react";
import { MenuItem, IconButton, Menu, Checkbox, Box } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import MoreVertIcon from "@material-ui/icons/MoreVert";

function TableTooltip(props) {
  const { column, row } = props;
  return (
    <div>
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

  const handleSelectRow = () => {
    tableRef.checkItem(row.id);
    handleClose();
  }

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteRow}>Delete {row.name}</MenuItem>
        <MenuItem onClick={handleSelectRow}>Select {row.name}</MenuItem>
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

    tableRef.callEvent("onCheck", [row.id, null, value]);
  }

  return <Checkbox checked={row.checked} onChange={handleChange} size="small" />;
}

function TreeTableExample({ dense = false }) {
  const tableRef = useRef();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [data, setData] = useState(generateData(40));
  const [leftSplit, setLeftSplit] = useState(0);
  const [rightSplit, setRightSplit] = useState(0);
  const [topSplit, setTopSplit] = useState(0);
  const [yCount, setYCount] = useState();
  const [columns, setColumns] = useState([
    {
      id: 'checkbox',
      header: { text: '' },
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
      width: 64,
    }
  ]);

  const onItemClick = useCallback(function ({ row: rowId }) {
    console.log("onItemClick");
  }, []);

  const onAfterLoad = useCallback(function () {
    const next = this.getPager().data.$max + 1;
    if (pageCount !== next) setPageCount(next)
  }, []);

  const onBeforePageChange = useCallback(function (page) {
    setPage(Number(page) + 1)
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
      onItemClick,
      onAfterLoad,
    },
    pager: {
      size: 15,
      group: 100,
      apiOnly: true,
      on: {
        onBeforePageChange
      }
    }
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => tableRef.current.checkAll()}>check all</button>
        <button onClick={() => tableRef.current.uncheckAll()}>uncheck all</button>
        <button onClick={() => setData(generateData())}>update data</button>
        <button onClick={handleColumnChange}>update columns</button>
        <button onClick={() => setLeftSplit(2)}>update left split</button>
        <button onClick={() => setRightSplit(1)}>update right split</button>
      </div>

      <MaterialWebix dense={dense} config={config} onReady={(ref) => tableRef.current = ref} />
      {
        pageCount && (
          <Box display="flex" flexDirection="row-reverse" my={2}>
            <Pagination color="secondary" showFirstButton showLastButton count={pageCount} page={page} onChange={(event, page) => tableRef.current.setPage(page - 1)} />
          </Box>
        )
      }
    </div>
  );
}

export default TreeTableExample;
