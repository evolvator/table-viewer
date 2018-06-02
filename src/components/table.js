import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import * as _ from 'lodash';
import $ from 'jquery';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends React.Component {
  state = { data: [], columns: [] };
  componentDidMount() {
    const path = decodeURIComponent(this.props.match.params.path);
    $.getJSON(decodeURIComponent(this.props.match.params.path)).done(data => {
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
  render() {
    const path = this.props.match.params.path;
    const page = parseFloat(this.props.match.params.page || 1);
    const count = parseFloat(this.props.match.params.count || 100);
    let filtered = [],
      sorted = [];
    if (this.props.match.params.filtered) {
      filtered = this.props.match.params.filtered
        ? JSON.parse(decodeURIComponent(this.props.match.params.filtered))
        : [];
    }
    if (this.props.match.params.sorted) {
      sorted = this.props.match.params.sorted
        ? JSON.parse(decodeURIComponent(this.props.match.params.sorted))
        : [];
    }
    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          page={page}
          pageSize={count}
          filterable
          filtered={filtered}
          sorted={sorted}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 'calc(100% - 5px)',
            width: 'calc(100% - 5px)'
          }}
          onFilteredChange={filtered => {
            this.props.history.push(
              '/' +
                [
                  path,
                  page,
                  count,
                  encodeURIComponent(JSON.stringify(sorted)),
                  encodeURIComponent(JSON.stringify(filtered))
                ].join('/')
            );
          }}
          onSortedChange={sorted => {
            this.props.history.push(
              '/' +
                [
                  path,
                  page,
                  count,
                  encodeURIComponent(JSON.stringify(sorted)),
                  encodeURIComponent(JSON.stringify(filtered))
                ].join('/')
            );
          }}
          onPageChange={page => {
            this.props.history.push(
              '/' +
                [
                  path,
                  page,
                  count,
                  encodeURIComponent(JSON.stringify(sorted)),
                  encodeURIComponent(JSON.stringify(filtered))
                ].join('/')
            );
          }}
          onPageSizeChange={count => {
            this.props.history.push(
              '/' +
                [
                  path,
                  page,
                  count,
                  encodeURIComponent(JSON.stringify(sorted)),
                  encodeURIComponent(JSON.stringify(filtered))
                ].join('/')
            );
          }}
        />
      </div>
    );
  }
}

export default withRouter(Table);
