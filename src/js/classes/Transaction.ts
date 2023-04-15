


export class Transaction {
    type: string;
    date: string;
    category: string;
    amount: number;
    identifier: string;
    constructor(type: string, date: string, category: string, amount: number, identifier: string) {
        this.type = type;
        this.date = date;
        this.category = category;
        this.amount = amount;
        this.identifier = identifier;
    }
}

export class Multitransaction {
    type: string;
    due: string;
    category: string;
    amount: number;
    amountPerMonth: number;
    identifier: string;
    constructor(type: string, due: string, category: string, amount: number, amountPerMonth: number, identifier: string) {
        this.type = type;
        this.due = due;
        this.category = category;
        this.amount = amount;
        this.amountPerMonth = amountPerMonth;
        this.identifier = identifier;
    }
}