import './override-everything.css';
import { HeaderRowStyle, inputStyle, RowNumberStyle, RowStyle } from './customStyles';

export const headers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z'];

var cursor = null;

export const SheetRenderer = props => {
  const { className, columns } = props;

  return (
    <table className={className} style={{width: "50%", margin: "2%"}}>
      <thead className='data-header'>
        <tr>
          <th className='action-cell cell'>
          </th>
          {columns.map((column, i) => <th className='cell' style={{ ...HeaderRowStyle, width: column.width || `${100 / columns.length}%` }} key={i + 99}>{headers[i]}</th>)}
        </tr>
        <tr>
          <th style={RowNumberStyle} className='action-cell cell'>0</th>
          {columns.map(column => <th className='cell' style={{ ...HeaderRowStyle, width: column.width || `${100 / columns.length}%` }} key={column.label}>{column.label}</th>)}
        </tr>
      </thead>
      <tbody className='data-body'>
        {props.children}
      </tbody>
    </table>
  )
}

export const RowRenderer = props => {
  const {className, row} = props
  return (
    <tr className={className}>
      <td style={RowNumberStyle} className='action-cell cell'>
        {row + 1}
      </td>
      {props.children}
    </tr>
  )
}

export const CellRenderer = props => {
  const {
     cell, row, col, columns, attributesRenderer,
    editing, updated, style,
    ...rest
  } = props;

  var attributes = cell.attributes || {};
  attributes.style = { ...RowStyle, width: `${100 / columns.length}%`, wordBreak: "break-all" };
  if (col === 0) {
    attributes.title = cell.label;
  }

  return (
    <td {...rest} {...attributes}>
      {props.children}
    </td>
  );
}

export const DataEditor = (props) => {
  const isExpr = props.values[props.row][props.col]["expr"];
  const value = isExpr ? isExpr : props.values[props.row][props.col]["value"]; 
  return (
    <input
      value={value}
      onChange={(e) => {
        cursor = e.target.selectionStart;
        props.handleChange(e, props.row, props.col, isExpr ? "expression" : "value");
      }}
      onKeyDown={props.onKeyDown}
      className={props.className}
      onFocus={(e) => {
        e.target.selectionEnd = cursor ? cursor : e.target.selectionStart;
      }}
      style={inputStyle}
      autoFocus
    ></input>
  );
	};