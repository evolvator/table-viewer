import React from "react";

import { ConfigContext } from "./config";
import { DataContext } from "./data";

import TextField from "@material-ui/core/TextField";

import isUrl from "is-url";

class Path extends React.Component {
  state = {
    valid: true
  };
  render() {
    const { valid } = this.state;

    return (
      <ConfigContext.Consumer>
        {({ path, save }) => (
          <DataContext.Consumer>
            {({ loading }) => (
              <TextField
                label="Path to json file, required https url."
                error={!valid || loading === -1}
                value={path}
                onChange={event => {
                  const { target: { value } } = event;
                  save({ path: event.target.value });
                  this.setState({ valid: !value || isUrl(value) });
                }}
                margin="dense"
                fullWidth
              />
            )}
          </DataContext.Consumer>
        )}
      </ConfigContext.Consumer>
    );
  }
}

export default Path;
