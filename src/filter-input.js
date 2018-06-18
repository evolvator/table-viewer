import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import Button from "@material-ui/core/Button";

import Paper from "@material-ui/core/Paper";

import Checkbox from "@material-ui/core/Checkbox";

import FilterList from "@material-ui/icons/FilterList";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Clear from "@material-ui/icons/Clear";
import Sync from "@material-ui/icons/Sync";

import TextField from "@material-ui/core/TextField";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import * as _ from "lodash";

import FilterMenu from "./filter-menu";
import { ConfigContext } from "./config";
import { DataContext } from "./data";

class FilterInput extends React.Component {
  onRegexpChange = column => event => {
    column.regexp = event.target.value;
    console.log(column);
    this.saveColumn(column)();
  };
  saveColumn = column => () => {
    const { filtered, save } = this.configContext;
    if (!_.find(filtered, { id: column.id })) {
      filtered.push(column);
    }
    save({ filtered });
  };
  render() {
    const { columnId } = this.props;

    return (
      <ConfigContext.Consumer>
        {configContext => {
          const { filtered } = configContext;
          this.configContext = configContext;
          let column = _.find(filtered, { id: columnId });
          column = column || { id: columnId, list: [], type: 0, regexp: "" };

          return (
            <TextField
              value={column.regexp}
              placeholder="regexp"
              onChange={this.onRegexpChange(column)}
              margin="dense"
              fullWidth
              style={{
                marginTop: 0
              }}
              InputProps={{
                startAdornment: (
                  <FilterMenu
                    column={column}
                    saveColumn={this.saveColumn(column)}
                  />
                )
              }}
            />
          );
        }}
      </ConfigContext.Consumer>
    );
  }
}

export default FilterInput;
