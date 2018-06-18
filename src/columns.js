import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

import * as _ from "lodash";

import { DataContext } from "./data";
import { ConfigContext } from "./config";

const SortableItem = SortableElement(({ value: { id, disabled }, onClick }) => {
  return (
    <Paper>
      <ListItem>
        {id}
        <ListItemSecondaryAction>
          <Checkbox checked={!disabled} onClick={onClick} />
        </ListItemSecondaryAction>
      </ListItem>
    </Paper>
  );
});

const SortableList = SortableContainer(({ list, onClick }) => {
  return (
    <List>
      {list.map((value, index) => (
        <SortableItem
          key={value.id}
          value={value}
          onClick={onClick(value.id)}
          index={index}
        />
      ))}
    </List>
  );
});

const styles = theme => ({
  helper: {
    zIndex: 5000,
    listStyleType: "none"
  }
});

class Columns extends React.Component {
  onClick = columnName => ({ target: { checked } }) => {
    const { columns } = this;
    const column = _.find(columns, { id: columnName });
    if (column) {
      if (checked) delete column.disabled;
      else column.disabled = true;
    } else {
      columns.push({ id: columnName, disabled: !checked });
    }
    this.save({ columns });
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.save({ columns: arrayMove(this.columns, oldIndex, newIndex) });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <ConfigContext.Consumer>
          {({ columns, save }) => {
            this.columns = columns;
            this.save = save;

            return (
              <DataContext.Consumer>
                {({ allColumns }) => {
                  this.allColumns = allColumns;

                  return (
                    <SortableList
                      distance={3}
                      axis="y"
                      lockAxis="y"
                      helperClass={classes.helper}
                      list={columns}
                      onSortEnd={this.onSortEnd}
                      onClick={this.onClick}
                    />
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

export default withStyles(styles)(Columns);
