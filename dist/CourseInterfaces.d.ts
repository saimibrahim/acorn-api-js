/**
 * This file describes course structure
 * Created by Charlie on 2017-10-03.
 */
declare namespace Acorn {
    interface Post {
        code: string;
        description: string;
        acpDuration: number;
    }
    interface RegistrationStatuses {
        [key: string]: {
            registrationStatusCode: string;
            yearOfStudy: string;
        };
    }
    interface RegistrationParams {
        postCode: string;
        postDescription: string;
        sessionCode: string;
        sessionDescription: string;
        status: string;
        assocOrgCode: string;
        acpDuration: string;
        levelOfInstruction: string;
        typeOfProgram: string;
        subjectCode1: string;
        designationCode1: string;
        primaryOrgCode: string;
        secondaryOrgCode: string;
        collaborativeOrgCode: string;
        adminOrgCode: string;
        coSecondaryOrgCode: string;
        yearOfStudy: string;
        postAcpDuration: string;
        useSws: string;
    }
    interface Registration {
        post: Post;
        sessionCode: string;
        personId: number;
        acpDuration: number;
        status: string;
        yearOfStudy: string;
        assocOrgCode: string;
        levelOfInstruction: string;
        typeOfProgram: string;
        subjectCode1: string;
        designationCode1: string;
        primaryOrgCode: string;
        secondaryOrgCode: string;
        collaborativeOrgCode: string;
        adminOrgCode: string;
        coSecondaryOrgCode: string;
        overrideSubjectPostPrimaryOrg: string;
        candidacyPostCode: string;
        candidacySessionCode: string;
        postOfferCncLimit: string;
        postOfferCncAllowed: string;
        activityApprovedInd: string;
        activityApprovedOrg: string;
        academicStatusDesc?: any;
        exchangeTitle?: any;
        associatedOrgName?: any;
        attendanceClassDesc: string;
        gradFundingIndicator: string;
        useSws: string;
        sessionDescription: string;
        studentCampusCode: string;
        maxCourseLoad?: any;
        registrationSessions: string[];
        registrationStatuses: RegistrationStatuses;
        registrationParams: RegistrationParams;
        currentRegistration: boolean;
        postInfo: string;
        sessionInfo: string;
    }
    interface Day {
        dayCode: string;
        dayName: string;
        index: number;
        weekDay: boolean;
        gregorianCalendarDayOfWeek: number;
    }
    interface Time {
        day: Day;
        startTime: string;
        endTime: string;
        buildingCode: string;
        room: string;
        instructors: string[];
        commaSeparatedInstructorNames: string;
    }
    interface MeetingResource {
        sessionCode: string;
        activityCode: string;
        sectionCode: string;
        teachMethod: string;
        sectionNumber: string;
        sequence: number;
        instructorOrgUnit?: any;
        teachPercent?: any;
        employeeNumber?: any;
        logCounter: number;
        employeeType?: any;
        instructorSurname: string;
        instructorFirstName: string;
        instructorInitials: string;
    }
    interface Meeting {
        sectionNo: string;
        sessionCode: string;
        teachMethod: string;
        enrollSpace: number;
        enrollmentSpaceAvailable: number;
        totalSpace: number;
        cancelled: boolean;
        closed: boolean;
        waitlistable: boolean;
        subTitle1: string;
        subTitle2: string;
        subTitle3: string;
        waitlistRank: number;
        waitlistLookupMethod?: any;
        times: Time[];
        displayTime: string;
        action: string;
        full: boolean;
        enrollmentControlFull: boolean;
        enrollmentControlMissing: boolean;
        enrolmentIndicator: string;
        enrolmentIndicatorDisplay?: any;
        enrolmentIndicatorMsg?: any;
        enrolmentIndicatorDates: any[];
        deliveryMode: string;
        waitlistableForAll: boolean;
        message?: any;
        professorApprovalReq: string;
        meetingResources: MeetingResource[];
        displayName: string;
        subTitle: string;
        hasSubTitle: boolean;
        commaSeparatedInstructorNames: string;
    }
    interface Course {
        code: string;
        sectionCode: string;
        title: string;
        status: string;
        primaryTeachMethod: string;
        secondaryTeachMethod1: string;
        secondaryTeachMethod2: string;
        primarySectionNo: string;
        secondarySectionNo1: string;
        secondarySectionNo2: string;
        deliveryMode: string;
        waitlistTeachMethod: string;
        waitlistSectionNo: string;
        waitlistMeetings?: any;
        meetings: Meeting[];
        enroled: boolean;
        attendanceStatus: string;
        sessionCode: string;
        courseCredits: string;
        markApprovedDate?: any;
        mark: string;
        regApprovedDate?: any;
        regApprovedTime?: any;
        subSessionCode: string;
        currentCncCreditsBalance?: any;
        cncAllowed: string;
        postCode?: any;
        activityPrimaryOrgCode?: any;
        activitySecondaryOrgCode?: any;
        activityCoSecondaryOrgCode?: any;
        courseStatusIfEnroling?: any;
        cancelled: boolean;
        regSessionCode1: string;
        regSessionCode2: string;
        regSessionCode3: string;
        enrolmentErrorCode: number;
        enrolmentErrorMessage?: any;
        planErrorCode: number;
        planningAllowed: boolean;
        planningStartDate?: any;
        planningEndDate?: any;
        enrolEnded: boolean;
        enrolNotStarted: boolean;
        retrieveCancelledCourses: boolean;
        displayName: string;
        meetingList: string[];
        waitlistable: boolean;
        approved: boolean;
        dropped: boolean;
        refused: boolean;
        requested: boolean;
        interim: boolean;
        waitlisted: boolean;
        enroledInPrimary: boolean;
        enroledInSecondary1: boolean;
        enroledInSecondary2: boolean;
        isEligibleForCnc: boolean;
        isWithinSessionalDatesForCnc: boolean;
        enroledInAll: boolean;
        enroledMeetingSections: string[];
        teachMethods: string[];
        secondaryTeachMethods: string[];
        deliveryModeDisplay: string;
    }
    interface EnrolledCourses {
        APP?: Course[];
        WAIT?: Course[];
        DROP?: Course[];
    }
    interface Info {
        primaryActivities: any[];
        secondaryActivities: any[];
        thirdActivities: any[];
    }
    interface Message {
        title: string;
        value: string;
    }
    interface CartedCourse {
        _id: string;
        courseCode: string;
        sectionCode: string;
        primaryActivityId: string;
        secondaryActivityId: string;
        thirdActivityId: string;
        courseTitle: string;
        cancelled: boolean;
        regSessionCode1: string;
        regSessionCode2: string;
        regSessionCode3: string;
        messages: Message[];
        info: Info;
    }
}
