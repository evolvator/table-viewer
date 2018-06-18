import React from "react";

import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import LinearProgress from "@material-ui/core/LinearProgress";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import * as _ from "lodash";
import $ from "jquery";

import Config, { ConfigContext } from "./config";
import Data, { DataContext } from "./data";
import Path from "./path";
import LeftDrawer from "./left-drawer";
import Table from "./table";

const styles = theme => ({
  appBar: {
    backgroundColor: "white"
  },
  leftDrawerOpenedPaper: {
    width: 300
  },
  toolbarPlaceholder: {
    ...theme.mixins.toolbar
  },
  progress: {
    position: "absolute",
    top: 0,
    width: "100%"
  }
});

class Page extends React.Component {
  state = {
    leftDrawerOpened: false
  };
  toggleLeftDrawer = event =>
    this.setState({ leftDrawerOpened: !this.state.leftDrawerOpened });
  render() {
    const { classes } = this.props;
    const { leftDrawerOpened } = this.state;

    return (
      <div>
        <Config>
          <Data>
            <AppBar color="default" classes={{ root: classes.appBar }}>
              <Toolbar>
                <IconButton
                  aria-label="open drawer"
                  onClick={this.toggleLeftDrawer}
                >
                  <MenuIcon />
                </IconButton>
                <Path />
              </Toolbar>
              <DataContext.Consumer>
                {({ loading, loaded, broken }) => (
                  <LinearProgress
                    className={classes.progress}
                    variant={loading === 1 ? "query" : "determinate"}
                    value={loading === 2 || loaded === -1 ? 100 : 0}
                    color={loading === -1 ? "secondary" : "primary"}
                  />
                )}
              </DataContext.Consumer>
            </AppBar>
            <Drawer
              open={leftDrawerOpened}
              anchor="left"
              classes={{ paper: classes.leftDrawerOpenedPaper }}
              onClose={this.toggleLeftDrawer}
            >
              <LeftDrawer />
            </Drawer>
            <div>
              <div className={classes.toolbarPlaceholder} />
              <Table />
            </div>
          </Data>
        </Config>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Page));
