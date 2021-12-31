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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorById = exports.GetVendor = exports.CreateVendor = exports.findVendor = void 0;
var models_1 = require("../models");
var utility_1 = require("../utility");
var findVendor = function (id, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vendor.findOne({ email: email })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, models_1.Vendor.findById(id)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findVendor = findVendor;
var CreateVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, address, pincode, foodtype, email, password, ownername, phone, existingVendor, salt, userPassword, createVendor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, address = _a.address, pincode = _a.pincode, foodtype = _a.foodtype, email = _a.email, password = _a.password, ownername = _a.ownername, phone = _a.phone;
                return [4 /*yield*/, (0, exports.findVendor)('', email)];
            case 1:
                existingVendor = _b.sent();
                if (existingVendor !== null) {
                    return [2 /*return*/, res.json({ "message": "Vendor Already exists" })];
                }
                return [4 /*yield*/, (0, utility_1.generateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, utility_1.generatePassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                return [4 /*yield*/, models_1.Vendor.create({
                        name: name,
                        address: address,
                        pincode: pincode,
                        foodtype: foodtype,
                        email: email,
                        password: userPassword,
                        salt: salt,
                        ownername: ownername,
                        phone: phone,
                        rating: 0,
                        serviceAvailable: false,
                        coverImage: [],
                        foods: []
                    })];
            case 4:
                createVendor = _b.sent();
                return [2 /*return*/, res.json(createVendor)];
        }
    });
}); };
exports.CreateVendor = CreateVendor;
var GetVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vendor.find()];
            case 1:
                vendors = _a.sent();
                if (vendors !== null) {
                    return [2 /*return*/, res.json(vendors)];
                }
                return [2 /*return*/, res.json({ "message": "Data not available" })];
        }
    });
}); };
exports.GetVendor = GetVendor;
var GetVendorById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, vendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.id;
                return [4 /*yield*/, (0, exports.findVendor)(vendorId)];
            case 1:
                vendor = _a.sent();
                if (vendor !== null) {
                    return [2 /*return*/, res.json(vendor)];
                }
                return [2 /*return*/, res.json({ "message": "Data Not Available" })];
        }
    });
}); };
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map