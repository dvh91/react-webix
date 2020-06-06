import { Webix, renderReactCell, renderReactTooltip } from "./react-webix";
import generateData from "./utils";
import React, { useCallback, useState } from "react";

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

function TableExample() {
  const [data, setData] = useState(generateData(50));
  const [leftSplit, setLeftSplit] = useState(0);
  const [rightSplit, setRightSplit] = useState(0);
  const [topSplit, setTopSplit] = useState(0);
  const [yCount, setYCount] = useState();
  const [columns, setColumns] = useState([
    {
      id: "name",
      header: "Name",
      sort: "string",
      fillspace: true,
      template: renderReactCell.bind(this, TableCell)
    },
    {
      id: "phone",
      header: "Phone",
      sort: "string",
      template: renderReactCell.bind(this, TableCell),
      adjust: true,
      adjustBatch: 10
    },
    {
      id: "count",
      sort: "int"
    }
  ]);

  const onItemClick = useCallback(() => {
    console.log(columns, "onItemClick test");
  }, [columns]);

  const onButtonClick = useCallback(() => {
    console.log(columns, "onClick test");
  }, [columns]);

  const config = {
    height: 500,
    data,
    columns,
    leftSplit,
    rightSplit,
    topSplit,
    yCount,
    tooltip: renderReactTooltip.bind(this, TableTooltip),
    onClick: {
      button: onButtonClick
    },
    on: {
      onItemClick
    }
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => setData(generateData())}>update data</button>
        <button
          onClick={() =>
            setColumns([
              {
                id: "name",
                header: "Name",
                fillspace: true,
                sort: "string",
                template: renderReactCell.bind(this, TableCell)
              },
              {
                id: "phone",
                header: "Phone",
                sort: "string",
                template: renderReactCell.bind(this, TableCell),
                adjust: true,
                adjustBatch: 10
              },
              ...new Array(20).fill().map((_, i) => ({
                id: "random_" + i,
                sort: "string",
                template: renderReactCell.bind(this, TableCell)
              }))
            ])
          }
        >
          update columns
        </button>
        <button onClick={() => setLeftSplit(2)}>update left split</button>
        <button onClick={() => setRightSplit(2)}>update right split</button>
        <button onClick={() => setTopSplit(2)}>update top split</button>
        <button onClick={() => setYCount(10)}>update yCount (10)</button>
        <button onClick={() => setYCount(80)}>update yCount (80)</button>
      </div>
      <Webix config={config} />
    </div>
  );
}

export default TableExample;
