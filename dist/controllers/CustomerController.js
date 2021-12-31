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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var Customer_dto_1 = require("../dto/Customer.dto");
var utility_1 = require("../utility");
var models_1 = require("../models");
var CustomerSignup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInput, InputError, email, phone, password, salt, userPassword, _a, otp, expiry, existingCustomer, result, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInput, { validationError: { target: true } })];
            case 1:
                InputError = _b.sent();
                if (InputError.length > 0) {
                    return [2 /*return*/, res.status(400).json(InputError)];
                }
                email = customerInput.email, phone = customerInput.phone, password = customerInput.password;
                return [4 /*yield*/, (0, utility_1.generateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, utility_1.generatePassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                _a = (0, utility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 4:
                existingCustomer = _b.sent();
                if (existingCustomer !== null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Email already exist!' })];
                }
                return [4 /*yield*/, models_1.Customer.create({
                        email: email,
                        password: userPassword,
                        salt: salt,
                        phone: phone,
                        otp: otp,
                        otp_expiry: expiry,
                        firstname: '',
                        lastname: '',
                        address: '',
                        verified: false,
                        lat: 0,
                        long: 0
                    })];
            case 5:
                result = _b.sent();
                if (!result) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, utility_1.onRequestOtp)(otp, phone)];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, utility_1.generateSignature)({
                        _id: result._id,
                        email: result.email,
                        verified: result.verified
                    })];
            case 7:
                signature = _b.sent();
                return [2 /*return*/, res.status(201).json({ signature: signature, verified: result.verified, email: result.email })];
            case 8: return [2 /*return*/, res.status(400).json({ "message": "error with Signup" })];
        }
    });
}); };
exports.CustomerSignup = CustomerSignup;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerLogin, loginError, email, password, customer, validation, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerLogin = (0, class_transformer_1.plainToClass)(Customer_dto_1.CustomerLoginInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerLogin, { validationError: { target: false } })];
            case 1:
                loginError = _a.sent();
                if (loginError.length > 0) {
                    return [2 /*return*/, res.status(400).json(loginError)];
                }
                email = customerLogin.email, password = customerLogin.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utility_1.validatePassword)(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (!validation) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utility_1.generateSignature)({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified
                    })];
            case 4:
                signature = _a.sent();
                return [2 /*return*/, res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email })];
            case 5: return [2 /*return*/, res.status(404).json({ "message": "error with login" })];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, customer, profile, updateCustomerResponse, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = req.body.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                if (!(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())) return [3 /*break*/, 4];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updateCustomerResponse = _a.sent();
                return [4 /*yield*/, (0, utility_1.generateSignature)({
                        _id: updateCustomerResponse._id,
                        email: updateCustomerResponse.email,
                        verified: updateCustomerResponse.verified
                    })];
            case 3:
                signature = _a.sent();
                return [2 /*return*/, res.status(201).json({ signature: signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email })];
            case 4: return [2 /*return*/, res.status(400).json({ "message": "error with otp" })];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var RequestOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, _a, otp, expiry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 4];
                _a = (0, utility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                profile.otp = otp;
                profile.otp_expiry = expiry;
                return [4 /*yield*/, profile.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, utility_1.onRequestOtp)(otp, profile.phone)];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' })];
            case 4: return [2 /*return*/, res.status(400).json({ "message": "error with otp" })];
        }
    });
}); };
exports.RequestOtp = RequestOtp;
var GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(200).json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ "message": "error" })];
        }
    });
}); };
exports.GetCustomerProfile = GetCustomerProfile;
var EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profileInput, profileError, firstname, lastname, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                profileInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(profileInput, { validationError: { target: false } })];
            case 1:
                profileError = _a.sent();
                if (profileError.length > 0) {
                    return [2 /*return*/, res.status(400).json(profileError)];
                }
                firstname = profileInput.firstname, lastname = profileInput.lastname, address = profileInput.address;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstname = firstname;
                profile.lastname = lastname;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ "message": "error" })];
        }
    });
}); };
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map