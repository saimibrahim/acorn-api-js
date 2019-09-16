///<reference path="CourseInterfaces.ts"/>
'use strict';
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
const querystring = require("querystring");
const AcornError_1 = require("./AcornError");
const _ = require("lodash");
const assert = require("assert");
/**
 * This class handles all course related actions on acorn
 * Created by Charlie on 2017-09-23.
 */
function needRegistration(target, propertyKey, descriptor) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    let originalMethod = descriptor.value;
    descriptor.value = function (registrationIndex = 0, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedRegistrations.length === 0) {
                yield this.getEligibleRegistrations();
            }
            const regisNum = this.cachedRegistrations.length;
            if (!(regisNum > registrationIndex)) {
                throw new AcornError_1.AcornError(`Registration IndexOutOfBound! no enough registrations(need ${registrationIndex + 1}, but got ${regisNum})`);
            }
            args.unshift(registrationIndex); // add registration index at the front of args
            return originalMethod.apply(this, args);
        });
    };
    return descriptor;
}
class CourseAcornAPI extends AcornAPI_1.BaseAcornAPI {
    constructor() {
        super(...arguments);
        this.cachedRegistrations = [];
    }
    /**
     * Get user registration status
     * @return {TRequest}
     */
    getEligibleRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield rp.get({
                uri: 'https://acorn.utoronto.ca/sws/rest/enrolment/eligible-registrations',
                jar: this.state.cookieJar,
                json: true
            });
            this.cachedRegistrations = res;
            return res;
        });
    }
    /**
     * Get list of courses that are currently enrolled(APP), waitlisted(WAIT), dropped(DROP)
     * @param registrationIndex
     * @return {TRequest}
     */
    getEnrolledCourses(registrationIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const getQueryStr = querystring.stringify(this.cachedRegistrations[registrationIndex].registrationParams);
            return yield rp.get({
                uri: 'https://acorn.utoronto.ca/sws/rest/enrolment/course/enrolled-courses?' + getQueryStr,
                jar: this.state.cookieJar,
                json: true
            });
        });
    }
    /**
     * Get list of courses that are in enrollment cart
     * @param registrationIndex
     * @return {TRequest}
     */
    getCartedCourses(registrationIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const getQueryStr = querystring.stringify(_.pick(this.cachedRegistrations[registrationIndex], ['candidacyPostCode', 'candidacySessionCode', 'sessionCode']));
            return yield rp.get({
                uri: 'https://acorn.utoronto.ca/sws/rest/enrolment/plan?' + getQueryStr,
                jar: this.state.cookieJar,
                json: true
            });
        });
    }
    /**
     * Normally registrationIndex = 1 is summer course
     * {"course":{"code":"CSC236H1","sectionCode":"Y","primaryTeachMethod":"LEC","enroled":false},"lecture":{"sectionNo":"LEC,5101"},"tutorial":{},"practical":{}}
     *
     * [WARNING] this method has not been tested yet;
     * Currently its logic is directly copied from Acorn API(Java)
     * @param registrationIndex
     * @param code courseCode
     * @param sectionCode
     * @param lectureSectionNo
     */
    enroll(registrationIndex, code, sectionCode, lectureSectionNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                activeCourse: {
                    course: {
                        code,
                        sectionCode: sectionCode.toUpperCase(),
                        primaryTeachMethod: "LEC",
                        enrolled: "false"
                    },
                    lecture: {
                        sectionNo: lectureSectionNo.toUpperCase()
                    },
                    tutorial: {},
                    practical: {}
                },
                eligRegParams: this.cachedRegistrations[registrationIndex].registrationParams
            };
            let xsrfToken = "";
            this.state.cookieJar.getCookies('https://acorn.utoronto.ca').forEach(cookie => {
                const cv = JSON.parse(JSON.stringify(cookie));
                if (cv.key === 'XSRF-TOKEN') {
                    xsrfToken = cv.value;
                }
            });
            assert(xsrfToken !== "", "unable to locate xsrf-token in cookies");
            const res = yield rp.post({
                uri: 'https://acorn.utoronto.ca/sws/rest/enrolment/course/modify',
                body: payload,
                headers: {
                    "X-XSRF-TOKEN": xsrfToken
                }
            });
            return true;
        });
    }
    /**
     * This method loads some extra information on courses
     * @param registrationIndex
     * @param courseCode
     * @param courseSessionCode
     * @param sectionCode
     * @return {TRequest}
     */
    getExtraCourseInfo(registrationIndex, courseCode, courseSessionCode, sectionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const getQueryStr = querystring.stringify(this.cachedRegistrations[registrationIndex].registrationParams) + '&' +
                querystring.stringify({
                    activityApprovedInd: "",
                    activityApprovedOrg: "",
                    courseCode,
                    courseSessionCode,
                    sectionCode
                });
            return yield rp.get({
                uri: 'https://acorn.utoronto.ca/sws/rest/enrolment/course/view?' + getQueryStr,
                jar: this.state.cookieJar,
                json: true
            });
        });
    }
}
__decorate([
    AcornAPI_1.needLogin,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseAcornAPI.prototype, "getEligibleRegistrations", null);
__decorate([
    AcornAPI_1.needLogin,
    needRegistration,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseAcornAPI.prototype, "getEnrolledCourses", null);
__decorate([
    AcornAPI_1.needLogin,
    needRegistration,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseAcornAPI.prototype, "getCartedCourses", null);
__decorate([
    AcornAPI_1.needLogin,
    needRegistration,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], CourseAcornAPI.prototype, "enroll", null);
__decorate([
    AcornAPI_1.needLogin,
    needRegistration,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], CourseAcornAPI.prototype, "getExtraCourseInfo", null);
exports.CourseAcornAPI = CourseAcornAPI;
//# sourceMappingURL=CourseAcornAPI.js.map