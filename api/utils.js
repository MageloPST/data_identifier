module.exports.check_data = function (data, pattern) {
    var regex = new RegExp(pattern);
    return regex.test(data);
};

module.exports.parse_json = function (json_data) {
    var all_attributes = new Array();
    for (var attribute in json_data) {
        all_attributes.push(json_data[attribute]);
    }
    return all_attributes;
};

module.exports.execute_previous_filters = function (data, constants) {
    // Previous filters
    //var _aux = false;
    if (!isNaN(data)) {
        var _aux = {};
        _aux['data'] = data;
        if (data > 0 && data < 100) {
            _aux['type'] = 'age';
        } else {
            _aux['type'] = 'number';
        }
        _aux['counts'] = 1;
        return _aux;
    } else {
        for (let i=0; i<constants.length; i++) {
            var values = constants[i]['value'];
            for (let j=0; j<values.length; j++) {
                if (data.toLowerCase() == values[j].toLowerCase()) {
                    _aux = {};
                    _aux['data'] = data;
                    _aux['type'] = constants[i]['type'];
                    //_aux['counts'] = 1;
                    //console.log(_aux);
                    return _aux;
                }
            }
        }
    }
    return false;
};
