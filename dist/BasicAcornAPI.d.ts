/**
 * This Class provides basic acorn actions
 *
 * Created by Charlie on 2017-09-22.
 * Updated 2019-08-25
 */
import { BaseAcornAPI } from "./AcornAPI";
export declare class BasicAcornAPI extends BaseAcornAPI {
    /**
     * Login to Acorn
     * @throws AcornError throw AcornError if login failed
     * @returns Boolean will be true if all processes goes properly
     */
    login(user: string, pass: string): Promise<boolean>;
    /**
     * Extract data from fields of all existing forms from HTML string or dom
     * Helper method to facilitate auth process
     * @param doc HTML Document or HTML string
     * @return LooseObj loose javascript object
     */
    private static extractFormData;
}
