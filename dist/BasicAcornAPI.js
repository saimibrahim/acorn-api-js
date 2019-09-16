"use strict";
/**
 * This Class provides basic acorn actions
 *
 * Created by Charlie on 2017-09-22.
 * Updated 2019-08-25
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const libxmljs = require("libxmljs");
const AcornError_1 = require("./AcornError");
const AcornAPI_1 = require("./AcornAPI");
const ACORN_HOST = "https://acorn.utoronto.ca";
const urlTable = {
    "authURL": ACORN_HOST + "/sws",
    "acornURL": ACORN_HOST + "/spACS"
};
const formHeader = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html'
};
class BasicAcornAPI extends AcornAPI_1.BaseAcornAPI {
    /**
     * Login to Acorn
     * @throws AcornError throw AcornError if login failed
     * @returns Boolean will be true if all processes goes properly
     */
    login(user, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield rp.get({
                uri: urlTable.authURL,
                jar: this.state.cookieJar,
                resolveWithFullResponse: true
            });
            let new_url = response.request.uri;
            let body = response.body;
            let form = BasicAcornAPI.extractFormData(body);
            form["_eventId_proceed"] = "";
            form["j_username"] = user;
            form["j_password"] = pass;
            try {
                response = yield rp.post({
                    uri: new_url,
                    jar: this.state.cookieJar,
                    headers: formHeader,
                    form: form,
                    resolveWithFullResponse: true
                });
            }
            catch (error) {
                throw new AcornError_1.AcornError('Invalid Credentials');
            }
            body = response.body;
            let SAMLResponse = BasicAcornAPI.extractFormData(body);
            if (!SAMLResponse["SAMLResponse"]) {
                throw new AcornError_1.AcornError('Invalid Credentials');
            }
            body = yield rp.post({
                uri: urlTable.acornURL,
                jar: this.state.cookieJar,
                headers: formHeader,
                form: BasicAcornAPI.extractFormData(body),
                followAllRedirects: true
            });
            if (body.search('<h1>A problem has occurred</H1>') > -1)
                throw new AcornError_1.AcornError('A problem has occurred');
            if (!(body.search('<title>ACORN</title>') > -1))
                throw new AcornError_1.AcornError('Acorn Unavailable Now');
            // TODO check cookie to verify whether logged in
            this.state.isLoggedIn = true;
            return true;
        });
    }
    /**
     * Extract data from fields of all existing forms from HTML string or dom
     * Helper method to facilitate auth process
     * @param doc HTML Document or HTML string
     * @return LooseObj loose javascript object
     */
    static extractFormData(doc) {
        let sanctifiedDoc;
        if (typeof doc === 'string') {
            sanctifiedDoc = libxmljs.parseHtml(doc);
        }
        else {
            sanctifiedDoc = doc;
        }
        const inputs = sanctifiedDoc.find('//form//input[@type="hidden"]');
        let result = {};
        for (let input of inputs) {
            result[input.attr('name').value()] = input.attr('value') ? input.attr('value').value() : "";
        }
        return result;
    }
}
exports.BasicAcornAPI = BasicAcornAPI;
//# sourceMappingURL=BasicAcornAPI.js.map