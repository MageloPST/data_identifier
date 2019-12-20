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
