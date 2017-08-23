const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');
// require('bootstrap'); // error when using require bootstrap js

ipcRenderer.on('show-pdf-path', (event, arg) => {
	$('#pdf-to-convert').val(arg);
});

ipcRenderer.on('show-output-path', (event, arg) => {
	$('#output-directory').val(arg);
});

function openPDF() {
	ipcRenderer.send('openPDF');
}

function setOutput() {
	ipcRenderer.send('setOutput');
}

function convert() {
	let data = {
		pages: $('#pages-per-file').val(),
		prefix: $('#filename-prefix').val()
	}
	ipcRenderer.send('convert', data);
}