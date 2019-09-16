import { BaseAcornAPI } from "./AcornAPI";
/**
 * This class is responsible for all academic history operations
 * Created by Charlie on 2017-10-05.
 */
export declare namespace Acorn {
    interface Score {
        code: string;
        title: string;
        weight: string;
        other?: string;
        score?: string;
        rank?: string;
        classRank?: string;
    }
    interface SessionalAcademicHistory {
        header: string;
        scores: Score[];
        extraInfo?: string;
    }
}
export declare class AcademicHistoryAcornAPI extends BaseAcornAPI {
    getAcademicHistory(): Promise<Array<Acorn.SessionalAcademicHistory>>;
}
