/**
 * Created by Charlie on 2017-09-24.
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const AcornError_1 = require("./AcornError");
/**
 * Share the state information among all API components
 */
class AcornStateManager {
    get cookieJar() {
        return this._cookieJar;
    }
    constructor(cookieJar) {
        this.isLoggedIn = false;
        this._cookieJar = cookieJar;
    }
}
exports.AcornStateManager = AcornStateManager;
/**
 * Base class for every Acorn API class
 */
class BaseAcornAPI {
    constructor(state = new AcornStateManager(request.jar())) {
        this.state = state;
    }
}
exports.BaseAcornAPI = BaseAcornAPI;
/**
 * Decorator to wrap member functions of BaseAcornAPI and it's ascendants.
 * the decorated member functions would first check the login state and then
 * proceed.
 *
 * The return type of decorated function should be a Promise
 * @param target BaseAcornAPI instance
 * @param propertyKey decorated method name
 * @param descriptor method descriptor
 * @return {PropertyDescriptor}
 */
function needLogin(target, propertyKey, descriptor) {
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    let originalMethod = descriptor.value;
    // editing the descriptor/value parameter
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.isLoggedIn) {
                throw new AcornError_1.AcornError('Need to first login to proceed with ' + propertyKey);
            }
            else {
                return originalMethod.apply(this, args);
            }
        });
    };
    return descriptor;
}
exports.needLogin = needLogin;
//# sourceMappingURL=AcornAPI.js.map