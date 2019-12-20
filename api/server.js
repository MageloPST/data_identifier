"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var BodyParser = require("body-parser");
var express = require("express");
var mongodb_1 = require("mongodb");
var utils_1 = require("./src/utils");
var PORT = 80;
var app = express();
var DATABASE_NAME = 'data_identifier';
var CONNECTION_URL = 'mongodb://root:password@172.16.99.232:27017/';
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
var database, constants, collection;
app.get('/', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({
            code: 200,
            message: 'Hackaton API is running ok!'
        });
        return [2 /*return*/];
    });
}); });
app.post('/check-pattern', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var files, result, count, _a, _b, _i, _body, values, _values, _match, _next, _others;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (Object.entries(request.files['jsons']).length === 0) {
                    response.status(400).json({ code: 400, message: 'json files is required' });
                    return [2 /*return*/];
                }
                files = request.files['jsons'];
                result = {};
                count = 0;
                _a = [];
                for (_b in files)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _body = _a[_i];
                values = utils_1.parseJson(_body);
                console.log(values);
                return [4 /*yield*/, first_value_filter(values)];
            case 2:
                _values = _c.sent();
                _match = _values['match'];
                _next = _values['next'];
                return [4 /*yield*/, continueValueFilter(_next)];
            case 3:
                _others = _c.sent();
                result[count] = _match.concat(_others);
                count++;
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5:
                response.json(result);
                return [2 /*return*/];
        }
    });
}); });
function first_value_filter(values) {
    return __awaiter(this, void 0, void 0, function () {
        var _nextValues, _matchedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _nextValues = [];
                    _matchedData = [];
                    return [4 /*yield*/, constants.find({}).toArray(function (error, constants) {
                            if (error) {
                                return false;
                            }
                            values.forEach(function (item, _index) {
                                var fixedFilters = utils_1.executePreviousFilters(item, constants);
                                // tslint:disable-next-line: no-console
                                //console.log(fixedFilters)
                                if (fixedFilters !== false) {
                                    _matchedData.push(fixedFilters);
                                }
                                else {
                                    _nextValues.push(item);
                                }
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve({
                                    match: _matchedData,
                                    next: _nextValues
                                });
                            }, 1000);
                        })];
            }
        });
    });
}
var continueValueFilter = function (values) { return __awaiter(void 0, void 0, void 0, function () {
    var _matchedData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _matchedData = [];
                return [4 /*yield*/, collection.find({}).toArray(function (error, regexObject) {
                        if (error) {
                            return false;
                        }
                        values.forEach(function (item, _index) {
                            var _aux = {};
                            _aux['data'] = item;
                            // tslint:disable-next-line: prefer-for-of
                            regex_loop: for (var i = 0; i < regexObject.length; i++) {
                                var _regex = regexObject[i]['regular_expression'];
                                var counts = 0;
                                // tslint:disable-next-line: prefer-for-of
                                for (var j = 0; j < _regex.length; j++) {
                                    var match = utils_1.checkData(item, _regex[j]);
                                    if (match) {
                                        counts = counts + 1;
                                        // _aux['regex'] = regexObject[i]['regular_expression'];
                                        // _matched_data.push(_aux);
                                        // break regex_loop;
                                    }
                                }
                                if (counts > 0) {
                                    _aux['type'] = regexObject[i]['type'];
                                    // _aux['counts'] = counts;
                                }
                                else {
                                    _aux['type'] = 'text';
                                }
                                // _matched_data.push(_aux);
                            }
                            _matchedData.push(_aux);
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(_matchedData);
                        }, 1000);
                    })];
        }
    });
}); };
app.listen(PORT, function () {
    // tslint:disable-next-line: no-console
    console.log("Listening on " + PORT);
    mongodb_1.MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (error, client) {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        constants = database.collection('constants');
        collection = database.collection('patterns');
        // tslint:disable-next-line: no-console
        console.log('Connected to `' + DATABASE_NAME + '`!');
    });
});
