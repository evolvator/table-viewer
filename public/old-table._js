import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import Grid from "@material-ui/core/Grid";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import FilterList from "@material-ui/icons/FilterList";

import ReactTable from "react-table";
import "react-table/react-table.css";

import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

import * as _ from "lodash";
import $ from "jquery";

var engine = require("store/src/store-engine");
var storages = [
  require("store/storages/localStorage"),
  require("store/storages/cookieStorage")
];
var plugins = [
  require("store/plugins/defaults"),
  require("store/plugins/expire")
];
var store = engine.createStore(storages, plugins);

const SortableItem = SortableElement(({ saveConfig, items, value }) => {
  return (
    <Button
      variant="outlined"
      size="small"
      style={{
        ...(value.desc
          ? {
              borderBottom: "3px #5f5f5f solid"
            }
          : {
              borderTop: "3px #5f5f5f solid"
            }),
        margin: 3,
        textTransform: "none"
      }}
      onClick={() => {
        console.log(value);
        saveConfig({
          sorted: _.map(items, sort => {
            if (sort.id === value.id) {
              sort.desc = !sort.desc;
            }
            return sort;
          })
        });
      }}
    >
      {value.id}
    </Button>
  );
});

const SortableList = SortableContainer(props => {
  return (
    <div>
      {props.items.map((value, index) => (
        <SortableItem key={value.id} value={value} index={index} {...props} />
      ))}
    </div>
  );
});

class FilterComponent extends React.Component {
  state = {
    open: false,
    anchorEl: null
  };
  onClose = () => this.setState({ open: false });
  render() {
    const { anchorEl, open } = this.state;
    const { config, column, uniqueValues } = this.props;
    const filtered = config.filtered || {};
    filtered[column] = filtered[column] || [];
    return (
      <span>
        <Button
          variant="outlined"
          size="small"
          style={{
            textTransform: "none",
            minWidth: 0
          }}
          onClick={event => {
            this.setState({
              anchorEl: event.target,
              open: !open
            });
          }}
        >
          <FilterList />
        </Button>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.onClose}
          PaperProps={{
            style: {
              maxHeight: 200,
              width: 200
            }
          }}
        >
          {uniqueValues.map(value => (
            <MenuItem
              key={`key-${value}`}
              selected={_.includes(filtered[column], value)}
              dense={true}
              onClick={() => {
                const index = filtered[column].indexOf(value);
                if (index > -1) {
                  filtered[column].splice(index, 1);
                } else {
                  filtered[column].push(value);
                }
                this.props.saveConfig({
                  filtered
                });
              }}
            >
              {value}
            </MenuItem>
          ))}
        </Menu>
      </span>
    );
  }
}

let timeout;
class Table extends React.Component {
  getDefaultState = () => ({
    data: [],
    columns: [],
    uniqueValues: {}
  });
  getConfig = (props = this.props) => {
    var urlConfig = {};
    try {
      urlConfig = JSON.parse(decodeURIComponent(props.match.params.config));
    } catch (error) {}
    return _.defaults(urlConfig, {
      path: "",
      filtered: {},
      sorted: []
    });
  };

  state = this.getDefaultState();

  componentDidUpdate(prevProps) {
    const prevConfig = this.getConfig(prevProps);
    const config = this.getConfig(this.props);
    if (prevConfig.path !== config.path) {
      this.setState(this.getDefaultState());
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.load();
      }, 500);
    }
  }
  componentDidMount() {
    const config = this.getConfig();
    this.props.history.push(
      "/" + encodeURIComponent(JSON.stringify(_.extend(config)))
    );
    this.load();
  }
  load() {
    const config = this.getConfig();
    const storedData = store.get(config.path);
    if (storedData) {
      this.saveData(storedData);
    } else {
      $.getJSON(config.path).done(data => {
        store.set(config.path, data);
        this.saveData(data);
      });
    }
  }
  saveData = data => {
    const results = {
      data,
      columns: _.uniq(_.flatten(_.map(data, value => _.keys(value)))),
      uniqueValues: {}
    };
    _.each(results.columns, column => {
      results.uniqueValues[column] = results.uniqueValues[column] || [];
      results.uniqueValues[column] = _.map(
        _.uniqBy(data, column),
        row => row[column]
      );
    });
    this.setState(results);
  };
  getConfig(props = this.props) {
    return _.defaults(
      JSON.parse(decodeURIComponent(props.match.params.config)),
      {}
    );
  }
  saveConfig = newConfig => {
    const config = this.getConfig();
    this.props.history.push(
      "/" + encodeURIComponent(JSON.stringify(_.extend(config, newConfig)))
    );
  };
  render() {
    const config = this.getConfig();
    const { data, columns, uniqueValues } = this.state;
    return (
      <Grid container>
        <Grid item xs={12} md={6} style={{ padding: 6 }}>
          <Card>
            <CardContent>
              <TextField
                id="with-placeholder"
                label="https url path to json file"
                placeholder="https url path to json file"
                value={config.path}
                onChange={event => {
                  this.saveConfig({ path: event.target.value });
                }}
                margin="dense"
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>
        {!data || !data.length ? null : (
          <Grid item xs={12} md={6} style={{ padding: 6 }}>
            <Card>
              <CardContent>
                <SortableList
                  items={config.sorted}
                  saveConfig={this.saveConfig}
                  axis="x"
                  distance={3}
                  onSortEnd={({ oldIndex, newIndex }) => {
                    this.saveConfig({
                      sorted: arrayMove(config.sorted, oldIndex, newIndex)
                    });
                  }}
                  config={config}
                />
                {JSON.stringify(config.filtered)}
              </CardContent>
            </Card>
          </Grid>
        )}
        {!data || !data.length ? null : (
          <Grid item xs={12}>
            <ReactTable
              data={data}
              columns={columns.map(column => ({
                Header: column,
                accessor: column,
                Filter: () => (
                  <FilterComponent
                    uniqueValues={uniqueValues[column]}
                    saveConfig={this.saveConfig}
                    config={config}
                    column={column}
                  />
                ),
                filterMethod: (filter, row) => {
                  console.log(config.filtered[column], filter, row);
                  if (config.filtered[column]) {
                    if (_.includes(config.filtered[column], row[column])) {
                      return false;
                    }
                  }
                  return true;
                }
              }))}
              pageSize={data.length}
              showPagination={false}
              filterable
              filtered={[]}
              onFilteredChange={filtered => {
                this.saveConfig({ filtered });
              }}
              sorted={config.sorted}
              onSortedChange={sorted => {
                this.saveConfig({ sorted });
              }}
            />
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withRouter(Table);
