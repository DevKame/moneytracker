
import {Datamanager}from "../Aggregator.js";

export class Validator extends Datamanager {
    constructor() {
        super();
        //^\d{1,2}((\.|,)\d{1,2})?$
    }
    /**
     * 
     * @param name users chosen name for a new category
     *             (comes already trimmed as argument)
     * @returns false if categoryname is an empty string or already taken
     */
    public validate_categoryName(name: string, cats: string[]) {
        let doubles: number = 0;
        cats.forEach(cat => {
            if(cat.toLowerCase() === name.toLowerCase())
            {
                doubles++;
            }
        });
        if(doubles === 0 && name !== "")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    /**makes sure user has typed a valid format of an amount
     * 
     * @param amount number
     * @returns Boolean
     */
    public validateAmount(amount: string): Boolean {
        let result = amount.match(/^\d+((\.|,)\d{1,2})?$/);
        if(Array.isArray(result))
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
    /**
     * 
     * @param name users chosen name for a new Trackeraccount
     *             (comes already trimmed as argument)
     * @returns false if username is an empty string or already taken
     */
    public validateUserName(name: string, accArray?: any[]) {
        if(!accArray)
        {
            if(name !== "") return true;
            else return false;
        }
        if(accArray !== undefined && accArray !== null)
        {
            let doubles: number = 0;
            accArray.forEach(acc => {
                if(acc.name.toLowerCase() === name.toLowerCase())
                {
                    doubles++;
                }
            });
            if(doubles === 0 && name !== "")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}