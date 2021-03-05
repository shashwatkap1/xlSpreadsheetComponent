import _ from 'lodash';
import React, { useState } from 'react';
import Datasheet from './lib/DataSheet';
import 'react-datasheet/lib/react-datasheet.css';
import * as mathjs from 'mathjs';
import { CellRenderer, RowRenderer, SheetRenderer, DataEditor, headers } from "./Renderer";
import { Button } from "@material-ui/core";


export default function MainSheet(props) {

  const [state, setState] = useState({
    columns: [
      { label: 'Style', width: '30%' },
      { label: 'IBUs', width: '20%' },
      { label: 'Color (SRM)', width: '20%' },
      { label: 'Rating', width: '20%' }
    ],
    grid: [
      [{ value: 'Ordinary Bitter' }, { value: '20 - 35' }, { value: '5 - 12' }, { value: 4, attributes: { 'data-foo': 'bar' } }],
      [{ value: 'Special Bitter' }, { value: '28 - 40' }, { value: '6 - 14' }, { value: 4 }],
      [{ value: 'ESB' }, { value: '30 - 45' }, { value: '6 - 14' }, { value: 5 }],
      [{ value: 'Scottish Light' }, { value: '9 - 20' }, { value: '6 - 15' }, { value: 3 }],
      [{ value: 'Scottish Heavy' }, { value: '12 - 20' }, { value: '8 - 30' }, { value: 4 }],
      [{ value: 'Scottish Export' }, { value: '15 - 25' }, { value: '9 - 19' }, { value: 4 }],
      [{ value: 'English Summer Ale' }, { value: '20 - 30' }, { value: '3 - 7' }, { value: 3 }],
      [{ value: 'English Pale Ale' }, { value: '20 - 40' }, { value: '5 - 12' }, { value: 4 }],
      [{ value: 'English IPA' }, { value: '35 - 63' }, { value: '6 - 14' }, { value: 4 }],
      [{ value: 'Strong Ale' }, { value: '30 - 65' }, { value: '8 - 21' }, { value: 4 }],
      [{ value: 'Old Ale' }, { value: '30 -65' }, { value: '12 - 30' }, { value: 4 }],
      [{ value: 'Pale Mild Ale' }, { value: '10 - 20' }, { value: '6 - 9' }, { value: 3 }],
      [{ value: 'Dark Mild Ale' }, { value: '10 - 24' }, { value: '17 - 34' }, { value: 3 }],
      [{ value: 'Brown Ale' }, { value: '12 - 25' }, { value: '12 - 17' }, { value: 3 }]
    ]
  });

  function computeExpr(expr, scope) {
    let value = null;
    if (expr.charAt(0) !== '=') {
      return { value: expr, expr: expr };
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope)
      } catch (e) {
        value = null
      }

      if (value !== null) {
        return { value, expr }
      } else {
        return { value: 'error', expr: expr }
      }
    }
  }

  const generateScope = (data) => {
    var grid = {};
    for (var row = 1; row <= data.length; row++) {
      for (var col = 0; col < data[row - 1].length; col++) {
        grid[`${headers[col]}${row}`] = data[row - 1][col]["value"];
      }
    }
    return grid;
  }

  function cellUpdate(state, changeCell, expr, row, col) {
    var temp = [...state];
    if (expr) {
      const scope = generateScope(state);
      const updatedCell = _.assign({}, changeCell, computeExpr(expr, scope));
      temp[row][col] = {
        ...updatedCell, _update: false
      };
    }
    /*_.each(state, (cell, key) => {
      if (cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
        state = this.cellUpdate(state, cell, cell.expr)
      }
    })*/
    return temp
  }

  const valueRenderer = cell => cell.value;
  const onCellsChanged = changes => {
    var grid = state.grid;
    changes.forEach(({ cell, row, col, value }) => {
      grid[row][col] = {
        ...grid[row][col], value: grid[row][col]["_update"] ? cell["value"] : value, _update: false
      }
      grid = cellUpdate(grid, cell, cell["_update"] ? cell["value"] : value, row, col);
    });
    setState({...state, grid: grid });
  };


  const onContextMenu = (e, cell, i, j) =>
    cell.readOnly ? e.preventDefault() : null;

  const handleChange = (e, row, col, type) => {
    var grid = state.grid;
    if (type === "expression")
      grid[row][col] = { ...grid[row][col], value: e.target.value, expr: e.target.value, _update: true };
    else
      grid[row][col] = { ...grid[row][col], value: e.target.value, _update: true };
    setState({ ...state, grid: grid });
  }

  const addRow = () => {
    var grid = state.grid;
    var arr = [];
    for (var i in grid[0])
      arr = arr.concat({ value: "" });
    grid = grid.concat([arr]);
    setState({ ...state, grid: grid });
  }


  return (
      <React.Fragment>
      <Datasheet
        data={state.grid}
        valueRenderer={valueRenderer}
        onContextMenu={onContextMenu}
        onCellsChanged={onCellsChanged}
        cellRenderer={(props) => <CellRenderer columns={state.columns} {...props} />}
        rowRenderer={props => <RowRenderer className='data-row' {...props} />}
        sheetRenderer={props => <SheetRenderer columns={state.columns} {...props} />}
        dataEditor={props => <DataEditor values={state.grid} handleChange={handleChange} {...props} />}
      />
      <Button style={{ marginLeft: "2%" }} onClick={addRow} startIcon="+" variant="contained" color="primary">Add Row</Button>
    </React.Fragment>
      );
}