// CSV database helper
// Requires csv-parse and csv-stringify (place in ./libs/)

const path = 'C:/Users/49765/Desktop/Neural craft lab/6.16 Metadata Project/database/sample_metadata.csv';

// wrappers for Node.js APIs
window.CSVDB = {
    readCSV: function(callback) {
        var fs = window.cep_node.require('fs');
        var parse = window.cep_node.require('./libs/csv-parse/sync');
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) return callback(err);
            try {
                var records = parse.parse(data, { columns: true });
                callback(null, records);
            } catch(e) {
                callback(e);
            }
        });
    },
    writeCSV: function(data, callback) {
        var fs = window.cep_node.require('fs');
        var stringify = window.cep_node.require('./libs/csv-stringify/sync');
        try {
            var csv = stringify.stringify(data, { header: true });
            fs.writeFile(path, csv, 'utf8', callback);
        } catch(e) {
            callback(e);
        }
    },
    openCSVFolder: function() {
        var shell = window.cep_node.require('child_process');
        shell.exec(`explorer.exe "${require('path').dirname(path)}"`);
    },
    getPath: function() { return path; }
};