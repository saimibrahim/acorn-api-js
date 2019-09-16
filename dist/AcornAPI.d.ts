/**
 * Created by Charlie on 2017-09-24.
 */
import request = require('request');
/**
 * Share the state information among all API components
 */
export declare class AcornStateManager {
    private _cookieJar;
    readonly cookieJar: request.CookieJar;
    isLoggedIn: boolean;
    constructor(cookieJar: request.CookieJar);
}
/**
 * Every API components must have field AcornStateManager
 */
export interface AcornAPI {
    state: AcornStateManager;
}
/**
 * Base class for every Acorn API class
 */
export declare class BaseAcornAPI implements AcornAPI {
    state: AcornStateManager;
    constructor(state?: AcornStateManager);
}
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
export declare function needLogin(target: any, propertyKey: string, descriptor: any): any;
