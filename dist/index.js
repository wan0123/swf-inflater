"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.InflaterBuff = exports.Inflater = void 0;
var fs_1 = __importDefault(require("fs"));
var zlib = __importStar(require("zlib"));
var lzma = require('lzma');
/**
 *
 * @param targetSwf
 */
function Inflater(targetSwf) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var swfBuff, swfInfBuff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.default.promises.readFile(targetSwf)];
                case 1:
                    swfBuff = _a.sent();
                    return [4 /*yield*/, InflaterBuff(swfBuff)];
                case 2:
                    swfInfBuff = _a.sent();
                    resolve(swfInfBuff);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.Inflater = Inflater;
/**
 * swfの形式をFWSにする
 * @param {*} targetSwfBin
 */
function InflaterBuff(targetSwfBin) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var swfVarsion, swfFileSize, swfHeaderBytes, swfBodyBytes, outputSwfBytes, inflateSwfBodyBytes, lzmaBuffer, lzmaProperty, inflateSwfBodyBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    swfVarsion = targetSwfBin[3];
                    swfFileSize = targetSwfBin.readUInt32LE(4);
                    swfHeaderBytes = targetSwfBin.slice(0, 8);
                    swfBodyBytes = targetSwfBin.slice(8);
                    outputSwfBytes = Buffer.alloc(swfFileSize, 0xFF);
                    if (!(targetSwfBin[0] == 0x46 && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53)) return [3 /*break*/, 1];
                    // そのまま使う
                    outputSwfBytes = targetSwfBin;
                    return [3 /*break*/, 5];
                case 1:
                    if (!(targetSwfBin[0] == 0x43 && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53)) return [3 /*break*/, 2];
                    inflateSwfBodyBytes = zlib.inflateSync(swfBodyBytes);
                    // header部分書き込み
                    outputSwfBytes.set(swfHeaderBytes, 0);
                    // 本体部分書き込み
                    outputSwfBytes.set(inflateSwfBodyBytes, swfHeaderBytes.length);
                    // CWF ⇒ FWS
                    outputSwfBytes[0] = 0x46;
                    return [3 /*break*/, 5];
                case 2:
                    if (!(targetSwfBin[0] == 0x5a && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53)) return [3 /*break*/, 4];
                    lzmaBuffer = Buffer.alloc(swfFileSize - 8, 0xFF);
                    lzmaProperty = targetSwfBin.slice(12, 17);
                    // LZMA Property
                    lzmaBuffer.set(lzmaProperty, 0);
                    // ファイルの長さ (swfヘッダ8バイトを除く)
                    lzmaBuffer.writeBigUInt64BE(BigInt(swfFileSize - 8), 5); // 5-12
                    lzmaBuffer.set(targetSwfBin.slice(17), 13);
                    return [4 /*yield*/, lzmaDecompress(lzmaBuffer)];
                case 3:
                    inflateSwfBodyBuffer = _a.sent();
                    // header部分書き込み
                    outputSwfBytes.set(swfHeaderBytes, 0);
                    outputSwfBytes.set(inflateSwfBodyBuffer, swfHeaderBytes.length);
                    // ZWF ⇒ FWS
                    outputSwfBytes[0] = 0x46;
                    return [3 /*break*/, 5];
                case 4:
                    reject("unknown swf type.");
                    return [2 /*return*/];
                case 5:
                    // 書き込み
                    // await fs.writeFile( swfOutputPath, outputSwfBytes );
                    resolve(outputSwfBytes);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.InflaterBuff = InflaterBuff;
/**
 * lzma解凍
 * @param {*} lzmaBytes
 */
function lzmaDecompress(lzmaBytes) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            lzma.decompress(lzmaBytes, function (result, error) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                    return [2 /*return*/];
                });
            }); }, function (percent) {
            });
            return [2 /*return*/];
        });
    }); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUFvQjtBQUNwQix5Q0FBNkI7QUFDN0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0FBRy9COzs7R0FHRztBQUNILFNBQWdCLFFBQVEsQ0FBRSxTQUFpQjtJQUEzQyxpQkFPQztJQU5BLE9BQU8sSUFBSSxPQUFPLENBQUUsVUFBUSxPQUE0QixFQUFFLE1BQTBCOzs7O3dCQUNwRSxxQkFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBRSxTQUFTLENBQUUsRUFBQTs7b0JBQWxELE9BQU8sR0FBSSxTQUF1QztvQkFDcEMscUJBQU0sWUFBWSxDQUFFLE9BQU8sQ0FBRSxFQUFBOztvQkFBM0MsVUFBVSxHQUFJLFNBQTZCO29CQUUvQyxPQUFPLENBQUUsVUFBVSxDQUFFLENBQUM7Ozs7U0FDdEIsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQVBELDRCQU9DO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFFLFlBQW9CO0lBQWxELGlCQTZEQztJQTVEQSxPQUFPLElBQUksT0FBTyxDQUFFLFVBQVEsT0FBNEIsRUFBRSxNQUEwQjs7Ozs7b0JBRS9FLFVBQVUsR0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLFdBQVcsR0FBSSxZQUFZLENBQUMsWUFBWSxDQUFFLENBQUMsQ0FBRSxDQUFDO29CQUM5QyxjQUFjLEdBQUksWUFBWSxDQUFDLEtBQUssQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7b0JBQzdDLFlBQVksR0FBSSxZQUFZLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxDQUFDO29CQUN4QyxjQUFjLEdBQUksTUFBTSxDQUFDLEtBQUssQ0FBRSxX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