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

import { ConfigContext } from "./config";
import { DataContext } from "./data";

const styles = theme => ({
  root: {
    minWidth: 50,
    maxWidth: 50
  }
});

class FilterMenu extends React.Component {
  state = {
    open: false,
    anchorEl: null
  };
  onClick = event =>
    this.setState({
      anchorEl: event.target,
      open: !this.state.open
    });
  handleChangeTab = (event, value) => {
    const { column, saveColumn } = this.props;
    const { uniqueValues } = this.dataContext;

    if (value === 0 || value === 1) {
      column.type = value;
    } else if (value === -1) {
      for (var v = 0; v < uniqueValues[column.id].length; v++) {
        let value = uniqueValues[column.id][v];
        if (_.includes(column.list, value)) {
          _.remove(column.list, v => v === value);
        } else {
          column.list.push(value);
        }
      }
    } else if (value === -2) {
      column.list = [];
    }

    saveColumn();
  };
  onClose = () => this.setState({ open: false });
  onCheck = value => () => {
    const { column, saveColumn } = this.props;

    const index = column.list.indexOf(value);

    if (index > -1) column.list.splice(index, 1);
    else column.list.push(value);

    saveColumn();
  };
  render() {
    const { column, classes } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <ConfigContext.Consumer>
        {configContext => {
          this.configContext = configContext;
          const { filtered, save } = configContext;

          return (
            <DataContext.Consumer>
              {dataContext => {
                this.dataContext = dataContext;
                const { uniqueValues } = dataContext;

                return (
                  <span>
                    <Button
                      size="small"
                      style={{
                        textTransform: "none",
                        minWidth: 30,
                        minHeight: 0,
                        padding: 0
                      }}
                      onClick={this.onClick}
                    >
                      <FilterList
                        color={
                          column.type === 0 && !column.list.length
                            ? "inherit"
                            : "secondary"
                        }
                      />
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={this.onClose}
                      PaperProps={{
                        style: {
                          maxHeight: 300,
                          width: 300
                        }
                      }}
                      MenuListProps={{
                        style: {
                          paddingTop: 0
                        }
                      }}
                    >
                      <Paper
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2
                        }}
                      >
                        <Tabs
                          value={column.type}
                          onChange={this.handleChangeTab}
                        >
                          <Tab
                            value={1}
                            icon={<Add />}
                            classes={{ root: classes.root }}
                          />
                          <Tab
                            value={0}
                            icon={<Remove />}
                            classes={{ root: classes.root }}
                          />
                          <Tab
                            value={-1}
                            icon={<Sync />}
                            classes={{ root: classes.root }}
                          />
                          <Tab
                            value={-2}
                            icon={<Clear />}
                            classes={{ root: classes.root }}
                          />
                        </Tabs>
                      </Paper>
                      {uniqueValues[column.id]
                        ? uniqueValues[column.id].map(value => (
                            <MenuItem key={`key-${value}`} dense={true}>
                              {value}
                              <ListItemSecondaryAction>
                                <Checkbox
                                  checked={_.includes(column.list, value)}
                                  onClick={this.onCheck(value)}
                                />
                              </ListItemSecondaryAction>
                            </MenuItem>
                          ))
                        : null}
                    </Menu>
                  </span>
                );
              }}
            </DataContext.Consumer>
          );
        }}
      </ConfigContext.Consumer>
    );
  }
}

export default withStyles(styles)(FilterMenu);
