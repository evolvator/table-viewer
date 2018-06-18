import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { DataContext } from "./data";
import Sort from "./sort";
import Columns from "./columns";

const styles = theme => ({
  tabRoot: {
    minWidth: 50
  }
});

class LeftDrawer extends React.Component {
  state = {
    value: "sort"
  };
  onChange = (event, value) => this.setState({ value });
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Paper
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2
          }}
        >
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            onChange={this.onChange}
            fullWidth
          >
            <Tab
              value="sort"
              label="sort"
              classes={{ root: classes.tabRoot }}
            />
            <Tab
              value="columns"
              label="columns"
              classes={{ root: classes.tabRoot }}
            />
          </Tabs>
        </Paper>
        {value === "sort" ? <Sort /> : value === "columns" ? <Columns /> : null}
      </div>
    );
  }
}

export default withStyles(styles)(LeftDrawer);
