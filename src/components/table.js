import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import * as _ from "lodash";
import $ from "jquery";

import ReactTable from "react-table";
import "react-table/react-table.css";

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
    const filtered = this.props.match.params.filtered
      ? JSON.parse(decodeURIComponent(this.props.match.params.filtered))
      : [];
    const sorted = this.props.match.params.sorted
      ? JSON.parse(decodeURIComponent(this.props.match.params.sorted))
      : [];
    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          defaultPageSize={100}
          filterable
          filtered={filtered}
          sorted={sorted}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "calc(100% - 5px)",
            width: "calc(100% - 5px)"
          }}
          onFilteredChange={filtered => {
            this.props.history.push(
              "/" +
                [
                  this.props.match.params.path,
                  this.props.match.params.sorted,
                  encodeURIComponent(JSON.stringify(filtered))
                ].join("/")
            );
          }}
          onSortedChange={sorted => {
            this.props.history.push(
              "/" +
                [
                  this.props.match.params.path,
                  encodeURIComponent(JSON.stringify(sorted)),
                  this.props.match.params.filtered
                ].join("/")
            );
          }}
        />
      </div>
    );
  }
}

export default withRouter(Table);
