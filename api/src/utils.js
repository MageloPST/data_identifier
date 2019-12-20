"use strict";
exports.__esModule = true;
exports.checkData = function (data, pattern) {
    var regex = new RegExp(pattern);
    return regex.test(data);
};
exports.parseJson = function (jsonData) {
    var allAttributes = new Array();
    // tslint:disable-next-line: forin
    for (var attribute in jsonData) {
        allAttributes.push(jsonData[attribute]);
    }
    return allAttributes;
};
exports.executePreviousFilters = function (data, constants) {
    // Previous filters
    // var _aux = false;
    var _aux = {};
    if (!isNaN(data)) {
        _aux['data'] = data;
        if (data > 0 && data < 100) {
            _aux['type'] = 'age';
        }
        else {
            _aux['type'] = 'number';
        }
        _aux['counts'] = 1;
        return _aux;
    }
    else {
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < constants.length; i++) {
            var values = constants[i]['value'];
            // tslint:disable-next-line: prefer-for-of
            for (var j = 0; j < values.length; j++) {
                if (data.toLowerCase() == values[j].toLowerCase()) {
                    _aux = {};
                    _aux['data'] = data;
                    _aux['type'] = constants[i]['type'];
                    // _aux['counts'] = 1;
                    // console.log(_aux);
                    return _aux;
                }
            }
        }
    }
    return false;
};
