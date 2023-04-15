//pre-defined DOM-Elements
import { Templategenerator } from "../Aggregator.js";
//handles everthing about users data
import { Datamanager } from "../Aggregator.js";
//validate inputs(amounts, names)
import { Validator } from "../Aggregator.js";
//everything to handle dates, times, etc
import { Timemanager } from "../Aggregator.js";
//everything to handle the switch between english and german
import { Lang } from "../Aggregator.js";
//classes for creatuing single or repeating Transactions
import { Transaction, Multitransaction } from "../Aggregator.js";


/**
 * Renders the required DOM-Elements
 * Animates DOM Elements
 * Handles the logic behind the EventListeners
 */
export class DOMGenerator {
    tGen: Templategenerator;
    vali: Validator;
    dMan: Datamanager;
    tMan: Timemanager;
    Lang: Lang;
    constructor() {
        this.tGen = new Templategenerator();
        this.vali = new Validator();
        this.dMan = new Datamanager();
        this.tMan = new Timemanager();
        this.Lang = new Lang();
    }
    public listener_deleteTransactions() {
        let allButtons = document.querySelectorAll(".delete-trans-button")!;
        allButtons.forEach(button => {
            button.addEventListener("click", (e: any) => {
                let attribute = e.target.getAttribute("mt_ident");
                this.dMan.delete_transaction(attribute, this.tMan.get_monthId());
                this.dMan.saveData();
                this.render_detailView();
            });
        });
    }
    public render_detailView() {
        this.clearDOM();
        let main: HTMLElement = document.querySelector("main")!;
        
        main.append(this.tGen.render_breadCrump());

        let breadCrump = document.getElementById("bread-crump-container")!;
        breadCrump.addEventListener("click", this.render_dashboard.bind(this));

        main.append(this.tGen.render_textElement("h3", this.Lang.lang("Detailansicht"), ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_textElement("h4", this.Lang.lang("Transaktionen"), ["underlined", "flex-item-left"]));
        
        main.append(this.tGen.render_transWrapper(this.tMan.get_todaysMonthName(), this.tMan.get_todaysFullYear()));
        this.tGen.refresh_transBody(
            this.dMan.mydata.trackeraccounts[this.dMan.monthArrayOfWho()!].runningTransactions,
            this.dMan.mydata.trackeraccounts[this.dMan.monthArrayOfWho()!].months[this.dMan.get_indexOfMonthId(this.tMan.get_monthId())]
        );
        this.listener_deleteTransactions();
        
    }
    public render_accounts() {
        this.clearDOM();
        let main: HTMLElement = document.querySelector("main")!;
        let accountNames: string[] = [];
        this.dMan.mydata["trackeraccounts"].forEach((account: any) => {
            accountNames.push(account.name);
        });

        main.append(this.tGen.render_breadCrump());
        main.append(this.tGen.render_textElement("h3", "Trackeraccounts", ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_textElement("h4", "Übersicht", ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_accountWrapper());
        this.tGen.refresh_accountWrapper(accountNames, this.dMan.mydata.activeTrackeraccount);

        main.append(this.tGen.render_textElement("h4", "Neuer Trackeraccount", ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_inputBlock("username-input", "Accountname...", "Name eingeben", "create-new-tracker-account-button"));

        this.listener_accounts();
    }
    public listener_accounts(onlyDelButtons?: Boolean) {
        if(!onlyDelButtons)
        {
            let breadCrump = document.getElementById("bread-crump-container")!;
            breadCrump.addEventListener("click", this.render_dashboard.bind(this));


            let newAcc = document.getElementById("create-new-tracker-account-button")!;
            newAcc.addEventListener("click", () => {
                this.animateInputButton("additional-username", "username-input", "create-new-tracker-account-button");
            });
        }
        let accountRadios = document.querySelectorAll(".accounts-p-holder input");
        accountRadios.forEach(radio => {
            radio.addEventListener("click", () => {
                let accountP = radio.previousElementSibling as HTMLParagraphElement;
                let accountName = accountP.innerText;
                this.dMan.set_newActiveAccount(accountName);
            });
        });
        
        let accSum = accountRadios.length;
        let delAcc = document.querySelectorAll(".delete-acc-button");
        delAcc.forEach(btn => {
            btn.addEventListener("click", () => {
                if(accSum > 1)
                {
                    let pHolder = btn.parentElement?.previousElementSibling!;
                    let p = pHolder.querySelector("p")! as HTMLParagraphElement;
                    let name = p.innerText;
                    this.dMan.delete_trackerAccount(name);


                    let newNameString: string[] = [];
                    this.dMan.mydata["trackeraccounts"].forEach((account: any) => {
                        newNameString.push(account.name);
                    });
                    this.tGen.refresh_accountWrapper(newNameString,
                    this.dMan.mydata.activeTrackeraccount
                    );
                    this.listener_accounts(false);
                }
            });
        });

        
        let input = document.getElementById("username-input")! as HTMLInputElement;
        input.addEventListener("focus", () => {
            this.resetInputButton("username-input", "create-new-tracker-account-button");
        });
    }
    public render_categories() {
        this.clearDOM();
        let main: HTMLElement = document.querySelector("main")!;
        let catSum = this.dMan.mydata["trackeraccounts"][this.dMan.monthArrayOfWho()!].categories.length;

        main.append(this.tGen.render_breadCrump());
        main.append(this.tGen.render_textElement("h3", this.Lang.lang("Kategorien"), ["underlined", "flex-item-left"]));
        let tBlock = this.tGen.render_textBlock();
            let tBlockp = this.tGen.render_textElement("p", this.Lang.lang("Indem du deinen Ausgaben Kategorien zuweist, ermöglichst du dir einen besseren Überblick. Lösche oder erstelle hier neue Kategorien"));
        tBlock.append(tBlockp);
        main.append(tBlock);
        main.append(this.tGen.render_textElement("h4", "Übersicht", ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_categoryWrapper(this.dMan.mydata["trackeraccounts"][this.dMan.monthArrayOfWho()!].categories));
        main.append(this.tGen.render_textElement("h4", "Neue Kategorie", ["underlined", "flex-item-left"]));
        main.append(this.tGen.render_inputBlock("catName-input", "Kategorienname...", "Kategorie eingeben", "create-new-category-button"));

        this.listener_categories(catSum);
    }
    public listener_categories(catSum: number) {
        if(catSum > 0)
        {
            let delButtons = document.querySelectorAll(".delete-cat-button");
            delButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    let box = btn.parentElement?.parentElement!;
                    let boxValue = box?.querySelector("p") as HTMLParagraphElement;
                    this.dMan.delete_category(boxValue.innerText);
                    box.remove();
                });
            });
        }
        let breadCrump = document.getElementById("bread-crump-container")!;
        breadCrump.addEventListener("click", this.render_dashboard.bind(this));

        let newCatBtn = document.getElementById("create-new-category-button");
        newCatBtn?.addEventListener("click", () => {
            this.animateInputButton("category", "catName-input", "create-new-category-button");
        });

        let input = document.getElementById("catName-input")! as HTMLInputElement;
        input.addEventListener("focus", () => {
            this.resetInputButton("catName-input", "create-new-category-button");
        });
    }
    public render_repeatingMenu() {
        this.clearDOM();
        
        let categoriesExistent: Boolean;
        if(this.dMan.mydata.trackeraccounts[this.dMan.monthArrayOfWho()!].categories.length === 0)
        {
            categoriesExistent = false;
        }
        else
        {
            categoriesExistent = true;
        }
        let main: HTMLElement = document.querySelector("main")!;
        main.append(this.tGen.render_breadCrump());

        if(categoriesExistent)
        {

            main.append(this.tGen.render_textElement("h3", "Laufenden Betrag hinzufügen", ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_textElement("h4", "Art", ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_radioBoxes(["output-transaction", "input-transaction"], [this.Lang.lang("Ausgabe"), this.Lang.lang("Einnahme")], "kind-of-transaction"));
            main.append(this.tGen.render_textElement("h4", "Abgerechnet einmal..", ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_regularityWrapper());
            let monthly = document.getElementById("monthly-pay")! as HTMLInputElement;
            monthly.checked = true;
            main.append(this.tGen.render_textElement("h4", "Kategorie", ["underlined", "flex-item-left"]));
            let selectBox = this.tGen.render_element("div", ["box"]);
            main.append(selectBox);
                let select = this.tGen.render_select(
                    this.dMan.mydata["trackeraccounts"][this.dMan.monthArrayOfWho()!].categories,
                    ["category-picker", "clickable", "flex-start"],
                    ["category-picker"]
                    )! as HTMLSelectElement;
            selectBox.append(select);
            main.append(this.tGen.render_textElement("h4", "Betrag", ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_inputBlock(
                "amount-input",
                "Betrag eingeben",
                "Betrag eingeben",
                "create-new-transaction-button"
                ));
            this.dMan.set_multiTrans("type", "expense");
            this.dMan.set_multiTrans("due", "month");
            this.dMan.set_multiTrans("category", select.value);
        }
        else
        {
            main.append(this.tGen.render_importantInfo("Um Ein- und Ausgaben zu erstellen, gehe zurück ins Dashboard und erstelle eine oder mehrere Kategorien"));
            
        }

        this.listener_newTransaction("repeating", categoriesExistent);
    }
    public render_singleMenu() {
        this.clearDOM();
        let categoriesExistent: Boolean;

        if(this.dMan.mydata.trackeraccounts[this.dMan.monthArrayOfWho()!].categories.length === 0)
        {
            categoriesExistent = false;
        }
        else
        {
            categoriesExistent = true;
        }

        let main: HTMLElement = document.querySelector("main")!;

        main.append(this.tGen.render_breadCrump());
        if(categoriesExistent)
        {
            main.append(this.tGen.render_textElement("h3", this.Lang.lang("Einmaligen Betrag hinzufügen"), ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_textElement("h4", this.Lang.lang("Art"), ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_radioBoxes(["output-transaction", "input-transaction"], [this.Lang.lang("Ausgabe"), this.Lang.lang("Einnahme")], "kind-of-transaction"));
            main.append(this.tGen.render_textElement("h4", this.Lang.lang("Datum"), ["underlined", "flex-item-left"]));
            main.append(this.tGen.render_radioBoxes(["set-todays-date", "set-specific-date"], [this.Lang.lang("Heute"), this.Lang.lang("Am...")], "date-time-radios", "marker-for-picker"));
    
            main.append(this.tGen.render_textElement("h4", "Kategorie", ["underlined", "flex-item-left"]));
            
            let sel_cat_box = this.tGen.render_element("div", ["box"]);
            main.append(sel_cat_box);
            let select = this.tGen.render_select(
                this.dMan.mydata["trackeraccounts"][this.dMan.monthArrayOfWho()!].categories,
                ["category-picker", "clickable", "flex-start"], ["category-picker"]) as HTMLSelectElement;
            sel_cat_box.append(select);
    
            main.append(this.tGen.render_textElement("h4", "Betrag", ["underlined", "flex-item-left"]));
            let valueBlock = this.tGen.render_inputBlock("amount-input", "Betrag eingeben", "Betrag eingeben", "create-new-transaction-button");
            main.append(valueBlock);
    
            //fill the current Transaction - Object default values as:
            ////kind of Transaction:
            this.dMan.set_singleTrans("type", "expense");
            this.dMan.set_singleTrans("date", this.tMan.get_full_date());
            this.dMan.set_singleTrans("category", select.value);
        }
        else
        {
            main.append(this.tGen.render_importantInfo(this.Lang.lang("Um Ein- und Ausgaben zu erstellen, gehe zurück ins Dashboard und erstelle eine oder mehrere Kategorien")));
            
        }
        this.listener_newTransaction("single", categoriesExistent);
    }
    private update_datepickerBody(direction: string, monthIndex: number, year: number) {
        let newMonthIndex: number = 0;
        let newYear: number = 0;
        let dPickerBody = document.getElementById("dPicker-body")!;
        
        let hlMonth = document.querySelector("#dPicker-head h3")! as HTMLHeadingElement;
        switch(direction)
        {
            case "pre":
                if(monthIndex - 1 < 0)
                {
                    newMonthIndex = 11;
                    newYear = year - 1;
                }
                else
                {
                    newMonthIndex = monthIndex - 1;
                    newYear = year;
                }
                break;
            case "next":
                if(monthIndex + 1 > 11)
                {
                    newMonthIndex = 0;
                    newYear = year + 1;
                }
                else
                {
                    newMonthIndex = monthIndex + 1;
                    newYear = year;
                }
                break;
            case "today":
                newMonthIndex = monthIndex;
                newYear = year;
                break;
        }

        let totalMonthDays = this.tMan.get_totalMonthDays(newMonthIndex, newYear);

        //remove all old weekrows;
        let allWeekrows = document.querySelectorAll(".week-row");
        allWeekrows.forEach(row => {
            row.remove();
        });
        this.tGen.render_dPickerBody(
            totalMonthDays,
            dPickerBody,
            this.tMan.get_FirstWeekday(this.tMan.months[newMonthIndex], newYear),
            this.tMan.get_totalMonthWeeks(totalMonthDays, this.tMan.months[newMonthIndex], newYear)
        );
        hlMonth.innerText = `${this.Lang.lang(this.tMan.months[newMonthIndex])} ${newYear}`;
        this.markToday(
            this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[1],
            this.tMan.months[this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[0]]);
    }

    private markToday(year: number, month: string) {
        let pDate: number = 0;
        if(year === new Date().getFullYear())
        {
            if(month === this.tMan.months[new Date().getMonth()])
            {
                let paragraphs = document.querySelectorAll(".day-field-number");
                for(let i = 0 ; i < paragraphs.length ; i++)
                {
                    let p = paragraphs[i] as HTMLParagraphElement;
                    if(p.innerText !== "")
                    {
                        pDate = +p.innerText;
                        if(pDate === new Date().getDate())
                        {
                            p.parentElement?.classList.add("its-today");
                        }
                    }
                }
            }
        }
    }
    private listener_datePicker() {
        let hlMonth = document.querySelector("#dPicker-head h3")! as HTMLHeadingElement;
        let shownMonthIndex = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[0];
        let shownYear = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[1];

        let preMonth = document.getElementById("btn-pre-month")!;
        let nextMonth = document.getElementById("btn-next-month")!;

        let today = document.querySelector(".dPicker-todays-date-button")!;

        preMonth!.addEventListener("click", () => {
            shownYear = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[1];
            this.update_datepickerBody("pre", shownMonthIndex, shownYear);
            this.dMan.set_singleTrans("date", null);
            shownMonthIndex = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[0];
            this.listener_dPicker_dayfields();
        });
        nextMonth!.addEventListener("click", () => {
            shownYear = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[1];
            this.update_datepickerBody("next", shownMonthIndex, shownYear);
            this.dMan.set_singleTrans("date", null);
            shownMonthIndex = this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[0];
            this.listener_dPicker_dayfields();
        });

        today.addEventListener("click", () => {
            this.update_datepickerBody("today", new Date().getMonth(), new Date().getFullYear());
            this.dMan.set_singleTrans("date", null);
            this.listener_dPicker_dayfields();
        });
        this.listener_dPicker_dayfields();
    }
    private listener_dPicker_dayfields() {
        //makes a displayed dates choosable:
        let allDayFields = document.querySelectorAll(".day-field")!;
        allDayFields.forEach(field => {
            field.addEventListener("click", (e) => {
                let child = field.children[0] as HTMLParagraphElement;
                if(child.innerText !== "")
                {
                    allDayFields.forEach(f => {
                        f.classList.remove("date-picked");
                    });
                    field.classList.add("date-picked");
                    let hLine = document.querySelector("#dPicker-head h3")! as HTMLHeadingElement;
                    let dateArg = [+child.innerText];
                    dateArg.push(...this.tMan.get_DateFromPickerHeadline(hLine.innerText));
                    this.dMan.set_singleTrans("date", this.tMan.get_full_date(dateArg));
                }
            });
        });
    }
    private listener_newTransaction(kind: string, categoriesExistent: Boolean) {
        if(categoriesExistent)
        {
            let radioExpense = document.getElementById("output-transaction") as HTMLInputElement;
            let radioEarning = document.getElementById("input-transaction") as HTMLInputElement;

            let radioToday = document.getElementById("set-todays-date") as HTMLInputElement;
            let radioSpecific = document.getElementById("set-specific-date") as HTMLInputElement;

            let amountInput = document.getElementById("amount-input")! as HTMLInputElement;
            let newTrans = document.getElementById("create-new-transaction-button")!;

            let selectCategory = document.getElementById("category-picker")! as HTMLSelectElement;

            if(kind === "repeating")
            {
                const toggleDue = (e: any) => {
                    let id = e.target.getAttribute("id");
                    switch(id)
                    {
                        case "monthly-pay":
                            this.dMan.set_multiTrans("due", "month");
                            break;
                        case "weekly-pay":
                            this.dMan.set_multiTrans("due", "week");
                            break;
                        case "quarterly-pay":
                            this.dMan.set_multiTrans("due", "quarter");
                            break;
                        case "hYear-pay":
                            this.dMan.set_multiTrans("due", "halfyear");
                            break;
                        case "yearly-pay":
                            this.dMan.set_multiTrans("due", "year");
                            break;
                    }
                }
                let monthly = document.getElementById("monthly-pay")! as HTMLInputElement;
                let weekly = document.getElementById("weekly-pay")! as HTMLInputElement;
                let quarterly = document.getElementById("quarterly-pay")! as HTMLInputElement;
                let halfyearly = document.getElementById("hYear-pay")! as HTMLInputElement;
                let yearly = document.getElementById("yearly-pay")! as HTMLInputElement;

                monthly.addEventListener("input", toggleDue);
                weekly.addEventListener("input", toggleDue);
                quarterly.addEventListener("input", toggleDue);
                halfyearly.addEventListener("input", toggleDue);
                yearly.addEventListener("input", toggleDue);
            }

            //toggles the running trans objects expense/earning - property:
            const toggleExpense = () => {
                switch(radioExpense.checked)
                {
                    case true:
                        if(kind === "single")
                        {
                            this.dMan.set_singleTrans("type", "expense");
                        }
                        else
                        {
                            this.dMan.set_multiTrans("type", "expense");
                        }
                        break;
                    case false:
                        if(kind === "single")
                        {
                            this.dMan.set_singleTrans("type", "earning");
                        }
                        else
                        {
                            this.dMan.set_multiTrans("type", "earning");
                        }
                        break;
                }
            };
            radioExpense.addEventListener("input", toggleExpense);
            radioEarning.addEventListener("input", toggleExpense);

            //Shows/Hides the datePicker dependent on users choice
            const toggleDatepicker = () => {
                let marker = document.getElementById("marker-for-picker");
                let datepicker = document.getElementById("date-picker-wrapper");
                switch(radioToday.checked)
                {
                    case true:
                        this.dMan.set_singleTrans("date", this.tMan.get_full_date());
                        if(datepicker)
                        {
                            datepicker.remove();
                        }
                        break;
                    case false:
                        this.dMan.set_singleTrans("date", null);
                        if(!datepicker)
                        {
                            let monthName = this.tMan.get_todaysMonthName();
                            let fullYear = this.tMan.get_todaysFullYear();

                            let newDatePicker = this.tGen.render_datepicker(
                            monthName,
                            fullYear.toString(),
                            this.tMan.get_totalMonthDays()!,
                            this.tMan.get_FirstWeekday(monthName, fullYear),
                            this.tMan.get_totalMonthWeeks(this.tMan.get_totalMonthDays(), monthName, fullYear)
                            );
                            marker!.insertAdjacentElement("afterend", newDatePicker);
                            let hlMonth = document.querySelector("#dPicker-head h3")! as HTMLHeadingElement;

                            this.markToday(
                                this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[1],
                                this.tMan.months[this.tMan.get_DateFromPickerHeadline(hlMonth.innerText)[0]]);
                        }
                        this.listener_datePicker();
                        break;
                }
            };
            if(kind === "single")
            {
                radioToday.addEventListener("input", toggleDatepicker);
                radioSpecific.addEventListener("input", toggleDatepicker);
            }


            amountInput.addEventListener("focus", () => {
                    this.resetInputButton("amount-input", "create-new-transaction-button");
            });

            newTrans.addEventListener("click", () => {
                if(kind === "single")
                {
                    this.animateInputButton("amount", "amount-input", "create-new-transaction-button");
                }
                else
                {
                    this.animateInputButton("repeatingAmount", "amount-input", "create-new-transaction-button");
                }
            });

            selectCategory.addEventListener("change", () => {
                if(kind === "single")
                {
                    this.dMan.set_singleTrans("category", selectCategory.value);
                }
                else
                {
                    this.dMan.set_multiTrans("category", selectCategory.value);
                }
            });
        }
        let breadCrump = document.getElementById("bread-crump-container")!;
        breadCrump.addEventListener("click", this.render_dashboard.bind(this));

    }
    public listener_dashboard() {
        let dBody = document.getElementById("dashboard-body");
        let details = dBody?.querySelector("button");
        details?.addEventListener("click", () => {
            this.render_detailView();
        });
    }
    public render_dashboard() {
        this.clearDOM();
        this.dMan.reset_singleTrans();
        this.dMan.reset_multiTrans();
        let main: HTMLElement = document.querySelector("main")!;
            main.append(this.tGen.render_welcomeHeadline(
                this.tMan.get_db_headline_partOfDay(),
                this.dMan.mydata.activeTrackeraccount,
                this.tMan.get_db_headline_weekday(),
                this.tMan.get_full_date(),
                this.tMan.get_calendarweek()
                ));
        //render it without the dashboard if NO monthID existent or no data in current Month
        if(!this.dMan.monthId_existent(this.tMan.get_monthId()))
        {
            this.dMan.createNewMonth(this.tMan.get_monthId());
            this.dMan.saveData();

            let tBlock_noEntries = this.tGen.render_element("div", ["text-block", "flex-column"]);
                let pContent = this.tGen.render_textElement("p", "Für diesen Monat existieren noch keine Daten. Füge unten im Menü Ein- und Ausgaben hinzu");
            tBlock_noEntries.append(pContent);
            main.append(tBlock_noEntries);
        }
        else if(this.dMan.monthId_existent(this.tMan.get_monthId()) && this.dMan.get_monthEntriesFromId(this.tMan.get_monthId()) === 0)
        {
            let tBlock_noEntries = this.tGen.render_element("div", ["text-block", "flex-column"]);
                let pContent = this.tGen.render_textElement("p", "Für diesen Monat existieren noch keine Daten. Füge unten im Menü Ein- und Ausgaben hinzu");
            tBlock_noEntries.append(pContent);
            main.append(tBlock_noEntries);

        }
        else if (this.dMan.monthId_existent(this.tMan.get_monthId()) && this.dMan.get_monthEntriesFromId(this.tMan.get_monthId()) > 0)
        {
            main.append(this.tGen.render_dashboardHolder
                (
                this.dMan,
                this.tMan.get_monthId(),
                this.dMan.monthArrayOfWho()!,
                this.tMan.get_totalMonthDays()
                )
            );
        }

        
        main.append(this.tGen.render_starMenu());
        this.listener_starMenu();
        this.listener_dashboard();
    }
    public render_firstOpening() {
        let main: HTMLElement = document.querySelector("main")!;
        if(!main.hasAttribute("id"))
        {
            let masterHeadline = this.tGen.render_masterHeadline();
            main.append(masterHeadline);
    
            let tb_choose_lang = this.tGen.render_textBlock();
            tb_choose_lang.classList.add("flex-column");
            main.append(tb_choose_lang);
    
            let choose_hl1 = this.tGen.render_textElement("h3", "Select your language");
            tb_choose_lang.append(choose_hl1);
    
            let lang_container = this.tGen.render_element("div", ["flex-between"], ["first-language-pick"]);
            tb_choose_lang.append(lang_container);
                let germFlag = this.tGen.render_element("div", ["germanBackground", "clickable"]);
                let engFlag = this.tGen.render_element("div", ["englishBackground", "clickable"]);
            lang_container.append(germFlag);
            lang_container.append(engFlag);
    
            let sub_headline = this.tGen.render_textElement("h4", "(you can change that anytime!)");
            tb_choose_lang.append(sub_headline);

            main.setAttribute("id", "fOpen1");
        }
        else
        {
            switch(main.getAttribute("id"))
            {
                case "fOpen1":
                    this.clearDOM();
                    main.append(this.tGen.render_masterHeadline());
                    let t1 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p1 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Du willst einen besseren Überblick über deine Finanzen, zu jederzeit und überall?"));
                    t1.append(p1);
                    let t2 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p2 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Du willst vielleicht nicht nur deine Finanzen tracken, sondern auch die deiner Kinder/Freunde/Firma etc.?"));
                    t2.append(p2);
                    let t3 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p3 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Dann brauchst du nicht weiter nach einem guten Tracker zu suchen. Moneytracker hilft dir bei allem, was du dafür brauchst"));
                    t3.append(p3);
                    main.append(t1);
                    main.append(t2);
                    main.append(t3);

                    let nextBtn = this.tGen.render_element("div", ["circle-shapes", "next-button", "buttons", "clickable"], ["first-time-open-next-button"]);
                    main.append(nextBtn);
                    main.id = "fOpen2";
                    break;

                case "fOpen2":
                    this.clearDOM();
                    main.append(this.tGen.render_masterHeadline());
                    let t4 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p4 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Auf dieser Seite werden keine Cookies verwendet, geschweigedenn Daten an Dritte weitergegeben"));
                    t4.append(p4);
                    let t5 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p5 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Der Moneytracker ist eine von vielen Referenzarbeiten, die all deine Daten im localStorage deines persönlichen Gerätes und Browsers speichert"));
                    t5.append(p5);
                    let t6 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p6 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Da der localStorage nicht nur Geräte- sondern auch Brwoser gebunden ist, solltest du diese Seite JETZT in dem Browser öffnen, indem du vorhast, den Moneytracker auch künftig zu verwenden."));
                    t6.append(p6);
                    main.append(t4);
                    main.append(t5);
                    main.append(t6);

                    let nextBtn2 = this.tGen.render_element("div", ["circle-shapes", "next-button", "buttons", "clickable"], ["first-time-open-next-button"]);
                    main.append(nextBtn2);
                    main.id = "fOpen3";
                    break;
                
                case "fOpen3":
                    this.clearDOM();
                    main.append(this.tGen.render_masterHeadline());
                    let t7 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p7 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Mit der weiterführenden Nutzung des Moneytrackers erklärst du dich mit der Datennutzung einverstanden"));
                    t7.append(p7);
                    let t8 = this.tGen.render_element("div", ["text-block", "flex-column"]);
                        let p8 = this.tGen.render_textElement(
                            "p",
                            this.Lang.lang("Um den Moneytracker zu nutzen, gib den Namen des deines ersten Tracker Accounts ein"));
                    t8.append(p8);
                    main.append(t7);
                    main.append(t8);

                    main.append(this.tGen.render_inputBlock("username-input", "Namen eingeben...", "Name eingeben", "create-new-tracker-account-btn"));
                    main.id = "fOpen4";

                    break;
                
                case "fOpen4":

                    break;
            }
        }
        this.listener_firstOpen();

    }
    private listener_starMenu() {
        let allMasterContainers = document.querySelectorAll(".sMenu-wrappers");

        let masButton = document.getElementById("sMenu-master-button");
        if(masButton)
        {
            masButton.addEventListener("click", e => {
                if(masButton!.classList.contains("not-clicked"))
                {
                    masButton!.classList.replace("not-clicked", "clicked");
                    allMasterContainers.forEach(container => {
                        container.classList.replace("not-clicked", "clicked");
                    });
                }
                else
                {
                    masButton!.classList.replace("clicked", "not-clicked");
                    allMasterContainers.forEach(container => {
                        container.classList.replace("clicked", "not-clicked");
                    });

                }
            });
        }
        //Listener for adding single-time-transaction:
        allMasterContainers[1].addEventListener("click", this.render_singleMenu.bind(this));
        allMasterContainers[2].addEventListener("click", this.render_repeatingMenu.bind(this));
        allMasterContainers[3].addEventListener("click", this.render_categories.bind(this));
        allMasterContainers[4].addEventListener("click", this.render_accounts.bind(this));
    }
    private listener_firstOpen() {
        let main: HTMLElement = document.querySelector("main")!;
        switch(main.getAttribute("id"))
        {
            case "fOpen1":
                let gerLang: HTMLDivElement = main.querySelector(".germanBackground")!;
                let engLang: HTMLDivElement = main.querySelector(".englishBackground")!;

                gerLang.addEventListener("click", () => {
                    localStorage.setItem("kamedin-moneytracker-language", "de");
                    this.render_firstOpening();
                });
                engLang.addEventListener("click", () => {
                    localStorage.setItem("kamedin-moneytracker-language", "en");
                    this.render_firstOpening();
                });
                break;
            case "fOpen2":
                let nextBtn = document.getElementById("first-time-open-next-button")!;
                nextBtn.addEventListener("click", this.render_firstOpening.bind(this));
                break;
            case "fOpen3":
                let nextBtn2 = document.getElementById("first-time-open-next-button")!;
                nextBtn2.addEventListener("click", this.render_firstOpening.bind(this));
                break;
            case "fOpen4":
                let tInput = document.getElementById("username-input")! as HTMLInputElement;
                let createUserBtn = document.getElementById("create-new-tracker-account-btn")!;
                let sideInfo = document.querySelector(".input.int-p-holder > p")!;

                createUserBtn.addEventListener("click", e => {
                    
                    let secInput = document.querySelector(".secondary-input")!;
                    if(!createUserBtn.getAttribute("clicked"))
                    {
                        if(!this.vali.validateUserName(tInput.value.trim(), undefined))
                        {
                        }
                        else
                        {
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                            createUserBtn.setAttribute("clicked", "one");
                        }
                    }
                    else
                    {
                        secInput.classList.remove("sec-outside");
                        secInput.classList.add("sec-inside");
                        createUserBtn.removeAttribute("clicked");
                        this.dMan.createTrackeraccount(tInput.value.trim(), this.Lang.lang("Einkauf"), this.Lang.lang("Gehalt"));
                        this.render_dashboard();
                    }
                });

                tInput.addEventListener("focus", () => {
                    this.resetInputButton("username-input", "create-new-tracker-account-btn");
                });
            default:
                break;
        }
    }
    private resetInputButton(inputid: string, buttonid: string) {
        let input = document.getElementById(inputid)!;
        let button = document.getElementById(buttonid)!;

        let secInput = document.querySelector(".secondary-input")!;

        if(button.hasAttribute("clicked"))
        {
            button.removeAttribute("clicked");
            secInput.classList.remove("sec-outside");
            secInput.classList.add("sec-inside");
        }
    }
    private animateInputButton(
        expectedInput: string,
        inputid: string,
        buttonid: string) {
        let input = document.getElementById(inputid)! as HTMLInputElement;
        let button = document.getElementById(buttonid)!;
        
        let secInput = document.querySelector(".secondary-input")!;

        switch(expectedInput)
        {
            case "username":
                button.addEventListener("click", () => {
                    if(!button.getAttribute("clicked"))
                    {
                        if(!this.vali.validateUserName(input.value.trim(), this.dMan.mydata.trackeraccounts))
                        {
                            this.tGen.render_inputError("Ungültige Eingabe");
                        }
                        else
                        {
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                            button.setAttribute("clicked", "one");
                        }
                    }
                    else
                    {
                        secInput.classList.remove("sec-outside");
                        secInput.classList.add("sec-inside");
                        button.removeAttribute("clicked");
                        this.dMan.createTrackeraccount(input.value.trim(), this.Lang.lang("Einkauf"), this.Lang.lang("Gehalt"));
                        this.render_dashboard();
                    }
                });
                break;
            case "amount":
                if(!button.getAttribute("clicked"))
                {
                    if(!this.vali.validateAmount(input.value.trim()))
                    {
                        this.tGen.render_inputError("Ungültiger Betrag");
                    }
                    else
                    {
                        if(this.dMan.singleTrans.date === null)
                        {
                            this.tGen.render_inputError("Datum wählen");
                        }
                        else
                        {
                            button.setAttribute("clicked", "one");
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                        }
                    }
                }
                else
                {
                    secInput.classList.remove("sec-outside");
                    secInput.classList.add("sec-inside");
                    button.removeAttribute("clicked");
                    this.dMan.set_singleTrans("amount", +input.value.replace(",", ".").trim());
                    input.value = "";

                    let trans = new Transaction(
                        this.dMan.singleTrans.type,
                        this.dMan.singleTrans.date,
                        this.dMan.singleTrans.category,
                        this.dMan.singleTrans.amount,
                        Date.now().toString().slice(4)
                    );
                    this.dMan.add_singleTransaction(
                        trans,
                        this.tMan.convert_YearAndMonth_to_monthId(this.dMan.singleTrans.date));
                }
            break;
            case "repeatingAmount":
                if(!button.getAttribute("clicked"))
                {
                    if(!this.vali.validateAmount(input.value.trim()))
                    {
                        this.tGen.render_inputError("Ungültiger Betrag");
                    }
                    else
                    {
                            button.setAttribute("clicked", "one");
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                    }
                }
                else
                {
                    secInput.classList.remove("sec-outside");
                    secInput.classList.add("sec-inside");
                    button.removeAttribute("clicked");
                    this.dMan.set_multiTrans("amount", +input.value.replace(",", ".").trim());
                    this.dMan.compute_monthlyAmount();
                    input.value = "";

                    let trans = new Multitransaction(
                        this.dMan.multiTrans.type,
                        this.dMan.multiTrans.due,
                        this.dMan.multiTrans.category,
                        this.dMan.multiTrans.amount,
                        this.dMan.multiTrans.amountPerMonth,
                        Date.now().toString().slice(4),
                    );

                    this.dMan.add_multiTransaction(trans, this.tMan.get_monthId());
                }
            break;
            case "category":
                if(!button.getAttribute("clicked"))
                {
                    if(!this.vali.validate_categoryName(input.value.trim(), this.dMan.mydata.trackeraccounts[this.dMan.monthArrayOfWho()!].categories))
                    {
                        this.tGen.render_inputError("Ungültige Eingabe");
                    }
                    else
                    {
                            button.setAttribute("clicked", "one");
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                    }
                }
                else
                {
                    secInput.classList.remove("sec-outside");
                    secInput.classList.add("sec-inside");
                    button.removeAttribute("clicked");
                    this.dMan.add_category(input.value.trim());
                    this.tGen.refresh_categoryBox(input.value.trim(), this.dMan);
                    input.value = "";
                }
                break;
            case "additional-username":
                    if(!button.getAttribute("clicked"))
                    {
                        if(!this.vali.validateUserName(input.value.trim(), this.dMan.mydata.trackeraccounts))
                        {
                            this.tGen.render_inputError("Ungültige Eingabe");
                        }
                        else
                        {
                            secInput.classList.remove("sec-inside");
                            secInput.classList.add("sec-outside");
                            button.setAttribute("clicked", "one");
                        }
                    }
                    else
                    {
                        secInput.classList.remove("sec-outside");
                        secInput.classList.add("sec-inside");
                        button.removeAttribute("clicked");
                        this.dMan.createTrackeraccount(input.value.trim(), this.Lang.lang("Einkauf"), this.Lang.lang("Gehalt"));
                        input.value = "";
                        let accountNames: string[] = [];
                        this.dMan.mydata["trackeraccounts"].forEach((account: any) => {
                            accountNames.push(account.name);
                        });
                        this.tGen.refresh_accountWrapper(accountNames, this.dMan.mydata.activeTrackeraccount);
                        this.listener_accounts(true);
                    }
            break;

        }
    }
    private clearDOM() {
        let main: HTMLElement = document.querySelector("main")!;
        while(main.children.length > 0)
        {
            let child = main.firstElementChild!;
            child.remove();
        }
    }
}