import React from "react";
import { makeStyles, fade, darken } from "@material-ui/core/styles";
import { Webix } from "./react-webix";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.typography.body2,
    border: 0,
    "& .webix_ss_header": {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium
    },
    "& .webix_ss_header, .webix_ss_header TD, .webix_ss_vscroll_header, .webix_dd_drag_column": {
      backgroundColor: "transparent"
    },
    "& .webix_hcell": {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: "nowrap",
      padding: "0 16px"
    },
    "& .webix_ss_header td": {
      borderBottom: 0,
      borderRight: 0
    },
    "& .webix_ss_header td.webix_last_row": {
      borderBottom: 0
    },
    "& .webix_cell": {
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: "0 16px"
    },
    "& .webix_ss_left .webix_column.webix_last > div": {
      borderRightColor: darken(theme.palette.divider, 0.5)
    },
    "& .webix_ss_right .webix_column.webix_first > div": {
      borderLeftColor: darken(theme.palette.divider, 0.5)
    },
    "& div.webix_last_topcell": {
      borderBottomColor: darken(theme.palette.divider, 0.5)
    },
    '& .webix_cell[aria-expanded="true"]': {
      backgroundColor: fade(theme.palette.action.hover, 0.05)
    },
    '& .webix_cell[aria-level="2"]': {
      backgroundColor: fade(theme.palette.action.hover, 0.03)
    },
    "& div.webix_ss_vscroll_header": {
      border: 0
    }
  },
  hover: {
    backgroundColor: theme.palette.action.hover
  },
  "@global": {
    ".webix_tooltip": {
      backgroundColor: theme.palette.action.active,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.common.white,
      fontFamily: theme.typography.fontFamily,
      padding: "4px 8px",
      fontSize: theme.typography.pxToRem(10),
      maxWidth: 300,
      wordWrap: "break-word",
      fontWeight: theme.typography.fontWeightMedium,
      boxShadow: "none"
    }
  }
}));

function MaterialWebix(props) {
  const { dense, container: TableContainer = Paper, config, ...rest } = props;
  const classes = useStyles();

  const materialConfig = {
    css: classes.root,
    hover: classes.hover,
    rowHeight: dense ? 32 : 54,
    headerRowHeight: dense ? 36 : 56
  };

  return (
    <TableContainer style={{ overflow: "hidden" }}>
      <Webix config={{ ...materialConfig, ...config }} {...rest} />
    </TableContainer>
  );
}

export default MaterialWebix;
