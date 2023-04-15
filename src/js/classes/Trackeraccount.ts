

export class Trackeraccount {
    name: string;
    months: Object[];
    categories: string[];
    runningTransactions: Object[];
    constructor(name: string, groceries: string, salary: string) {
        this.name = name;
        this.months = [];
        this.categories = [groceries, salary];
        this.runningTransactions = [];
    }
}