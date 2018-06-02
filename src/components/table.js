import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import * as _ from 'lodash';
import $ from 'jquery';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

let timeout;

class Table extends React.Component {
  state = { data: [], columns: [] };
  componentDidUpdate(prevProps) {
    const prevConfig = this.getConfig(prevProps);
    const config = this.getConfig(this.props);
    console.log(prevConfig, config);
    if (prevConfig.path !== config.path) {
      this.setState({
        data: [],
        columns: []
      });
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.getData();
      }, 500);
    }
  }
  componentDidMount() {
    const config = this.getConfig();
    this.props.history.push(
      '/' + encodeURIComponent(JSON.stringify(_.extend(config)))
    );
    this.getData();
  }
  getData() {
    const config = this.getConfig();
    this.setState({ data: [], columns: [] });
    $.getJSON(config.path).done(data => {
      this.setState({
        data,
        columns: _.map(
          _.uniq(_.flatten(_.map(data, value => _.keys(value)))),
          key => ({
            Header: key,
            accessor: key
          })
        )
      });
    });
  }
  getConfig(props = this.props) {
    return _.defaults(
      JSON.parse(decodeURIComponent(props.match.params.config)),
      {
        path: '',
        page: 0,
        count: 100,
        filtered: [],
        sorted: []
      }
    );
  }
  render() {
    const config = this.getConfig();
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 'calc(100% - 2px)',
          width: 'calc(100% - 2px)'
        }}
      >
        <Paper style={{ padding: 6 }}>
          <TextField
            id="with-placeholder"
            label="https url path to json file"
            placeholder="https url path to json file"
            value={config.path}
            onChange={event => {
              this.props.history.push(
                '/' +
                  encodeURIComponent(
                    JSON.stringify(
                      _.extend(config, { path: event.target.value })
                    )
                  )
              );
            }}
            margin="dense"
            fullWidth
          />
        </Paper>
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          page={config.page}
          pageSize={config.count}
          filterable
          filtered={config.filtered}
          sorted={config.sorted}
          style={{
            height: 'calc(100% - 80px)',
            width: '100%'
          }}
          onFilteredChange={filtered => {
            this.props.history.push(
              '/' +
                encodeURIComponent(
                  JSON.stringify(_.extend(config, { filtered }))
                )
            );
          }}
          onSortedChange={sorted => {
            this.props.history.push(
              '/' +
                encodeURIComponent(JSON.stringify(_.extend(config, { sorted })))
            );
          }}
          onPageChange={page => {
            this.props.history.push(
              '/' +
                encodeURIComponent(JSON.stringify(_.extend(config, { page })))
            );
          }}
          onPageSizeChange={count => {
            this.props.history.push(
              '/' +
                encodeURIComponent(JSON.stringify(_.extend(config, { count })))
            );
          }}
        />
      </div>
    );
  }
}

export default withRouter(Table);
