import DataGrid from 'react-data-grid';
const columns = [
	{ key: 'id', name: 'ID' },
	{ key: 'title', name: 'Title' },
];

const rows = [
	{ id: 0, title: 'Example' },
	{ id: 1, title: 'Demo' },
];

function Temp() {
	return <DataGrid columns={columns} rows={rows} />;
}
export default Temp;
