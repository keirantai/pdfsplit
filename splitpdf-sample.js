var extract = require('pdf-text-extract');
    var hummus = require('hummus');
    var path = require('path');
    var fs = require('fs');
    var readline = require('readline');

    var sourcePDF = path.join(__dirname, 'source.pdf');
    var outputFolder = path.join(__dirname, '/output');
    var employees = [];

    //delete any files that already exist in the output folder
    fs.readdirSync(outputFolder).filter((file) => {
      fs.unlinkSync(path.join(outputFolder, file));
    });

    /*
    Need to load up employee SSNs pulled out of the payroll system.
    Each line in the file is in the following format: LastName,FirstName,MI,EmployeeID,SSN
    */
    var lineReader = readline.createInterface({
      input: fs.createReadStream('employees.txt')
    });

    lineReader.on('line', (line) => {
      employees.push(line);
    });

    lineReader.on('close', () => {
      /*
      Now that all employees are loaded into the employees[] array, we can begin breaking apart
      the source PDF to make it easier to search. The pdf-text-extract package will
      load each page of the PDF into an array item.
      */
      extract(sourcePDF, (err, pages) => {  //pages will be an array of strings. Each item corresponds to a page in the PDF
        if (err) console.log(err);

        /*
        We can now run through the employees[] array, and for each employee we'll look for a matching
        ssn in the pages[] array created by the extract() function.
        */
        employees.map(emp => {
          let ssn = emp.split(',')[4];

          //use a for-loop to make it easier to break out after a match is found
          for (let i = 0; i < pages.length; i++) {
            if (pages[i].indexOf(ssn) !== -1) { //found it!
              /*
              Now use the hummus package to pull that page out into it's own document. We'll use
              the employee ssn as the document name for now.
              */
              var pdfWriter = hummus.createWriter(path.join(outputFolder, `${ssn}.pdf`));
              pdfWriter.appendPDFPagesFromPDF(sourcePDF, {type:hummus.eRangeTypeSpecific,specificRanges: [ [ i,i ] ]});
              pdfWriter.end();
              break; //no need to keep searching
            }
          }
        });
      });
    });