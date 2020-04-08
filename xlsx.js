const xlsx = require('xlsx');

module.exports = {
    parse_xlsx: (xlsx_file) => {
        let _book = xlsx.readFile(xlsx_file);
        let _sheet_names = _book.SheetNames;
        let _sheet = _book.Sheets[_sheet_names[0]];
        let _json = xlsx.utils.sheet_to_json(_sheet);
        return _json;
    }
}