/**
 * Created by Charlie on 2017-09-24.
 */
import { CourseAcornAPI } from "./CourseAcornAPI";
import { BasicAcornAPI } from "./BasicAcornAPI";
import { AcademicHistoryAcornAPI } from "./AcademicHistoryAcornAPI";
export declare class Acorn {
    private state;
    basic: BasicAcornAPI;
    course: CourseAcornAPI;
    academic: AcademicHistoryAcornAPI;
    constructor();
}
