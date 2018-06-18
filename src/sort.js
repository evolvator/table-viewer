import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";

import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Clear from "@material-ui/icons/Clear";
import Sync from "@material-ui/icons/Sync";

import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";

import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

import * as _ from "lodash";

import { ConfigContext } from "./config";
import { DataContext } from "./data";

const SortableItem = SortableElement(
  ({ value: { id, desc }, onChange, onDelete }) => {
    return (
      <Paper>
        <MenuItem>
          {id}
          <ListItemSecondaryAction>
            <IconButton onClick={onChange}>
              {desc ? <ArrowDropDown /> : <ArrowDropUp />}
            </IconButton>
            <IconButton onClick={onDelete}>{<Clear />}</IconButton>
          </ListItemSecondaryAction>
        </MenuItem>
      </Paper>
    );
  }
);

const SortableList = SortableContainer(({ list, onChange, onDelete }) => {
  return (
    <List>
      {list.map((value, index) => (
        <SortableItem
          key={value.id}
          value={value}
          onDelete={onDelete(value)}
          onChange={onChange(value)}
          index={index}
        />
      ))}
    </List>
  );
});

const styles = theme => ({
  tabRoot: {
    minWidth: 50,
    textTranform: "none"
  },
  helper: {
    zIndex: 5000,
    listStyleType: "none"
  }
});

class Sort extends React.Component {
  onDelete = column => () => {
    _.remove(this.sorted, c => c.id === column.id);
    this.save({ sorted: this.sorted });
  };
  onChange = column => () => {
    column.desc = !column.desc;
    this.save({ sorted: this.sorted });
  };
  onAdd = columnName => () => {
    const { sorted } = this;
    sorted.push({ id: columnName, desc: true });
    this.save({ sorted });
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.save({ sorted: arrayMove(this.sorted, oldIndex, newIndex) });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <ConfigContext.Consumer>
          {({ sorted, save }) => {
            this.sorted = sorted;
            this.save = save;

            return (
              <DataContext.Consumer>
                {({ allColumns }) => {
                  this.allColumns = allColumns;

                  return (
                    <span>
                      <ListSubheader>Sorted:</ListSubheader>
                      <SortableList
                        distance={3}
                        axis="y"
                        lockAxis="y"
                        helperClass={classes.helper}
                        list={sorted}
                        onSortEnd={this.onSortEnd}
                        onChange={this.onChange}
                        onDelete={this.onDelete}
                      />
                      <Divider />
                      <ListSubheader>Not sorted:</ListSubheader>
                      <List>
                        {_.difference(allColumns, _.map(sorted, s => s.id)).map(
                          (value, index) => (
                            <MenuItem
                              key={value.id}
                              onClick={this.onAdd(value)}
                            >
                              {value}
                            </MenuItem>
                          )
                        )}
                      </List>
                    </span>
                  );
                }}
              </DataContext.Consumer>
            );
          }}
        </ConfigContext.Consumer>
      </div>
    );
  }
}

export default withStyles(styles)(Sort);
