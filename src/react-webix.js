import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import * as webix from "webix";
import isEqual from "lodash/isEqual";
import compose from "lodash/fp/compose";

const defaultConfig = {
  view: "datatable"
};

export class Webix extends React.Component {
  setWebixRef = ref => (this.webixRef = ref);

  componentDidMount() {
    const { config, onReady } = this.props;

    if (config) {
      this.instance = webix.ui({ ...defaultConfig, ...config }, this.webixRef);
      onReady && onReady(this.instance);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { config: nextConfig } = nextProps;
    const { config } = this.props;
    const prevState = this.instance.getState();

    const dataChanged = state => {
      if (!isEqual(config.data, nextConfig.data)) {
        this.instance.clearAll(true);
        this.instance.parse(nextConfig.data);
      }
      return state;
    };

    const columnPropsChanged = state => {
      ["columns", "leftSplit", "rightSplit", "topSplit"].forEach(prop => {
        if (!isEqual(config[prop], nextConfig[prop])) {
          this.instance.define(prop, nextConfig[prop]);
          this.instance.refreshColumns();
        }
      });
      return this.instance.getState();
    };

    const generalPropsChanged = state => {
      ["yCount"].forEach(prop => {
        if (!isEqual(config[prop], nextConfig[prop])) {
          this.instance.define(prop, nextConfig[prop]);
          this.instance.refresh();
        }
      });
      return state;
    };

    // will be used to set the webix state after the set of update function will occuor.
    // it will make sure that sort will stick with new data and scroll position will retain
    // along with other webix state
    const setState = state => {
      console.log(state);
      this.instance.setState(state);
    };

    // detach old events and attach new ones as their reference changed
    const updateOnEvents = () => {
      if (config.on) {
        Object.keys(config.on).forEach(eventKey =>
          this.instance.detachEvent(eventKey)
        );
      }
      if (nextConfig.on) {
        Object.entries(nextConfig.on).forEach(([eventKey, fn]) =>
          this.instance.attachEvent(eventKey, fn)
        );
      }
    };

    // detach old events and attach new ones as their reference changed
    const updateOnClickEvents = () => {
      if (config.onClick) {
        this.instance.on_click = null;
      }
      if (nextConfig.onClick) {
        this.instance.on_click = nextConfig.onClick;
      }
    };

    compose(
      [dataChanged, columnPropsChanged, generalPropsChanged, setState].reverse()
    )(prevState);
    updateOnEvents();
    updateOnClickEvents();

    // webix component shoun't be (react) rendered as it will destroy it's state
    return false;
  }

  render() {
    return <div ref={this.setWebixRef} />;
  }
}

// helper function to render stateful component as table cell
// we first render an empty DOM element with a unique ID and then render react with this container element.
// it creates a flash when webix rernder happens right now. there might be a better approach here
export const renderStatefulCell = (
  CellComponent,
  tableRef,
  row,
  common,
  value,
  config
) => {
  const id = "react_cell_" + webix.uid();
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(<div id={id}><CellComponent
    tableRef={tableRef.current}
    row={row}
    common={common}
    value={value}
    config={config}
  /></div>);

  setTimeout(() => {
    const container = document.getElementById(id);
    if (container) {
      ReactDOM.render(
        <div id={id}>
          <CellComponent
            tableRef={tableRef.current}
            row={row}
            common={common}
            value={value}
            config={config}
          />
        </div>,
        container
      );
    }
  });

  return staticMarkup;
};

// helper function to render JSX as table cell
export function renderReactCell(CellComponent, row, common, value, config) {
  return ReactDOMServer.renderToStaticMarkup(
    <CellComponent row={row} common={common} value={value} config={config} />
  );
}

// helper function to render JSX as table tooltip
export function renderReactTooltip(TooltipComponent, row, common) {
  return ReactDOMServer.renderToStaticMarkup(
    <TooltipComponent row={row} column={common.column} />
  );
}
