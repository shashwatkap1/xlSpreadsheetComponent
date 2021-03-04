import { useState, createRef, useEffect } from 'react';
import {
	Button,
	Grid,
	TextField,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from '@material-ui/core';
import { HeaderRowStyle, RowNumberStyle, RowStyle, inputStyle } from './customStyles';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import { SettingsOverscanOutlined } from '@material-ui/icons';

function App() {
	const [category, setCategory] = useState('category1');
	const handleCategoryChange = () => {
		const temp = `${category === 'category1' ? 'category2' : 'category1'}`;
		console.log(temp);
		setCategory(temp);
		console.log(category);
	};
	const MyCategory = (props) => {
		const { category } = props;
		console.log(category, 'rereneres');
		return <h1>{category}</h1>;
	};

	const headerColums = [
		{ value: '  ' },
		{ value: 'Name' },
		{ value: 'ItemCode' },
		{
			value: 'Category',
		},
		{ value: 'Description' },
		{
			value: 'Volume',
		},
	];
	const initialGrid = [
		headerColums,
		[
			{ value: 1 },
			{ value: 'Italian Marble' },
			{ value: '#321' },
			{ value: category },
			{ value: 'Item exported from Italy vkkk lhlh lhlj lblkj' },
			{ value: 50 },
		],
	];

	const [grid, SetGrid] = useState(() => initialGrid);

	const onCellsChanged = (changes) => {
		console.log('cell changed');
		const tempgrid = grid;
		changes.forEach(({ cell, row, col, value }) => {
			tempgrid[row][col] = { ...tempgrid[row][col], value };
			console.log(tempgrid);
			SetGrid(tempgrid);
		});
	};

	const addRow = () => {
		handleClose();

		console.log(numofRows, 'row added');
		let arr = [...grid];
		const currRow = grid.length;
		const currColLength = grid[0].length;
		console.log(arr, 'before row');

		for (let i = 0; i < numofRows; i++) {
			let defaultArr = Array.apply(null, Array(currColLength)).map((u, i) => {
				return { value: '' };
			});
			arr.push(defaultArr);
		}
		arr = [...arr];
		console.log(arr, 'after add');
		SetGrid(arr);
	};

	console.log(grid, 'before col');
	const addCol = () => {
		const col_name = 'Unit';
		console.log('column added');
		const currcol = grid[0].length;
		let arr = grid.map((v) => [...v, { value: 67 }]);
		arr[0][currcol] = { value: 'Unit' };

		SetGrid(arr);
		console.log(grid, 'after col');
	};
	function handleSave() {
		console.log(grid);
	}
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const myCellRenderer = (props) => {
		if (props.row === 0 || props.col === 0) {
			const HeaderStyle = props.col === 0 ? RowNumberStyle : HeaderRowStyle;
			return (
				<td
					onContextMenu={props.onContextMenu}
					className={props.className + ''}
					style={HeaderStyle}
				>
					{props.children}
				</td>
			);
		} else {
			return (
				<td
					className={props.className}
					style={RowStyle}
					onContextMenu={props.onContextMenu}
					onMouseDown={props.onMouseDown}
					onDoubleClick={props.onDoubleClick}
					onMouseOver={props.onMouseOver}
				>
					{props.children}
				</td>
			);
		}
	};
	const [numofRows, setNumofRows] = useState(5);
	const RowsOnChange = (e) => {
		const val = e.target.value;

		setNumofRows(val);
		console.log(numofRows);
	};
	const [userColName, setUserColName] = useState('');
	const [userColDefaultVal, setUserColDefaultVal] = useState('');
	const [value, setvalue] = useState();

	const mydataEditor = (props) => {
		console.log(props, 'dataeditor');
		console.log(props.value);
		console.log(props.onChange);
		setvalue(props.value);
		const handleValueChange = (e) => {
			setvalue(e.target.value);
			console.log(value, 'vale');
		};
		return (
			// <input
			// 	value={props.value}
			// 	type='text'
			// 	multiple
			// 	rowspan='2'
			// 	onChange={props.onChange}
			// 	onKeyDown={props.onKeyDown}
			// 	onCommit={props.onCommit}
			// 	className={props.className}
			// 	style={inputStyle}
			// ></input>

			<TextField
				defaultValue={props.value}
				onKeyDown={props.onKeyDown}
				onChange={props.onChange}
				onDoubleClick={props.onDoubleClick}
				type='text'
				multiline
				fullWidth
				style={inputStyle}
				variant='outlined'
				className={props.className}
			/>
		);
	};

	return (
		<div style={{ margin: '30px' }}>
			<ReactDataSheet
				data={grid}
				valueRenderer={(cell) => cell.value}
				onCellsChanged={onCellsChanged}
				cellRenderer={myCellRenderer}
				dataEditor={mydataEditor}
			/>
			<Grid container justify='flex-start' spacing={5} style={{ marginTop: '10px' }}>
				<Grid item>
					<Button onClick={() => handleSave()} variant='contained'>
						Save
					</Button>
				</Grid>
				<Grid item>
					<div style={{ alignItems: 'center' }}>
						<Button onClick={handleClickOpen} color='primary' variant='contained'>
							Add Row
						</Button>
					</div>
				</Grid>
				<Grid item>
					<Button color='primary' variant='contained' onClick={addCol}>
						Add Col
					</Button>
				</Grid>
				<Grid item>
					<Button onClick={handleCategoryChange}>{category}</Button>
				</Grid>
			</Grid>
			<Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>Enter number of Rows</DialogTitle>
				<DialogContent>
					<TextField
						id='standard-number'
						autoFocus
						color='primary'
						defaultValue={5}
						label='Number'
						type='number'
						onChange={RowsOnChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={addRow} color='primary'>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default App;
