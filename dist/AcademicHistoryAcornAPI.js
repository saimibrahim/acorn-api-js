"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AcornAPI_1 = require("./AcornAPI");
const rp = require("request-promise");
const libxmljs = require("libxmljs");
const _ = require("lodash");
const util_1 = require("util");
const AcornError_1 = require("./AcornError");
const util_2 = require("util");
const assert = require("assert");
function getText(elements) {
    return _.map(elements, (element) => {
        return element.text();
    });
}
class AcademicHistoryAcornAPI extends AcornAPI_1.BaseAcornAPI {
    getAcademicHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield rp.get({
                uri: 'https://acorn.utoronto.ca/sws/transcript/academic/main.do?main.dispatch&mode=complete',
                jar: this.state.cookieJar
            });
            // const page = require('fs').readFileSync('./sample_original.html', 'utf-8');
            const doc = libxmljs.parseHtml(page);
            const infoNode = doc.get("//div[@class='academic-history']//div[@class='academic-history-report row']");
            if (util_1.isUndefined(infoNode))
                throw new AcornError_1.AcornError("Unable to locate academic info div!");
            // [WARNING]: here only considered the case all session proceed case
            const headers = getText(infoNode.find("./h3[@class='sessionHeader']"));
            const scores = _.map(getText(infoNode.find("./div[@class='courses blok']")), sessionScore => {
                return _.map(_.filter(sessionScore.split('\n'), courseScore => {
                    return !(/^[ \t\n]*$/.test(courseScore));
                }), courseScore => {
                    let match = /(\w{3,4}\d{3,4}\w\d) (.+?) (\d\.\d\d) (.+)/
                        .exec(courseScore);
                    if (util_2.isNull(match)) {
                        throw new AcornError_1.AcornError("Unexpected course score format: " + courseScore);
                    }
                    match.shift(); // Remove the first match which is not a capture
                    _.map(match, _.trim);
                    const scoreRegex = /(\d{1,3})\s+(\w[+\-]?)\s+(\w[+\-]?)/;
                    const mustFields = ["code", "title", "weight"];
                    const lastField = match[match.length - 1];
                    if (scoreRegex.test(lastField)) {
                        match.pop();
                        const scoreMatch = scoreRegex.exec(lastField);
                        if (util_2.isNull(scoreMatch))
                            throw new AcornError_1.AcornError("Severe. This should never happen");
                        scoreMatch.shift();
                        return _.zipObject(mustFields.concat(["score", "rank", "classRank"]), match.concat(scoreMatch));
                    }
                    else {
                        return _.zipObject(mustFields.concat(["other"]), match);
                    }
                });
            });
            const extraInfos = _.chunk(getText(infoNode.find("./div[@class='emph gpa-listing']")), 3);
            assert(headers.length === scores.length);
            let result = [];
            for (let i = 0; i < headers.length; i++) {
                const extraInfo = (extraInfos.length > i) ? extraInfos[i] : undefined;
                result.push({
                    header: headers[i],
                    scores: scores[i],
                    extraInfo
                });
            }
            return result;
        });
    }
}
__decorate([
    AcornAPI_1.needLogin,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AcademicHistoryAcornAPI.prototype, "getAcademicHistory", null);
exports.AcademicHistoryAcornAPI = AcademicHistoryAcornAPI;
//# sourceMappingURL=AcademicHistoryAcornAPI.js.map