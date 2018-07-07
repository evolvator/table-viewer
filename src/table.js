import React from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";

import * as _ from "lodash";

import { ConfigContext } from "./config";
import { DataContext } from "./data";
import FilterInput from "./filter-input";
import FilterMenu from "./filter-menu";

var pageSizes = [5, 10, 20, 25, 50, 100, 150, 200, 250, 300, 500];

class Table extends React.Component {
  generateColumns = columns => {
    const { maxValues } = this.dataContext;

    return _.filter(columns, column => !column.disabled).map(column => ({
      Header: () => <div>{column.id}</div>,
      accessor: column.id,
      filterMethod: (filter, row) => {
        return true;
      },
      Filter: ({ filter, onChange }) => <FilterInput columnId={column.id} />,
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
                  parseFloat(row.value) / maxValues[column.id] * 100
                )}%`
              }}
            />
            {row.value}
          </div>
        );
      }
    }));
  };
  render() {
    return (
      <ConfigContext.Consumer>
        {configContext => {
          this.configContext = configContext;
          const { columns, sorted, page, pageSize, save } = configContext;
          return (
            <DataContext.Consumer>
              {dataContext => {
                const { data, allColumns } = dataContext;
                this.dataContext = dataContext;
                return (
                  <span>
                    <ReactTable
                      data={data}
                      columns={this.generateColumns(columns)}
                      pageSizeOptions={pageSizes}
                      defaultPageSize={_.find(pageSizes, (size) => size >= data.length)}
                      onPageChange={page => save({ page })}
                      page={page}
                      onPageSizeChange={pageSize => save({ pageSize })}
                      pageSize={pageSize}
                      onSortedChange={sorted => save({ sorted })}
                      sorted={sorted}
                      onFilteredChange={filtered => save({ filtered })}
                      filterable
                      defaultSortMethod={(a, b, desc) => {
                        // force null and undefined to the bottom
                        a = a === null || a === undefined ? -Infinity : a;
                        b = b === null || b === undefined ? -Infinity : b;
                        // convert to number if possible
                        if (
                          !_.isNaN(parseFloat(a)) &&
                          !_.isNaN(parseFloat(b))
                        ) {
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
                  </span>
                );
              }}
            </DataContext.Consumer>
          );
        }}
      </ConfigContext.Consumer>
    );
  }
}

export default Table;
