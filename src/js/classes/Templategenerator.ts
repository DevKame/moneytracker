
import {Lang} from "../classes/Lang.js";

export class Templategenerator {
    Lang: any;
    constructor() {
        this.Lang = new Lang();
    }

    // ##########      PRE DESIGNED TEMPLATES      - S T A R T -##########

    
    //////////////////////////////////////////////////////////////////////////////////
    // TRANSACTIONS WRAPPER ______________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    private render_transBoxesSingle(trans: any) {
        let box = this.render_element("div", ["trans-box", "flex-center"]);
            let subHolderLeft = this.render_element("div", ["trans-sub-holder-left", "flex-center"]);
            trans.type === "expense" ? subHolderLeft.classList.add("neg-field") : subHolderLeft.classList.add("pos-field");
                let bigHolder1 = this.render_element("div", ["trans-big-holder", "flex-start"]);
                    let tName = this.render_textElement("p", trans.category, undefined, ["trans-name"]);
                bigHolder1.append(tName);
                let smallHolder1 = this.render_element("div", ["trans-small-holder", "flex-start"]);
                    let tAmount = this.render_textElement("p", trans.amount.toFixed(2) + "€", undefined, ["trans-amount"]);
                smallHolder1.append(tAmount);

                let bigHolder2 = this.render_element("div", ["trans-big-holder", "flex-start"]);
                let tDate = this.render_textElement("p", trans.date, undefined, ["trans-date"]);
                    bigHolder2.append(tDate);

                let smallHolder2 = this.render_element("div", ["trans-small-holder", "flex-start"]);
                    let tType = this.render_textElement("p", this.Lang.lang("Einzelbetrag"), undefined, ["trans-type"]);
                smallHolder2.append(tType);

            let subHolderRight = this.render_element("div", ["trans-sub-holder-right", "flex-center"]);
                let btnHolder = this.render_element("div", ["transactions-button-holder", "flex-center"]);
                let delBtn = this.render_element("div", ["delete-trans-button", "interface-buttons", "circle-shapes", "clickable"]);
                    delBtn.setAttribute("mt_ident", trans.identifier);
                    btnHolder.append(delBtn);
            
            subHolderRight.append(btnHolder);
            subHolderLeft.append(bigHolder1);
            subHolderLeft.append(smallHolder1);
            subHolderLeft.append(bigHolder2);
            subHolderLeft.append(smallHolder2);

        box.append(subHolderLeft);
        box.append(subHolderRight);

        box.setAttribute("mt_ident", trans.identifier);

        return box;
    }
    private render_transBoxesRunning(trans: any) {
        let box = this.render_element("div", ["trans-box", "flex-center"]);
            let subHolderLeft = this.render_element("div", ["trans-sub-holder-left", "flex-center"]);
            trans.type === "expense" ? subHolderLeft.classList.add("neg-field") : subHolderLeft.classList.add("pos-field");
                let bigHolder1 = this.render_element("div", ["trans-big-holder", "flex-start"]);
                    let tName = this.render_textElement("p", trans.category, undefined, ["trans-name"]);
                bigHolder1.append(tName);
                let smallHolder1 = this.render_element("div", ["trans-small-holder", "flex-start"]);
                    let tAmount = this.render_textElement("p", trans.amountPerMonth.toFixed(2) + "€", undefined, ["trans-amount"]);
                smallHolder1.append(tAmount);

                let bigHolder2: any;
                let tDate: any;
                if(!trans.date)
                {
                    let addInfo: string = "";
                    bigHolder2 = this.render_element("div", ["trans-big-holder", "flex-start"]);
                        switch(trans.due)
                        {
                            case "week":
                                addInfo = this.Lang.lang("wöch.: ");
                                break;
                            case "month":
                                addInfo = this.Lang.lang("mtl.: ");
                                break;
                            case "quarter":
                                addInfo = this.Lang.lang("quart.: ");
                                break;
                            case "halfyear":
                                addInfo = this.Lang.lang("halbjährl.: ");
                                break;
                            case "year":
                                addInfo = this.Lang.lang("jährl.: ");
                                break;
                        }
                        tDate = this.render_textElement("p", addInfo + trans.amount.toFixed(2) + "€", undefined, ["trans-date"]);
                    bigHolder2.append(tDate);
                }
                else
                {
                    bigHolder2 = this.render_element("div", ["trans-big-holder", "flex-start"]);
                    tDate = this.render_textElement("p", trans.date, undefined, ["trans-date"]);
                    bigHolder2.append(tDate);
                }

                let smallHolder2 = this.render_element("div", ["trans-small-holder", "flex-start"]);
                    let content: string = "";
                    trans.date === undefined ? content = "Fixbetrag" : content = "Einzelbetrag";
                    let tType = this.render_textElement("p", content, undefined, ["trans-type"]);
                smallHolder2.append(tType);

            let subHolderRight = this.render_element("div", ["trans-sub-holder-right", "flex-center"]);
                let btnHolder = this.render_element("div", ["transactions-button-holder", "flex-center"]);
            subHolderRight.append(btnHolder);
                if(trans.date)
                {
                    let delBtn = this.render_element("div", ["delete-trans-button", "interface-buttons", "circle-shapes", "clickable"]);
                    delBtn.setAttribute("mt_ident", trans.identifier);
                    btnHolder.append(delBtn);
                }
            subHolderLeft.append(bigHolder1);
            subHolderLeft.append(smallHolder1);
            subHolderLeft.append(bigHolder2);
            subHolderLeft.append(smallHolder2);

        box.append(subHolderLeft);
        box.append(subHolderRight);

        box.setAttribute("mt_ident", trans.identifier);

        return box;
    }
    public refresh_transBody(runnings: any[], month: any) {
        let body = document.getElementById("trans-body")!;
        for(let i = 0 ; i < body.children.length ; i++)
        {
            body.children[0].remove();
        }
        if(runnings.length > 0)
        {
            for(let i = 0 ; i < runnings.length ; i++)
            {
                body.append(this.render_transBoxesRunning(runnings[i]));
            }
        }
        if(month.expenses.length > 0)
        {
            for(let i = 0 ; i < month.expenses.length ; i++)
            {
                body.append(this.render_transBoxesSingle(month.expenses[i]));
            }
        }
        if(month.earnings.length > 0)
        {
            for(let i = 0 ; i < month.earnings.length ; i++)
            {
                body.append(this.render_transBoxesSingle(month.earnings[i]));
            }
        }
    }
    public render_transWrapper(month: string, year: number) {
        let wrapper = this.render_element("div", ["box", "clickable", "flex-column"], ["trans-wrapper"]);
            let tHead = this.render_element("div", ["trans-head", "flex-around"], ["trans-head"]);
                let hl = this.render_textElement("h3", this.Lang.lang(month) + " " + year);
            tHead.append(hl);
            let tBody = this.render_element("div", ["trans-body", "flex-column", "col-items-wrapper"], ["trans-body"]);
            let tFoot = this.render_element("div", undefined, ["trans-foot"]);
        wrapper.append(tHead);
        wrapper.append(tBody);
        wrapper.append(tFoot);
        return wrapper;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // TRANSACTIONS WRAPPER ______________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////
    // DASHBOARD _________ ______________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    public render_dashboardHolder(dMan: any, id: string, accIndex: number, monthDays: number) {
        let holder = this.render_element("div", ["dashboard-holder", "box", "flex-column"], ["dashboard-holder"]);
        let dHead = this.render_element("div", ["dashboard-head", "flex-between"], ["dashboard-head"]);
            let headP = this.render_textElement("p", "Dashboard");
        dHead.append(headP);
        holder.append(dHead);

        /**within dashboard are shown different data: 
         * this returns an object with all those relevant data
         * arguments are:
         * dMan     = datamanager object to calculate the data
         * id       = month_id
         * accIndex = index of the account from which the month data are used
         * mDays    = total Of Days of the month
         * today    = todays Date to compute the remain days for daily budget
         */
        let dbData = dMan.get_dashboardData(
            dMan,
            id,
            accIndex,
            monthDays,
            new Date().getDate(),
            new Date().getDay()
            );
        let dBody = this.render_element("div", ["dashboard-body", "flex-column", "relative"], ["dashboard-body"]);
            let hlBalance = this.render_textElement("p", this.Lang.lang("Bilanz: "), undefined, ["hl-balance"]);
            let balanceSpan = this.render_textElement("span", dbData.balance.toFixed(2)+"€", ["underlined"]);
            if(dbData.balance < 0)
            {
                balanceSpan.classList.add("neg-balance");
            }
            else
            {
                balanceSpan.classList.add("pos-balance");
            }
            hlBalance.insertAdjacentElement("beforeend", balanceSpan);
        dBody.append(hlBalance);
            
            let hlEarnings = this.render_textElement("p", this.Lang.lang("Einnahmen: "), undefined, ["hl-inputs"]);
            let earningSpan = this.render_textElement("span", (dbData.earningsTotal + dbData.fixedEarnings).toFixed(2)+"€", ["reg-db-p", "pos-balance"]);
            hlEarnings.insertAdjacentElement("beforeend", earningSpan);
        dBody.append(hlEarnings);

            let hlFExpenses = this.render_textElement("p", this.Lang.lang("Fixkosten: "), undefined, ["hl-fixed-costs"]);
            let fExpenseSpan = this.render_textElement("span", dbData.fixedExpenses.toFixed(2)+"€", ["reg-db-p", "neg-balance"]);
            hlFExpenses.insertAdjacentElement("beforeend", fExpenseSpan);
        dBody.append(hlFExpenses);
        
        let hlExpenses = this.render_textElement("p", this.Lang.lang("Einzelausgaben: "), undefined, ["hl-single-costs"]);
        let expenseSpan = this.render_textElement("span", dbData.expensesTotal.toFixed(2)+"€", ["reg-db-p", "neg-balance"]);
        hlExpenses.insertAdjacentElement("beforeend", expenseSpan);
    dBody.append(hlExpenses);

    dBody.append(this.render_textElement("p", this.Lang.lang("Daraus resultiert:")));
    dBody.append(document.createElement("hr"));

        
        let hlaverageWeek = this.render_textElement("p", this.Lang.lang("Wochenbudget: "), undefined, ["hl-average-week"]);
        let averageWeekSpan = this.render_textElement("span", dbData.weeklyBudget.toFixed(2)+"€", ["reg-db-p", "neutral-text"]);
        hlaverageWeek.insertAdjacentElement("beforeend", averageWeekSpan);
    dBody.append(hlaverageWeek);
        
        let hlaverageDay = this.render_textElement("p", this.Lang.lang("Tagesbudget: "), undefined, ["hl-average-day"]);
        let averageDaySpan = this.render_textElement("span", dbData.daylyBudget.toFixed(2)+"€", ["reg-db-p", "neutral-text"]);
        hlaverageDay.insertAdjacentElement("beforeend", averageDaySpan);
    dBody.append(hlaverageDay);

    let detailButton = this.render_element("button", ["absolute", "clickable"]);
    detailButton.innerText = "Details";

    dBody.append(detailButton);
    
    let dFoot = this.render_element("div", ["dashboard-foot"], ["dashboard-foot"]);
    
    holder.append(dBody);
    holder.append(dFoot);
    return holder;
    }
    public render_starMenu() {
        let omniContainer = this.render_element("div", ["relative"], ["star-menu-container"]);
            let masterCon = this.render_sMenus("master", "Menü");
            let singleCon = this.render_sMenus("single", "Einmalig");
            let repeatCon = this.render_sMenus("repeat", "Wiederholt");
            let categoryCon = this.render_sMenus("category", "Kategorien");
            let userCon = this.render_sMenus("user", "Accounts");
        omniContainer.append(masterCon);
        omniContainer.append(singleCon);
        omniContainer.append(repeatCon);
        omniContainer.append(categoryCon);
        omniContainer.append(userCon);

        return omniContainer;
    }
    private render_sMenus(kind: string, headline: string) {
        let container = this.render_element(
            "div",
            ["sMenu-wrappers", `sMenu-${kind}-container`, "flex-column", "not-clicked", "absolute"],
            [`sMenu-${kind}-container`]);

            let conHead = this.render_element("div", ["mCon-head", "flex-center"]);
                let headP = this.render_textElement("p", headline);
            conHead.append(headP);

            let conBody = this.render_element("div", ["mCon-body", "flex-center"]);
                let button = this.render_element(
                    "button",
                    ["master-buttons", "buttons", "circle-shapes", "not-clicked", "clickable", "relative"],
                    [`sMenu-${kind}-button`]);
                if(kind === "master")
                {
                    for(let i = 0 ; i < 3 ; i++)
                    {
                        let stripe = this.render_element("div", ["hamburger-stripes", "absolute"]);
                        button.append(stripe);
                    }
                }
            conBody.append(button);
        container.append(conHead);
        container.append(conBody);
        return container;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // DASHBOARD __________________________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////
    // ACCOUNTS_ ________________________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    public refresh_accountWrapper(names: string[], activeAcc: string) {
        let wrapper = document.getElementById("accounts-wrapper")!;
        let wrapperLength = document.querySelectorAll(".delete-acc-button").length;
        for(let i = 0 ; i < wrapperLength ; i++)
        {
            wrapper.firstElementChild?.remove();
        }

        for(let i = 0 ; i < names.length ; i++)
        {
            let aBox = this.render_accountBox(names[i], activeAcc);
            wrapper.append(aBox);
        }
    }
    private render_accountBox(name: string, activeAcc: string) {
        let box = this.render_element("div", ["accounts-box", "flex-between"]);
            let pHolder = this.render_element("div", ["accounts-p-holder", "flex-start"]);
                let p = this.render_textElement("p", name);
                let radio = this.render_element("input", ["clickable"]) as HTMLInputElement;
                radio.setAttribute("type", "radio");
                radio.setAttribute("name", "activeAcc");
                if(name === activeAcc)
                {
                    radio.checked = true;
                }
            pHolder.append(p);
            pHolder.append(radio);

            let bHolder = this.render_element("div", ["accounts-button-holder", "flex-center"]);
                let btn = this.render_element("div", ["delete-acc-button", "interface-buttons", "circle-shapes", "clickable"]);
            bHolder.append(btn);
        box.append(pHolder);
        box.append(bHolder);
        return box;
    }
    render_accountWrapper() {
        return this.render_element("div", ["col-items-wrapper", "box"], ["accounts-wrapper"]);
    }
    //////////////////////////////////////////////////////////////////////////////////
    // ACCOUNTS_ __________________________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////
    // CATEGORIES_ ________________________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    public render_categoryWrapper(cats: string[]) {
        let wrapper = this.render_element("div", ["col-items-wrapper", "box"], ["category-wrapper"]);
            for(let i = 0 ; i < cats.length ; i++)
            {
                let cBox = this.render_categoryBoxes(cats[i]);
                wrapper.append(cBox);
            }
        return wrapper;

    }
    public refresh_categoryBox(value: string, dMan: any) {
        let wrapper = document.getElementById("category-wrapper")!;
            let box = this.render_categoryBoxes(value)!;
            wrapper.append(box);

        let del = box.querySelector(".delete-cat-button")!;
        del.addEventListener("click", () => {
            let boxValue = box.querySelector("p") as HTMLParagraphElement;
            dMan.delete_category(boxValue.innerText);
            box.remove();
        });

    }
    private render_categoryBoxes(value: string) {
        let box = this.render_element("div", ["category-box", "flex-between"]);
            let pHolder = this.render_element("div", ["category-p-holder", "flex-start"]);
                let p = this.render_textElement("p", value);
            pHolder.append(p);
            let bHolder = this.render_element("div", ["category-button-holder", "flex-center"]);
                let btn = this.render_element("div", ["delete-cat-button", "interface-buttons", "circle-shapes", "clickable"]);
            bHolder.append(btn);
        box.append(pHolder);
        box.append(bHolder);
        return box;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // CATEGORIES_ ______________________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////
    // REPEATING TRANSACTION_____________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    public render_importantInfo(infoTxt: string) {
        let block = this.render_textBlock();
            let text = this.render_textElement("p", infoTxt);
        block.append(text);
        block.style.border = "2px solid tomato";
        return block;
    }
    public render_regularityWrapper() {
        let wrapper = this.render_element("div", ["box", "flex-column"], ["regularity-wrapper"]);

        let box1of3 = this.render_radioBoxes(
            ["monthly-pay", "weekly-pay"],
            [this.Lang.lang("im Monat"), this.Lang.lang("in der Woche")],
            "regularity-pays");
        box1of3.classList.replace("flex-center", "flex-start");
        
        let box2of3 = this.render_radioBoxes(
            ["quarterly-pay", "hYear-pay"],
            [this.Lang.lang("im Quartal"), this.Lang.lang("im Halbjahr")],
            "regularity-pays");
        box2of3.classList.replace("flex-center", "flex-start");
        
        let box3of3 = this.render_element("div", ["box", "flex-start"]);
            let subBox = this.render_element("div", ["double-item-container", "flex-around"]);
            let lastRadio = this.render_element("input", ["clickable"], ["yearly-pay"]);
            lastRadio.setAttribute("type", "radio");
            lastRadio.setAttribute("name", "regularity-pays");
            let lastLabel = this.render_element("label", ["clickable"]);
            lastLabel.setAttribute("for", "yearly-pay");
            lastLabel.innerText = this.Lang.lang("im Jahr");
        subBox.append(lastRadio);
        subBox.append(lastLabel);
        box3of3.append(subBox);
        wrapper.append(box1of3);
        wrapper.append(box2of3);
        wrapper.append(box3of3);
        return wrapper;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // REPEATING TRANSACTION_______________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////
    // SINGLE TRANSACTION________________________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    public render_datepicker(
        monthName: string,
        fullYear: string,
        dayCount: number,
        firstWeekDay: number,
        weekCount: number[])
        {
        let wrapper = this.render_element("div", ["box", "flex-column"], ["date-picker-wrapper"]);
        let head = this.render_element("div", ["flex-around"], ["dPicker-head"]);
            let preM = this.render_element("div", ["back-buttons", "dPicker-head-arrows", "clickable"], ["btn-pre-month"]);
            let hl = this.render_textElement("h3", `${this.Lang.lang(monthName)} ${fullYear}`);
            let today = this.render_element("button", ["dPicker-todays-date-button", "clickable"]);
            today.innerText = this.Lang.lang("Heute");
            let nexM = this.render_element("div", ["next-buttons", "dPicker-head-arrows", "clickable"], ["btn-next-month"]);
        head.append(preM);
        head.append(hl);
        head.append(today);
        head.append(nexM);
        
        let body = this.render_element("div", ["flex-column"], ["dPicker-body"]);
        let mainWeekRow = this.render_element("div", ["flex-center"], ["weekday-row"]);
        for(let i = 0 ; i < 7 ; i++)
        {
            let wDayField = this.render_weekdayFields(i);
            mainWeekRow.append(wDayField);
        }

        body.append(mainWeekRow);
        this.render_dPickerBody(dayCount, body, firstWeekDay, weekCount);
        
        let foot = this.render_element("div")
        foot.id = "dPicker-foot";
        
        wrapper.append(head);
        wrapper.append(body);
        wrapper.append(foot);

        return wrapper;

    }
    public render_dPickerBody(
        dayCount: number,
        element: HTMLElement,
        firstWeekDay: number,
        weekCount: number[]) {
        let countDays: number = 1;
        for(let i = 0 ; i < weekCount.length ; i++)
        {
            let wRow = this.render_element("div", ["week-row", "flex-center"]);
                for(let j = 0 ; j < 7 ; j++)
                {
                    let dField = this.render_element("div", ["day-field", "clickable", "relative"]);
                    if(j === 5 || j === 6)
                    {
                        dField.classList.add("weekend-field");
                    }
                        let p = this.render_element("p", ["day-field-number"]);
                        if(i === 0)
                        {
                            if(j === firstWeekDay)
                            {
                                p.innerText = countDays.toString();
                                countDays++;
                            }
                            else if(j > firstWeekDay)
                            {
                                p.innerText = countDays.toString();
                                countDays++;
                            }
                        }
                        else if(i > 0)
                        {
                            if(countDays <= dayCount)
                            {
                                p.innerText = countDays.toString();
                                countDays++;
                            }
                        }
                    dField.append(p);
                    wRow.append(dField);
                }
            element.append(wRow);
        }
    }
    private render_weekdayFields(index: number) {
        let field = this.render_element("div", ["weekday-field", "flex-center"]);
        switch(index) {
            case 0:
                field.innerText = "Mo";
                break;
            case 1:
                field.innerText = "Di";
                break;
            case 2:
                field.innerText = "Mi";
                break;
            case 3:
                field.innerText = "Do";
                break;
            case 4:
                field.innerText = "Fr";
                break;
            case 5:
                field.innerText = "Sa";
                field.classList.add("weekend-field");
                break;
            case 6:
                field.innerText = "So";
                field.classList.add("weekend-field");
                break;
        }
        return field;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // SINGLE TRANSACTION_______________________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////
    // GENERALLY USED DOM ELEMENTS _____________________________________________START
    //////////////////////////////////////////////////////////////////////////////////
    render_welcomeHeadline(
        partOfDay: string,
        name: string,
        weekdayName: string,
        fullDate: string,
        calWeek: string) {
        let con = this.render_element("div", ["wel-hl-container"], ["welcome-headline"]);
            let h3 = this.render_textElement("h3", `${this.Lang.lang(partOfDay)}` + `${name}`);
            let h4 = `${this.Lang.lang(weekdayName)}, ${fullDate} (${calWeek}.${this.Lang.lang("KW")})`;
        con.append(h3);
        con.append(h4);
        return con;
    }
    render_masterHeadline() {
        let master: HTMLElement = document.createElement("h2");
        master.setAttribute("id", "master-headline");
        master.innerHTML = '<span class="kame-font">Kamedin´s</span> Moneytracker';
        return master;
    }
    render_textBlock() {
        let tb = document.createElement("div");
        tb.setAttribute("class", "text-block");
        return tb;
    }
    render_inputBlock(inputId: string, placeHolder: string, sideInfo: string, buttonId: string) {
        let inputBlock = this.render_element("div", ["input-block", "flex-column"]);
            let tInput = this.render_element("input", ["input-block-tInput", "clickable"]) as HTMLInputElement;
            tInput.setAttribute("type", "text");
            tInput.setAttribute("id", inputId);
            tInput.placeholder = this.Lang.lang(placeHolder);
            tInput.maxLength = 15;
            let inputIntHolder = this.render_element("div", ["input-int-holder", "flex-center"]);
        inputBlock.append(tInput);
        inputBlock.append(inputIntHolder);

            let inputPHolder = this.render_element("div", ["input-int-p-holder", "flex-start"]);
                let inputP = this.render_textElement("p", this.Lang.lang(sideInfo));
            inputPHolder.append(inputP);

            let inputBtnHolder = this.render_element("div", ["input-int-button-holder", "flex-between", "relative"]);
                let secInput = this.render_element("div", ["secondary-input", "sec-inside", "rounded-edges", "flex-end", "absolute"]);
                    let secP = this.render_textElement("p", this.Lang.lang("Bestätige"));
                secInput.append(secP);

                let intWrapper = this.render_element("div", ["input-int-wrapper", "circle-shapes", "flex-center", "relative"]);
                    let okBtn = this.render_element("button", ["clickable", "input-block-button", "absolute"], [buttonId]);
                    okBtn.innerText = "O K";
                intWrapper.append(okBtn);
            
            inputBtnHolder.append(secInput);
            inputBtnHolder.append(intWrapper);
        
        inputIntHolder.append(inputPHolder);
        inputIntHolder.append(inputBtnHolder);

        return inputBlock;
    }
    render_inputError(eMsg: string) {
        let relativeHolder = document.querySelector(".input-int-button-holder")!;


        let holder = document.createElement("div");
        holder.setAttribute("id", "input-error-holder");
        holder.classList.add("input-error-holder");
        holder.classList.add("flex-column");
        holder.classList.add("absolute");
            let eBody = document.createElement("div");
            eBody.classList.add("error-body");
            eBody.classList.add("flex-center");
                let errorMsg = this.render_textElement("p", this.Lang.lang(eMsg), ["error-message"]);
            eBody.append(errorMsg);
            let eFoot = document.createElement("div");
            eFoot.classList.add("error-foot");
        holder.append(eBody);
        holder.append(eFoot);

        relativeHolder.append(holder);
        setTimeout(() => {
            let errorHolders = document.querySelectorAll(".input-error-holder");
            for(let i = 0 ; i < errorHolders.length ; i++)
            {
                errorHolders[0].remove();
            }
        }, 1100);
    }
    public render_select(cats: string[], classes?: string[], ids?: string[]) {
        let select = this.render_element("select", classes, ids);
            if(cats.length > 0)
            {
                for(let i = 0 ; i < cats.length ; i++)
                {
                    let option = this.render_element("option", ["clickable"]);
                    option.innerText = cats[i];
                    select.append(option);
                }
            }
        return select;

    }
    public render_radioBoxes(id: string[], labelContent: string[], name: string, containerId?: string) {
        let container;
        if(containerId)
        {
            container = this.render_element("div", ["box", "flex-center"], [containerId]);
        }
        else
        {
            container = this.render_element("div", ["box", "flex-center"]);
        }
        
            let outputHolder = this.render_element("div", ["double-item-container", "flex-around"]);
                let radioOut = this.render_element("input", ["clickable"], [id[0]]) as HTMLInputElement;
                radioOut.setAttribute("type", "radio");
                radioOut.setAttribute("name", name);
                radioOut.checked = true;
                let labelOut = this.render_element("label", ["clickable"]);
                labelOut.setAttribute("for", id[0]);
                labelOut.innerText = labelContent[0];
            outputHolder.append(radioOut);
            outputHolder.append(labelOut);
            
            let inputHolder = this.render_element("div", ["double-item-container", "flex-around"]);
                let radioIn = this.render_element("input", ["clickable"], [id[1]]) as HTMLInputElement;
                radioIn.setAttribute("type", "radio");
                radioIn.setAttribute("name", name);
                let labelIn = this.render_element("label", ["clickable"]);
                labelIn.setAttribute("for", id[1]);
                labelIn.innerText = labelContent[1];
            inputHolder.append(radioIn);
            inputHolder.append(labelIn);
        container.append(outputHolder);
        container.append(inputHolder);
        return container;

    }
    public render_breadCrump() {
        let container = this.render_element("div", ["flex-start", "clickable"], ["bread-crump-container"]);
            let bBtn = this.render_element("div", ["back-buttons"]);
            let hl = this.render_textElement("h5", "Zurück zum Dashboard");
        container.append(bBtn);
        container.append(hl);
        return container;
    }
    //////////////////////////////////////////////////////////////////////////////////
    // GENERALLY USED DOM ELEMENTS _____________________________________________END
    //////////////////////////////////////////////////////////////////////////////////
    // ##########      PRE DESIGNED TEMPLATES      - E N D -##########

    
    // ##########      BASIC DOM ELEMENTS      - S T A R T -##########
    render_textElement(type: string, textContent: string, classArray?: string[], idArray?: string[]) {
        let te = document.createElement(type);
        te.innerText = this.Lang.lang(textContent);
        if(classArray)
        {
            this._applyClasses(te, classArray);
        }
        if(idArray)
        {
            this._applyIds(te, idArray);
        }
        return te;
    }
    render_element(type: string, classArray?: string[], idArray?: string[]) {
        let container = document.createElement(type);
        if(classArray) this._applyClasses(container, classArray);
        if(idArray) this._applyIds(container, idArray);
        return container;
    }
    // ##########      BASIC DOM ELEMENTS      - E N D -##########

    _applyClasses(element: HTMLElement, classAr: string[]): void {
        for(let i = 0 ; i < classAr.length ; i++)
        {
            element.classList.add(classAr[i]);
        }
    }
    _applyIds(element: HTMLElement, idAr: string[]): void {
        if(idAr.length === 1)
            {
                element.setAttribute("id", idAr[0]);
            }
            else
            {
                let id = "";
                for(let i = 0 ; i < idAr.length ; i++)
                {
                    if(id === "")
                    {
                        id = idAr[i];
                    }
                    else
                    {
                        id = id + " " + idAr[i];
                    }
                }
                element.setAttribute("id", id);
            }
    }
}