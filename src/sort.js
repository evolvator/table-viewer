import React from 'react';

import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

import * as _ from 'lodash';

const SortableItem = SortableElement(
  ({ saveConfig, config: { sorted }, value }) => {
    return (
      <Button
        variant="outlined"
        size="small"
        style={{
          ...(value.desc
            ? {
                borderBottom: '3px #5f5f5f solid'
              }
            : {
                borderTop: '3px #5f5f5f solid'
              }),
          margin: 3,
          textTransform: 'none'
        }}
        onClick={event => {
          if (event.shiftKey && value.desc) {
            _.remove(sorted, sort => sort.id === value.id);
            saveConfig({ sorted });
          } else {
            saveConfig({
              sorted: _.map(sorted, sort => {
                if (sort.id === value.id) {
                  sort.desc = !sort.desc;
                }
                return sort;
              })
            });
          }
        }}
      >
        {value.id}
      </Button>
    );
  }
);

const SortableList = SortableContainer(props => {
  return (
    <div>
      {props.items.map((value, index) => (
        <SortableItem {...props} key={value.id} value={value} index={index} />
      ))}
    </div>
  );
});

class Sort extends React.Component {
  render() {
    const { config: { sorted }, saveConfig } = this.props;

    return (
      <div>
        <FormHelperText>
          Mouse draggable sorting. Shift click to delete. Shift click by column
          for adding.
        </FormHelperText>
        <SortableList
          {...this.props}
          items={sorted}
          axis="x"
          distance={3}
          onSortEnd={({ oldIndex, newIndex }) => {
            saveConfig({
              sorted: arrayMove(sorted, oldIndex, newIndex)
            });
          }}
        />
      </div>
    );
  }
}

export default Sort;
