


import { Trackeraccount } from "../Aggregator.js";
import { Month } from "../Aggregator.js";

export class Datamanager {
    mydata: any;
    languageData: string;
    dataAsString: string | null;
    singleTrans: any;
    multiTrans: any;
    constructor() {
        this.dataAsString = localStorage.getItem("kamedin-moneytracker");
        this.languageData = this.loadLanguage();
        this.mydata = Object.assign({}, this.loadData());
        this.singleTrans =
        {
            type: null,
            date: null,
            category: null,
            amount: null,
        }
        /**Due: - month - week - quarter - halfyear - year*/
        this.multiTrans =
        {
            type: null,
            due: null,
            category: null,
            amount: null,
            amountPerMonth: null,
        };
    }
    //////////////////////////////////////////////////////////////////////////////////
    // DELETING TRANSACTIONS FROM DETAIL VIEW ___________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * 
     * @param id identifier of the DOM-Element
     * @param monthid 
     * deletes the transaction with the corresponding identifier
     */
    public delete_transaction(id: string, monthid: string) {
        let deleteIndex: any = undefined;
        let whereToDelete: string = "";
        let month = this.mydata.trackeraccounts[this.monthArrayOfWho()!].months[this.get_indexOfMonthId(monthid)];
        for(let i = 0 ; i < month.expenses.length ; i++)
        {
            if(month.expenses[i].identifier !== id)
            {
                continue;
            }
            else
            {
                deleteIndex = i;
                whereToDelete = "expenses";
                break;
            }
        }
        if(deleteIndex === undefined)
        {
            whereToDelete = "earnings";
            for(let i = 0 ; i < month.earnings.length ; i++)
            {
                if(month.earnings[i].identifier !== id)
                {
                    continue;
                }
                else
                {
                    deleteIndex = i;
                    break;
                }
            }
        }
        month[whereToDelete].splice(deleteIndex, 1);
        this.saveData();
    }
    //////////////////////////////////////////////////////////////////////////////////
    // DELETING TRANSACTIONS FROM DETAIL VIEW ___________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    // DATA FOR DASHBOARD ______________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * @param dMan instance of class Datamanager to have all the necessary data
     * @param id the monthid in question
     * @param accIndex index of the tracker account
     * @param monthDays total days this month of this particular year has
     * @param today todays date as number
     * @param todaysDay todays weekday as number
     * @returns an object, containing EVERY data important to display the dashboard-entries
     */
    public get_dashboardData(
        dMan: any,
        id: string,
        accIndex: number,
        monthDays: number,
        today: number,
        todaysDay: number) {
        //determine the correct month using the passed month-id:
        let index: number = 0;
        for(let i = 0; i < dMan.mydata.trackeraccounts[accIndex].months.length ; i++)
        {
            if(id === dMan.mydata.trackeraccounts[accIndex].months[i].month_id)
            {
                index = i;
                break;
            }
        }
        //sum up all earnings:
        let earningsTotal: number = 0;
        dMan.mydata.trackeraccounts[accIndex].months[index].earnings.forEach((trans: any) => {
            earningsTotal += trans.amount;
        });
        //sum up all expenses:
        let expensesTotal: number = 0;
        dMan.mydata.trackeraccounts[accIndex].months[index].expenses.forEach((trans: any) => {
            expensesTotal += trans.amount;
        });
        //sum up all running transactions:
        let fixedExpenses: number = 0;
        let fixedEarnings: number = 0;
        dMan.mydata.trackeraccounts[accIndex].runningTransactions.forEach((trans: any) => {
            if(trans.type === "expense")
            {
                fixedExpenses += trans.amountPerMonth;
            }
            else
            {
                fixedEarnings += trans.amountPerMonth;
            }
        });
        //balance:
        let balance = (earningsTotal - expensesTotal) + (fixedEarnings - fixedExpenses);
        //remaining monthDays:
        //"plus one", because the actual day is also counted
        let remainingDays = monthDays - today + 1;

        //sum up  the daily and weekly Budget:
        let daylyBudget: number = 0;
        let weeklyBudget: number = 0;
        if(balance < 0)
        {
            daylyBudget = 0;
            weeklyBudget = 0;
        }
        else
        {
            daylyBudget = balance / remainingDays;
            weeklyBudget = balance / Math.ceil(remainingDays / 7);
        }
        return {
            balance: balance,
            earningsTotal: earningsTotal,
            fixedExpenses: fixedExpenses,
            fixedEarnings: fixedEarnings,
            expensesTotal: expensesTotal,
            weeklyBudget: weeklyBudget,
            daylyBudget: daylyBudget,
        };
    }

    //////////////////////////////////////////////////////////////////////////////////
    // DATA FOR DASHBOARD ______________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////
    // REPEATING AMOUNTS ______________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * if user sets due to another than monthly, it calculates the monhtly amount based on the totalAmount and the fluctuation
     */
    public compute_monthlyAmount(): void {
        let yearly: number = 0;
        switch(this.multiTrans.due)
        {
            case "month":
                this.set_multiTrans("amountPerMonth", this.multiTrans.amount);
                break;
            case "week":
                yearly = this.multiTrans.amount * 52;
                this.set_multiTrans("amountPerMonth", yearly / 12);
                break;
            case "quarter":
                yearly = this.multiTrans.amount * 4;
                this.set_multiTrans("amountPerMonth", yearly / 12);
                break;
            case "halfyear":
                yearly = this.multiTrans.amount * 2;
                this.set_multiTrans("amountPerMonth", yearly / 12);
                break;
            case "year":
                yearly = this.multiTrans.amount;
                this.set_multiTrans("amountPerMonth", yearly / 12);
                break;
        }
    }
    /**
     * 
     * @param trans transaction object
     * @param monthId 
     * 
     * adds a new repeating transaction to the trackeraccount
     */
    public add_multiTransaction(trans: any, monthId: string) {
        let indexOfMonth: number;

        if(!this.monthId_existent(monthId))
        {
            this.createNewMonth(monthId);
        }
        indexOfMonth = this.get_indexOfMonthId(monthId);

        this.mydata.trackeraccounts
        [this.monthArrayOfWho()!]
        ["runningTransactions"]
        .push(trans);
        this.saveData();
    }
    /**
     * 
     * @param property 
     * @param value 
     * 
     * helper object to keep track of the current progress of the users input
     */
    public set_multiTrans(property: string, value: any) {
        this.multiTrans[property] = value;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // REPEATING AMOUNTS ______________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * 
     * @param monthId 
     * @returns a total of ALL entries of this particular month
     */
    public get_monthEntriesFromId(monthId: string): number {
        let index: number = 0;
        let monthArray = this.mydata.trackeraccounts[this.monthArrayOfWho()!].months;
        for(let i = 0 ; i < monthArray.length ; i++)
        {
            if(monthArray[i].month_id === monthId)
            {
                index = i;
                break;
            }
        }
        let entries: number = 0;
        entries += this.mydata.trackeraccounts[this.monthArrayOfWho()!].months[index].expenses.length;
        entries += this.mydata.trackeraccounts[this.monthArrayOfWho()!].months[index].earnings.length;
        entries += this.mydata.trackeraccounts[this.monthArrayOfWho()!].runningTransactions.length;
        return entries;
    }
    /**
     * 
     * @param name name of the to-be-deleted trackeraccount
     */
    public delete_trackerAccount(name: string) {
        for(let i = 0 ; i < this.mydata.trackeraccounts.length ; i++)
        {
            if(name === this.mydata.trackeraccounts[i].name)
            {
                this.mydata.trackeraccounts.splice(i, 1);
                break;
            }
        }
        this.mydata.activeTrackeraccount = this.mydata.trackeraccounts[0].name;
        this.saveData();
    }
    /**
     * @param name name of the account whose data has to be worked with/shown
     */
    public set_newActiveAccount(name: string) {
        this.mydata.activeTrackeraccount = name;
    }
    public add_category(name: string) {
        this.mydata.trackeraccounts[this.monthArrayOfWho()!].categories.push(name);
        this.saveData();
    }
    public delete_category(value: string) {
        let index: number = this.mydata.trackeraccounts[this.monthArrayOfWho()!].categories.indexOf(value);
        this.mydata.trackeraccounts[this.monthArrayOfWho()!].categories.splice(index, 1);
        this.saveData();
    }
    /**
     * 
     * @param trans transaction object
     * @param monthId 
     * 
     * adds a new single transaction to the trackeraccount
     */
    public add_singleTransaction(trans: any, monthId: string) {
        let indexOfMonth: number;

        if(!this.monthId_existent(monthId))
        {
            this.createNewMonth(monthId);
        }
        indexOfMonth = this.get_indexOfMonthId(monthId);

        this.mydata.trackeraccounts
        [this.monthArrayOfWho()!]
        ["months"]
        [indexOfMonth]
        [trans.type + "s"]
        .push(trans);
        this.saveData();
    }
    /**
     * 
     * @param id monthid
     * @returns index of where to find that month
     */
    public get_indexOfMonthId(id: string): number {
        let index: number = this.monthArrayOfWho()!;
        let monthIndex: number = 0;

        for(let i = 0 ; i < this.mydata.trackeraccounts[index].months.length ; i++)
        {
            if(this.mydata.trackeraccounts[index].months[i].month_id !== id)
            {
                continue;
            }
            else
            {
                monthIndex = i;
                break;
            }
        }
        return monthIndex;
    }
    //awaits "single" or "repeating":
    public validate_transactions(type: string): Boolean {
        let nullishCount: number = 0;
        switch(type) {
            case "single":
                for(let prop in this.singleTrans)
                {
                    if(this.singleTrans[prop] === null)
                    {
                        nullishCount++;
                    }
                }
                break;
            case "repeating":
                for(let prop in this.multiTrans)
                {
                    if(this.multiTrans[prop] === null)
                    {
                        nullishCount++;
                    }
                }
                break;
        }
        if(nullishCount === 0) return true;
        else return false;
    }
    /**
     * multi- and single trans are helper objects to keep track of the progress of "adding a new transaction". this resets them to null
     */
    public reset_multiTrans() {
        for(let prop in this.multiTrans)
        {
            this.multiTrans[prop] = null;
        }
    }
    public reset_singleTrans() {
        for(let prop in this.singleTrans)
        {
            this.singleTrans[prop] = null;
        }
    }
    /**
     * 
     * @param property 
     * @param value 
     * sets the helper object equal to the inputs of the user
     */
    public set_singleTrans(property: string, value: any) {
        this.singleTrans[property] = value;
    }
    public createNewMonth(id: string) {
        let index: number = this.monthArrayOfWho()!;
        let month = new Month(id);
        this.mydata.trackeraccounts[index].months.push(month);
    }
    /**
     * 
     * @param monthId 
     * @returns true or false in case the particular month already exists or not
     */
    public monthId_existent(monthId: string): Boolean {
        //whose month-array is going to be searched for:
        let index: number = this.monthArrayOfWho()!;
        //does the monthId already exist?
        if(this.mydata.trackeraccounts[index].months.length === 0)
        {
            return false;
        }
        else
        {
            let matchesCount: number = 0;
            for(let i = 0 ; i < this.mydata.trackeraccounts[index].months.length ; i++)
            {
                if(!(this.mydata.trackeraccounts[index].months[i].month_id === monthId))
                {
                    continue;
                }
                else
                {
                    matchesCount++;
                }
            }
            if(matchesCount === 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    /**
     * to make sure to acces the right month, it has to be checked, who is the active user
     * @returns index
     */
    public monthArrayOfWho() {
        let activeAcc = this.mydata.activeTrackeraccount;
        for(let i = 0 ; i < this.mydata.trackeraccounts.length ; i++)
        {
            if(this.mydata.trackeraccounts[i].name === activeAcc)
            {
                return i;
            }
        }
    }
    /**
     * for first time opening. To make sure to show the "firstOpen" information then
     * @returns 
     */
    public isDataExistent(): Boolean {
        if(!this.dataAsString) return false;
        else return true;
    }
    public createTrackeraccount(name: string, groc: string, sal: string) {
        if(!this.dataAsString)
        {
            this.createFirstData(name);
            this.createTrackeraccount(name, groc, sal);
        }
        else if(this.dataAsString)
        {
            this.mydata.trackeraccounts.push(new Trackeraccount(name, groc, sal));
            this.saveData();
        }
    }
    /**
     * set up the first user with all of his parameters
     * @param name string oif the very first user
     */
    private createFirstData(name: string) {
        let langIndicator: string | null = localStorage.getItem("kamedin-moneytracker-language");
        this.mydata.language = langIndicator!;
        this.mydata.trackeraccounts = [];
        this.mydata.activeTrackeraccount = name;
        this.saveData();
    }
    public saveData() {
        localStorage.setItem("kamedin-moneytracker", JSON.stringify(this.mydata));
        this.dataAsString = localStorage.getItem("kamedin-moneytracker");
    }
    private loadLanguage(): string {
        let langString: string;
        let langData = localStorage.getItem("kamedin-moneytracker-language");
        langString = langData!;

        return langString;
    }
    private loadData(): any {
        let dataString: string;
        let obj: any;
        let trashObject: any;
        let myData = localStorage.getItem("kamedin-moneytracker");
        if(myData)
        {
            trashObject = JSON.parse(myData);
        }
        else
        {
            trashObject = {};
        }
        return trashObject;
    }
}