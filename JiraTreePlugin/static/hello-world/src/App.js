/*import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import TableTree from '@atlaskit/table-tree';

type Content = { title: string; description: string };

type Item = {
  id: string;
  content: Content;
  hasChildren: boolean;
  children?: Item[];
};

const items: Item[] = [
  {
    id: 'item1',
    content: {
      title: 'Item 1',
      description: 'First top-level item',
    },
    hasChildren: false,
    children: [],
  },
  {
    id: 'item2',
    content: {
      title: 'Item 2',
      description: 'Second top-level item',
    },
    hasChildren: true,
    children: [
      {
        id: 'child2.1',
        content: {
          title: 'Child item',
          description: 'A child item',
        },
        hasChildren: false,
      },
    ],
  },
];

const Title = (props: Content) => <span>{props.title}</span>;
const Description = (props: Content) => <span>{props.description}</span>;

export default () => (
  <TableTree
    columns={[Title, Description]}
    headers={['Title', 'Description']}
    columnWidths={['120px', '300px']}
    items={items}
  />
);

//export default App;*/
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { TreeDataState, CustomTreeData} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn} from '@devexpress/dx-react-grid-material-ui';
import {  generateRows, defaultColumnValues } from './demo-data/generator';

const getChildRows = (row, rootRows) => (row ? row.items : rootRows);

export default () => {
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'city', title: 'City' },
    { name: 'car', title: 'Car' },
  ]);
  const [data] = useState(generateRows({
    columnValues: {
      ...defaultColumnValues,
      items: ({ random }) => (random() > 0.5
        ? generateRows({
          columnValues: {
            ...defaultColumnValues,
            items: () => (random() > 0.5
              ? generateRows({
                columnValues: {
                  ...defaultColumnValues,
                },
                length: Math.trunc(random() * 5) + 1,
                random,
              })
              : null),
          },
          length: Math.trunc(random() * 3) + 1,
          random,
        })
        : null),
    },
    length: 3,
  }));
  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: 300 },
  ]);

  return (
    <Paper>
      <Grid
        rows={data}
        columns={columns}
      >
        <TreeDataState />
        <CustomTreeData
          getChildRows={getChildRows}
        />
        <Table
          columnExtensions={tableColumnExtensions}
        />
        <TableHeaderRow />
        <TableTreeColumn
          for="name"
        />
      </Grid>
    </Paper>
  );
};