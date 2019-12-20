const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "<CONNECTION_STRING>";
const DATABASE_NAME = "data_identifier";
const Utils = require('./utils');


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, constants, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        constants = database.collection("constants");
        collection = database.collection("patterns");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/check-pattern", async (request, response) => {
    var _body = request.body;
    if (Array.isArray(_body)) {
        return response.send('Split that fucking json file');
    } else {
        var values = Utils.parse_json(_body);

        var _values = await first_value_filter(values);
        var _match = _values['match'];
        var _next = _values['next'];
        var _others = await continue_value_filter(_next);

        response.send(_match.concat(_others));

    }
});

app.post("/say-hi", (request, response) => {
    response.send('hi');
});

async function first_value_filter(values) {
    var _next_values = [];
    var _matched_data = [];

    await constants.find({}).toArray((error, constants) => {
        if (error) {
            return false;
        }
        values.forEach(function (item, index) {
            var fixed_filters = Utils.execute_previous_filters(item, constants);
            console.log(fixed_filters);
            if (fixed_filters !== false) {
                _matched_data.push(fixed_filters);
            } else {
                _next_values.push(item);
            }
        });
    });

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                'match': _matched_data,
                'next': _next_values
            });
        }, 1000);
    });
}

async function continue_value_filter(values) {
    var _matched_data = [];

    await collection.find({}).toArray((error, regex_object) => {
        if (error) {
            return false;
        }
        values.forEach(function (item, index) {
            var _aux = {};
            _aux['data'] = item;
            regex_loop: for (let i=0; i<regex_object.length; i++) {
                var _regex = regex_object[i]['regular_expression'];
                var counts = 0;
                for (let j=0; j<_regex.length; j++) {
                    var match = Utils.check_data(item, _regex[j]);
                    if (match) {
                        counts = counts+1;
                        //_aux['regex'] = regex_object[i]['regular_expression'];
                        //_matched_data.push(_aux);
                        //break regex_loop;
                    }
                }
                if (counts > 0) {
                    _aux['type'] = regex_object[i]['type'];
                    //_aux['counts'] = counts;
                } else {
                    _aux['type'] = 'text';
                }
                //_matched_data.push(_aux);
            }
            _matched_data.push(_aux);
        });
    });

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(_matched_data);
        }, 1000);
    });

}
