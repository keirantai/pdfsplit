let hummus = require('hummus');
let path = require('path');
let util = require('util');

module.exports = class PDFSplit {

	constructor() {
		this.numPagesPerPDF = 2; // default split every 2 pages into a new PDF file
		this.filenamePrefix = 'splitpdf';
		this.numPages = 0;
	}

	load(pdfFile) {
		this.sourceFile = pdfFile;
		this.numPages = 0;
		let loc = this;
		let reader = hummus.createReader(this.sourceFile);
		this.numPages = reader.getPagesCount();
	}

	saveTo(outputFolder) {
		this.outputFolder = outputFolder;
	}

	convert() {
		let numFiles = 1;
		for (let i = 0; i < this.numPages; i+=this.numPagesPerPDF) {
			let newfilename = this.filenamePrefix + util.format('_%d', numFiles) + '.pdf';
			let end = Math.min(this.numPages-1, i + this.numPagesPerPDF - 1);
			console.log('i,end', i, end);
			let pdfWriter = hummus.createWriter(path.join(this.outputFolder, newfilename));
			pdfWriter.appendPDFPagesFromPDF(this.sourceFile, {type: hummus.eRangeTypeSpecific, specificRanges: [ [i, end] ]});
			pdfWriter.end();
			numFiles++;
		}
	}

	convertTo(outputFolder) {
		this.saveTo(outputFolder);
		this.convert();
	}
}