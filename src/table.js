import React from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "@material-ui/core/Button";

import Paper from "@material-ui/core/Paper";

import FilterList from "@material-ui/icons/FilterList";

import TextField from "@material-ui/core/TextField";

import * as _ from "lodash";

class FilterComponent extends React.Component {
  state = {
    open: false,
    anchorEl: null
  };
  onClose = () => this.setState({ open: false });
  render() {
    const { anchorEl, open } = this.state;
    const { config: { filtered }, column, onChange, uniqueValues } = this.props;

    const filteredColumn = _.find(filtered, { id: column }) || {
      id: column,
      value: {
        allowed: [],
        regexp: ""
      }
    };
    if (!_.isObject(filteredColumn.value)) filteredColumn.value = {};
    if (!_.isArray(filteredColumn.value.allowed))
      filteredColumn.value.allowed = [];
    if (!_.isString(filteredColumn.value.regexp))
      filteredColumn.value.regexp = "";

    return (
      <span>
        <TextField
          value={filteredColumn.value.regexp}
          placeholder="regexp"
          onChange={event => {
            filteredColumn.value.regexp = event.target.value;
            onChange(filteredColumn.value);
          }}
          margin="dense"
          fullWidth
          style={{
            marginTop: 0
          }}
          InputProps={{
            startAdornment: (
              <Button
                size="small"
                style={{
                  textTransform: "none",
                  minWidth: 30,
                  minHeight: 0,
                  padding: 0
                }}
                onClick={event => {
                  this.setState({
                    anchorEl: event.target,
                    open: !open
                  });
                }}
              >
                <FilterList
                  color={
                    filteredColumn.value.allowed.length
                      ? "secondary"
                      : "default"
                  }
                />
              </Button>
            )
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={this.onClose}
          PaperProps={{
            style: {
              maxHeight: 200,
              width: 200
            }
          }}
          MenuListProps={{
            style: {
              paddingTop: 0
            }
          }}
        >
          <Paper
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2
            }}
          >
            <MenuItem
              onClick={() => {
                filteredColumn.value.allowed = [];
                onChange(filteredColumn.value);
              }}
            >
              Unselet all
            </MenuItem>
          </Paper>
          {uniqueValues[column].map(value => (
            <MenuItem
              key={`key-${value}`}
              selected={_.includes(filteredColumn.value.allowed, value)}
              dense={true}
              onClick={() => {
                const index = filteredColumn.value.allowed.indexOf(value);
                if (index > -1) filteredColumn.value.allowed.splice(index, 1);
                else filteredColumn.value.allowed.push(value);
                onChange(filteredColumn.value);
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

class Table extends React.Component {
  generateColumns = () => {
    const { config: { filtered }, columns, maxValues } = this.props;

    return columns.map(column => ({
      Header: () => <div>{column}</div>,
      accessor: column,
      filterMethod: (filter, row) => {
        return true;
      },
      filterMethod: (filter, row) => {
        if (filter.value) {
          if (filter.value.allowed && filter.value.allowed.length) {
            if (!_.includes(filter.value.allowed, row[filter.id])) return false;
          }
          if (filter.value.regexp) {
            try {
              if (!new RegExp(filter.value.regexp).test(row[filter.id]))
                return false;
            } catch (error) {}
          }
        }

        return true;
      },
      Filter: ({ filter, onChange }) => (
        <FilterComponent {...this.props} column={column} onChange={onChange} />
      ),
      Cell: row => {
        return (
          <div style={{ position: "relative" }}>
            <div
              style={{
                backgroundColor: "black",
                opacity: 0.1,
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${Math.round(
                  _.toNumber(row.value) / maxValues[column] * 100
                )}%`
              }}
            />
            {row.value}
          </div>
        );
      }
    }));
  };
  onSortedChange = sorted => {
    this.props.saveConfig({ sorted });
  };
  onFilteredChange = filtered => {
    this.props.saveConfig({ filtered });
  };
  render() {
    const { data } = this.props;
    const { config: { sorted, filtered } } = this.props;

    return (
      <ReactTable
        data={data}
        columns={this.generateColumns()}
        sorted={sorted}
        onSortedChange={this.onSortedChange}
        onFilteredChange={this.onFilteredChange}
        filtered={filtered}
        filterable
        defaultSortMethod={(a, b, desc) => {
          // force null and undefined to the bottom
          a = a === null || a === undefined ? -Infinity : a;
          b = b === null || b === undefined ? -Infinity : b;
          // convert to number if possible
          if (!_.isNaN(parseFloat(a)) && !_.isNaN(parseFloat(b))) {
            if (parseFloat(a) > parseFloat(b)) return 1;
            if (parseFloat(a) < parseFloat(b)) return -1;
          } else {
            // force any string values to lowercase
            a = typeof a === "string" ? a.toLowerCase() : a;
            b = typeof b === "string" ? b.toLowerCase() : b;
            // Return either 1 or -1 to indicate a sort priority
            if (a > b) return 1;
            if (a < b) return -1;
          }
          // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
          return 0;
        }}
      />
    );
  }
}

export default Table;
