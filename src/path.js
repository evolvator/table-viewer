import React from 'react';
import ReactTable from 'react-table';

import TextField from '@material-ui/core/TextField';

class Path extends React.Component {
  render() {
    const { config: { path }, saveConfig } = this.props;

    return (
      <TextField
        label="Path to json file, required https url."
        value={path}
        onChange={event => {
          saveConfig({ path: event.target.value });
        }}
        margin="dense"
        fullWidth
      />
    );
  }
}

export default Path;
