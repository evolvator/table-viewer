import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import * as _ from "lodash";
window._ = _;

import $ from "jquery";
window.$ = $;

import ReactTable from "react-table";
import "react-table/react-table.css";

class Table extends React.Component {
  state = { data: [], columns: [] };
  componentDidMount() {
    console.log("componentDidMount");
    $.getJSON(decodeURIComponent(this.props.match.params.path), data => {
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
    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          defaultPageSize={100}
          filterable
          filtered={JSON.parse(
            decodeURIComponent(this.props.match.params.filter)
          )}
          sorted={JSON.parse(decodeURIComponent(this.props.match.params.sort))}
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
                  this.props.match.params.sort,
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
                  this.props.match.params.filter
                ].join("/")
            );
          }}
        />
      </div>
    );
  }
}

export default withRouter(Table);
