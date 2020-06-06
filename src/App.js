import React, { useState, Fragment } from "react";
import TableExample from "./datatable.example";
import MaterialTreeTableExample from "./material-treetable.example";
import "./style.css";

export default function App() {
  const [demo, setDemo] = useState('material');
  return (
    <div className="App">
      <button onClick={() => setDemo('material')}>Material UI</button>
      <button onClick={() => setDemo('plain')}>Plain</button>
      {
        demo === 'plain' && (
          <Fragment>
            <h2>Data Table Example</h2>
            <TableExample />
          </Fragment>
        )
      }

      {
        demo === 'material' && (
          <Fragment>
            <h2>Material Tree Table Example</h2>
            <p>Clicking on a row name column will open rows in the tree table.</p>

            <MaterialTreeTableExample />
          </Fragment>
        )
      }


    </div>
  );
}
