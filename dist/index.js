/**
 * Created by Charlie on 2017-09-24.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AcornAPI_1 = require("./AcornAPI");
const request = require("request");
const CourseAcornAPI_1 = require("./CourseAcornAPI");
const BasicAcornAPI_1 = require("./BasicAcornAPI");
const AcademicHistoryAcornAPI_1 = require("./AcademicHistoryAcornAPI");
class Acorn {
    constructor() {
        this.state = new AcornAPI_1.AcornStateManager(request.jar());
        this.basic = new BasicAcornAPI_1.BasicAcornAPI(this.state);
        this.course = new CourseAcornAPI_1.CourseAcornAPI(this.state);
        this.academic = new AcademicHistoryAcornAPI_1.AcademicHistoryAcornAPI(this.state);
    }
}
exports.Acorn = Acorn;
//# sourceMappingURL=index.js.map