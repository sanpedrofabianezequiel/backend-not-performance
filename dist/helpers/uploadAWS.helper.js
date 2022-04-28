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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromAws = exports.deleteFile = exports.uploadFileToAws = exports.uploadFile = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var unlinkFile = util_1.default.promisify(fs_1.default.unlink);
//const sleep = require('sleep-promise');
var s3sourceCredentials = new aws_sdk_1.default.Credentials({
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY_ID,
    secretAccessKey: process.env.DO_SPACE_SECRET_ACCESS_KEY,
});
var s3 = new aws_sdk_1.default.S3({
    credentials: s3sourceCredentials,
    endpoint: process.env.DO_SPACE_ENDPOINT,
    region: "us-east-1",
});
var uploadFile = function (data, name, contentType, isPrivate) {
    if (isPrivate === void 0) { isPrivate = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fileStream, privates, params, s3Data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileStream = fs_1.default.createReadStream(data.path);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    privates = isPrivate ? "private" : "public-read";
                    params = {
                        Bucket: process.env.DO_SPACE_SECRET_BUCKET_NAME,
                        Key: name,
                        Body: fileStream,
                        ContentType: contentType,
                        ACL: privates,
                    };
                    return [4 /*yield*/, (0, exports.uploadFileToAws)(params)];
                case 2:
                    s3Data = _a.sent();
                    return [4 /*yield*/, unlinkFile(fileStream.path)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, s3Data.Location];
                case 4:
                    err_1 = _a.sent();
                    console.log('ERR uploadFile ', err_1);
                    return [2 /*return*/, ""];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.uploadFile = uploadFile;
var uploadFileToAws = function (params) {
    return new Promise(function (resolve, reject) {
        try {
            s3.upload(params, function (err, data) {
                if (err) {
                    console.error("Error uploading data: ", err.message);
                    reject(err.message);
                }
                resolve(data);
            });
        }
        catch (err) {
            console.error("Error in uploadFileToAws: ", err.message);
        }
    });
};
exports.uploadFileToAws = uploadFileToAws;
var deleteFile = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var params, s3Data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = {
                    Bucket: process.env.DO_SPACE_SECRET_BUCKET_NAME,
                    Key: key,
                };
                return [4 /*yield*/, (0, exports.deleteFileFromAws)(params)];
            case 1:
                s3Data = _a.sent();
                console.log("s3Data::: ", s3Data);
                return [2 /*return*/, s3Data];
            case 2:
                err_2 = _a.sent();
                console.log('ERR deleteFile ', err_2);
                return [2 /*return*/, ""];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteFile = deleteFile;
var deleteFileFromAws = function (params) {
    return new Promise(function (resolve, reject) {
        try {
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.error("Error deleting data: ", err.message);
                    reject(err.message);
                }
                resolve(data);
            });
        }
        catch (err) {
            console.error("Error in deleteFileFromAws: ", err);
        }
    });
};
exports.deleteFileFromAws = deleteFileFromAws;
/*
const verifyExists = async (path, millisecondsLimit) => {

  let exists = false;
  const seconds = millisecondsLimit / 1000;

  for (let $i = 0; $i < seconds; $i++) {

    if (fs.existsSync(path)) {

      exists = true;
      break;

    }

    await sleep(1000);

  }

  return exists;
*/ 
