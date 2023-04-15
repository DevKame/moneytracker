
/**
 * Contains its unique id.
 * Contains every expense and earning
 */
export class Month {
    month_id: string;
    earnings: any[];
    expenses: any[];
    constructor(id: string) {
        this.month_id = id;
        this.earnings = [];
        this.expenses = [];
    }
}