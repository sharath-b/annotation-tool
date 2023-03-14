const pdf = require('pdf-to-text');

module.exports = filePath => new Promise(resolve => {
  pdf.pdfToText(filePath, (err, text) => {
    if (err) resolve(null);

    resolve(text);
  });
});
