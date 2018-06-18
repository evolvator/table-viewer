import React from "react";

import { withRouter } from "react-router";

import * as _ from "lodash";

export const defaultConfig = {
  path: "",
  columns: [],
  filtered: [],
  sorted: [],
  page: 0,
  pageSize: 50
};

export const ConfigContext = React.createContext(defaultConfig);

class Config extends React.Component {
  defaultState = defaultConfig;
  parse = () => {
    let newConfig = {};
    try {
      newConfig = JSON.parse(
        decodeURIComponent(this.props.match.params.config)
      );
    } catch (error) {}
    return _.extend(this.defaultState, newConfig);
  };
  state = this.parse();
  save = newConfig => {
    const { history } = this.props;

    history.push(
      `/${encodeURIComponent(JSON.stringify(_.extend(this.state, newConfig)))}`
    );
  };
  render() {
    const { children } = this.props;

    const config = {
      ...this.state,
      save: this.save
    };

    return (
      <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
    );
  }
}

export default withRouter(Config);
