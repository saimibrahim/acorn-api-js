/**
 * This Class provides basic acorn actions
 *
 * Created by Charlie on 2017-09-22.
 * Updated 2019-08-25
 */

import tough = require('tough-cookie');
import request = require('request');
import rp = require('request-promise');

import libxmljs = require('libxmljs');

import {AcornError} from './AcornError';
import {BaseAcornAPI} from "./AcornAPI";

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

interface LooseObj {
    [key: string]: string;
}

export class BasicAcornAPI extends BaseAcornAPI {
    /**
     * Login to Acorn
     * @throws AcornError throw AcornError if login failed
     * @returns Boolean will be true if all processes goes properly
     */
    public async login(user: string, pass: string): Promise<boolean> {
        let response = await rp.get({
            uri: urlTable.authURL,
            jar: this.state.cookieJar,
            resolveWithFullResponse: true
        });

        let new_url = response.request.uri
        let body = response.body
        let form = BasicAcornAPI.extractFormData(body)

        form["_eventId_proceed"] = ""
        form["j_username"] = user
        form["j_password"] = pass
        
        try {
            response = await rp.post({
                uri: new_url,
                jar: this.state.cookieJar,
                headers: formHeader,
                form: form,
                resolveWithFullResponse: true
            });
        } catch (error) {
            throw new AcornError('Invalid Credentials');
        }

        body = response.body

        let SAMLResponse = BasicAcornAPI.extractFormData(body);

        if (!SAMLResponse["SAMLResponse"]) {
            throw new AcornError('Invalid Credentials');
        }

        body = await rp.post({
            uri: urlTable.acornURL,
            jar: this.state.cookieJar,
            headers: formHeader,
            form: BasicAcornAPI.extractFormData(body),
            followAllRedirects: true
        });

        if (body.search('<h1>A problem has occurred</H1>') > -1)
            throw new AcornError('A problem has occurred');

        if (!(body.search('<title>ACORN</title>') > -1))
            throw new AcornError('Acorn Unavailable Now');

        // TODO check cookie to verify whether logged in
        this.state.isLoggedIn = true;
        return true;
    }

    /**
     * Extract data from fields of all existing forms from HTML string or dom
     * Helper method to facilitate auth process
     * @param doc HTML Document or HTML string
     * @return LooseObj loose javascript object
     */
    private static extractFormData(doc: libxmljs.HTMLDocument | string): LooseObj {
        let sanctifiedDoc: libxmljs.HTMLDocument;
        if (typeof doc === 'string') {
            sanctifiedDoc = libxmljs.parseHtml(doc);
        } else {
            sanctifiedDoc = doc;
        }
        const inputs: Array<libxmljs.Element> = sanctifiedDoc.find('//form//input[@type="hidden"]');
        let result: LooseObj = {};
        for (let input of inputs) {
            result[input.attr('name').value()] = input.attr('value') ? input.attr('value').value() : "";
        }
        return result;
    }
}