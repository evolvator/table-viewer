import React from "react";

import { withRouter } from "react-router";

import * as _ from "lodash";
import isUrl from "is-url";
import $ from "jquery";

import { ConfigContext } from "./config";

export const defaultContext = {
  path: "",
  loading: 0,
  data: [],
  allColumns: [],
  uniqueValues: {}
};

export const DataContext = React.createContext(defaultContext);

class Data extends React.Component {
  defaultState = defaultContext;
  state = _.clone(this.defaultState);
  filterData = fetchedData => {
    const { columns, filtered } = this.configContext;

    const allColumns = _.uniq(
      _.flatten(_.map(fetchedData, value => _.keys(value)))
    );

    const maxValues = {};
    const data = _.filter(fetchedData, row => {
      for (var f = 0; f < filtered.length; f++) {
        let filter = filtered[f];
        if (filter) {
          if (filter.list) {
            if (filter.type === 1) {
              if (!_.includes(filter.list, row[filter.id])) return false;
            }
            if (!filter.type) {
              if (_.includes(filter.list, row[filter.id])) return false;
            }
          }
          if (filter.regexp) {
            try {
              if (!new RegExp(filter.regexp).test(row[filter.id])) return false;
            } catch (error) {}
          }
        }
      }

      for (let c = 0; c < allColumns.length; c++) {
        maxValues[allColumns[c]] = maxValues[allColumns[c]] || 0;
        let value = parseFloat(row[allColumns[c]]);
        if (
          !_.isNumber(maxValues[allColumns[c]]) ||
          maxValues[allColumns[c]] < value
        ) {
          maxValues[allColumns[c]] = value;
        }
      }

      return true;
    });

    return { data, maxValues, allColumns };
  };
  parseJSONArray = fetchedData => {
    const { save, columns, filtered, sorted } = this.configContext;
    const { data, maxValues, allColumns } = this.filterData(fetchedData);

    const uniqueValues = {};
    _.each(allColumns, column => {
      uniqueValues[column] = uniqueValues[column] || [];
      uniqueValues[column] = _.map(
        _.uniqBy(fetchedData, column),
        row => row[column]
      );
    });

    this.setState({
      fetchedData,
      data,
      allColumns,
      loading: 2,
      uniqueValues,
      maxValues
    });

    const newColumns = _.difference(allColumns, _.map(columns, c => c.id));
    const oldColumns = _.difference(_.map(columns, c => c.id), allColumns);

    _.each(newColumns, columnName => columns.push({ id: columnName }));
    _.each(oldColumns, columnName =>
      _.remove(columns, ({ id }) => id === columnName)
    );

    const oldFiltered = _.difference(_.map(filtered, c => c.id), allColumns);

    _.each(oldFiltered, columnName =>
      _.remove(filtered, ({ id }) => id === columnName)
    );

    const oldSorted = _.difference(_.map(sorted, c => c.id), allColumns);

    _.each(oldSorted, columnName =>
      _.remove(sorted, ({ id }) => id === columnName)
    );

    save({ columns, filtered, sorted });
  };
  pathChanged = path => {
    setTimeout(() => {
      if (path !== this.state.path) {
        this.setState(_.extend({}, defaultContext, { path }));
        if (path && isUrl(path)) {
          clearTimeout(this.timeout);
          setTimeout(() => {
            this.setState({ path, loading: 1 });
            setTimeout(() => {
              $.getJSON(path)
                .done(data => {
                  if (path === this.state.path) {
                    if (_.isArray(data)) {
                      this.parseJSONArray(data);
                    } else {
                      this.setState({ loading: -1 });
                    }
                  }
                })
                .fail(() => {
                  this.setState({ loading: -1 });
                });
            }, 500);
          }, 500);
        }
      }
    }, 1);
  };
  render() {
    const { children } = this.props;

    const data = {
      ...this.state
    };

    return (
      <ConfigContext.Consumer>
        {configContext => {
          if (
            this.oldFiltered &&
            !_.isEqual(this.oldFiltered, configContext.filtered)
          ) {
            this.setState(this.filterData(this.state.fetchedData));
          }
          this.oldFiltered = _.cloneDeep(configContext.filtered);
          this.configContext = configContext;
          const { path, save } = configContext;
          this.pathChanged(path);
          this.save = save;
          return (
            <DataContext.Provider value={data}>{children}</DataContext.Provider>
          );
        }}
      </ConfigContext.Consumer>
    );
  }
}

export default withRouter(Data);
