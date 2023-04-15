
import {Lang} from "../classes/Lang.js";

export class Timemanager {
    weekdays: string[];
    months: string[];
    Lang: any;
    constructor() {
        this.weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
        this.months = [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember"
        ];
        this.Lang = new Lang();
    }
    //////////////////////////////////////////////////////////////////////////////////
    // USED METHODS FOR __________________SINGLE TRANSACTION DATE PICKER_________START
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * 
     * @param headline Headlines String of date-picker, containes shownMonth and Year
     * @returns array with two numbers: incremented Index of Month and year
     */
    public get_DateFromPickerHeadline(headline: string) {
        let monthName = this.Lang.enTOdeu(headline.slice(0, headline.indexOf(" ")).trim());

        let year = +headline.slice((headline.indexOf(" ")) + 1);
        return [this.months.indexOf(monthName), year];
    }
    /**
     * 
     * @param days totalDays of the given month?
     * @param monthName month we want to determine the calendarweeks
     * @param fullYear year of the specific month we´re looking at
     * @returns an array. length of it shows how many calenderweeks that month has
     *          the array-elements show how many days this specific week has
     */
    public get_totalMonthWeeks(days: number, monthName: string, fullYear: number) {
        let weeks: number[] = [];
        let totalDays = days;
        
        let first_weekday_of_month = this.get_FirstWeekday(monthName, fullYear);
        
        //to generate the weekrows:
        let startday = first_weekday_of_month;
        while (totalDays > 0)
        {
            //determine the weekday of the first of the week:
            if(totalDays < 8)
            {
                weeks.push(totalDays);
            }
            else
            {
                weeks.push(7 - startday);
            }
            totalDays = totalDays - (7 - startday);
            if(startday !== 0)
            {
                startday = 0;
            }
        }
        return weeks;
    }
    /**
     * 
     * @param monthName 
     * @param fullYear 
     * @returns the weekday of the 1st of the given month as index
     */
    public get_FirstWeekday(monthName: string, fullYear: number) {
        let date = new Date(fullYear, this.months.indexOf(monthName), 1);
        let day = date.getDay();
        return this.adjust_weekday_indices(day);
    }
    /**
     * when the optional arguments are omitted, we are looking at todays month then
     * @param newMonth (optional)index of the month we want to analyze
     * @param newYear (optional) year of the soon to be analyzed month
     * @returns the total sum of the days regarding the analyzed month
     */
    public get_totalMonthDays(newMonth?: number, newYear?: number): number {
        let count: number;
        let month: number = 0;
        newMonth !== undefined && newYear !== undefined ? month = new Date(newYear!, newMonth).getMonth() : month = new Date().getMonth();
        switch(month)
        {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                count = 31;
                break;
            case 3:
            case 5:
            case 8:
            case 10:
                count = 30;
                break;
            case 1:
                let countFeb: number = 28;
                let y: number = newYear === undefined ? new Date().getFullYear() : newYear;
                if(y % 4 === 0) countFeb++;
                if(y % 100 === 0) countFeb--;
                if(y % 400 === 0) countFeb++;
                count = countFeb;
                break;
        }
        return count!;
    }
    /**
     * 
     * @returns the name of todays month as string
     */
    public get_todaysMonthName(): string {
        return this.months[new Date().getMonth()];
    }
    /**
     * 
     * @returns todays year as number
     */
    public get_todaysFullYear(): number {
        return new Date().getFullYear();
    }
    //////////////////////////////////////////////////////////////////////////////////
    // USED METHODS FOR __________________SINGLE TRANSACTION DATE PICKER_________END
    //////////////////////////////////////////////////////////////////////////////////



    public convert_YearAndMonth_to_monthId(dateString: string): string {
        let array: number[] = [];
        array.push(+dateString.slice(6));
        array.push(+dateString.slice(3, 5) - 1);
        return this.get_monthId(array);
    }
    /**
     * 
     * @returns a string that indicates the calendarweek, we are in today
     */
    public get_calendarweek(): string {
        let currentdate: any = new Date();
        let oneJan: any = new Date(currentdate.getFullYear(),0,1);
        let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        let result: number = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
        let cWeek: string = result.toString();
        switch(cWeek.length)
        {
            case 1:
                cWeek = "0" + cWeek;
                break;
            default:
                break;
        }
        return cWeek;
    }
    /**
     * 
     * @returns a string with a new month id in the format "mmm-yyyy"
     */
    public get_monthId(arrayArg?: number[]): string {
        let date: Date;
        if(arrayArg)
        {
            date = new Date(arrayArg[0], arrayArg[1]);
        }
        else
        {
            date = new Date();
        }
        let monthIndex: number = date.getMonth();
        let month: string = this.months[monthIndex].slice(0, 3);
        month = month.replace("ä", "a").toLowerCase();
        
        let year: number = date.getFullYear();
        return month + "-" + year.toString();
    }
    /** returns the welcome text dependent on current time
     */
    public get_db_headline_partOfDay(): string {
        let partOfDay: string = " ";
        let date: Date = new Date();
        let hour: number = +date.getHours().toString();
        if(hour >= 0 && hour <= 4) partOfDay = "Guten Abend, ";
        if(hour >= 5 && hour <= 11) partOfDay = "Guten Morgen, ";
        else if(hour >= 12 && hour <= 18) partOfDay = "Guten Tag, ";
        else if(hour >= 19 && hour <= 24) partOfDay = "Guten Abend, ";
        return partOfDay;
    }
    /** returns the name of the weekday for the welcome line
     */
    public get_db_headline_weekday(): string {
        let date: Date = new Date();
        let day: number = this.adjust_weekday_indices(date.getDay());
        return this.weekdays[day];
    }
    /**
     * 
     * @param arrayArg if not the todays date is needed, this function gets an array with day, month and year
     * @returns a String with a date in Format DD-MM-YYYY
     */
    public get_full_date(arrayArg?: any[]): string {
        let date: any = 0;
        if(!arrayArg)
        {
            date = new Date();
        }
        else
        {
            date = new Date(arrayArg[2], arrayArg[1], arrayArg[0]);
        }
        let dayNumber = date.getDate().toString();
        let monthNumber = (date.getMonth() + 1).toString();
        let yearNumber = date.getFullYear().toString();
        switch(dayNumber.length)
        {
            case 1:
                dayNumber = "0" + dayNumber;
                break;
            default:
                break;
        }
        switch(monthNumber.length)
        {
            case 1:
                monthNumber = "0" + monthNumber;
                break;
            default:
                break;
        }
        
        return dayNumber + "." + monthNumber + "." + yearNumber;
    }
    /**
     * For some reason, "0" is not the index for monday but for sunday.
     * To make is less confusing this adjust them so i can work with Monday = 0, etc.
     * @param num index of the weekday
     * @returns better human readable index
     */
    private adjust_weekday_indices(num: number): number {
        let digit: number = 0;
        switch(num)
        {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                digit = num - 1;
                break;
            case 0:
                digit = 6;
                break;
        }
        return digit;
    }
}