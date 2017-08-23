const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const PDFSplit = require('./pdfsplit');

let win;
let pdfsplit = new PDFSplit();

function createWindow() {
	win = new BrowserWindow({width: 480, height: 380});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}));

	// Open the DevTools.
  // win.webContents.openDevTools()

	win.on('closed', () => {
		win = null;
	});
}

ipcMain.on('openPDF', (event, arg) => {
	dialog.showOpenDialog({
		filters: [
			{name: 'PDF', extensions: ['pdf']}
		]
	}, (files) => {
		if ('undefined' === typeof files) {
			console.log('No file is selected!');
			return;
		}
		pdfsplit.load(files[0]);
		// event.returnValue = files[0];
		event.sender.send('show-pdf-path', files[0]);
		// win.webContents.send('show-pdf-path', files[0]);
	});
});

ipcMain.on('setOutput', (event, arg) => {
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (directories) => {
		console.log('directory', directories)
		if ('undefined' === typeof directories) {
			console.log('No output folder is selected!');
			return;
		}
		pdfsplit.saveTo(directories[0]);
		event.sender.send('show-output-path', directories[0]);
	});
});

ipcMain.on('convert', (event, arg) => {
	pdfsplit.numPagesPerPDF = parseInt(arg.pages);
	pdfsplit.filenamePrefix = arg.prefix;
	pdfsplit.convert();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});