/// <reference path="CourseInterfaces.d.ts" />
import { BaseAcornAPI } from "./AcornAPI";
export declare class CourseAcornAPI extends BaseAcornAPI {
    cachedRegistrations: Array<Acorn.Registration>;
    /**
     * Get user registration status
     * @return {TRequest}
     */
    getEligibleRegistrations(): Promise<Array<Acorn.Registration>>;
    /**
     * Get list of courses that are currently enrolled(APP), waitlisted(WAIT), dropped(DROP)
     * @param registrationIndex
     * @return {TRequest}
     */
    getEnrolledCourses(registrationIndex?: number): Promise<Acorn.EnrolledCourses>;
    /**
     * Get list of courses that are in enrollment cart
     * @param registrationIndex
     * @return {TRequest}
     */
    getCartedCourses(registrationIndex?: number): Promise<Array<Acorn.CartedCourse>>;
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
    enroll(registrationIndex: number, code: string, sectionCode: string, lectureSectionNo: string): Promise<boolean>;
    /**
     * This method loads some extra information on courses
     * @param registrationIndex
     * @param courseCode
     * @param courseSessionCode
     * @param sectionCode
     * @return {TRequest}
     */
    getExtraCourseInfo(registrationIndex: number, courseCode: string, courseSessionCode: string, sectionCode: string): Promise<Acorn.Course>;
}
