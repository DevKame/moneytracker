

export class Lang {
    lang(string: string) {
        let lang = localStorage.getItem("kamedin-moneytracker-language");
        let newString: string = "";
        switch(string)
        {
            case "Du willst einen besseren Überblick über deine Finanzen, zu jederzeit und überall?":
                if(lang === "de") newString = string;
                else newString = "You want a better overview about your finances, everywhere and always?";
                break;
            case "Du willst vielleicht nicht nur deine Finanzen tracken, sondern auch die deiner Kinder/Freunde/Firma etc.?":
                if(lang === "de") newString = string;
                else newString = "You may want to not only manage yours, but your childrens/partners too?";
                break;
            case "Dann brauchst du nicht weiter nach einem guten Tracker zu suchen. Moneytracker hilft dir bei allem, was du dafür brauchst":
                if(lang === "de") newString = string;
                else newString = "If thats the case you dont need to keep searching. Moneytracker helps you with everything you need for that";
                break;
            case "Auf dieser Seite werden keine Cookies verwendet, geschweigedenn Daten an Dritte weitergegeben":
                if(lang === "de") newString = string;
                else newString = "This site doesnt use cookies nor uses or shares your data with third parties";
                break;
            case "Der Moneytracker ist eine von vielen Referenzarbeiten, die all deine Daten im localStorage deines persönlichen Gerätes und Browsers speichert":
                if(lang === "de") newString = string;
                else newString = "Moneytracker is one of a few reference works, thats why you data is ONLY stored within the 'localStorage' of your device";
                break;
            case "Da der localStorage nicht nur Geräte- sondern auch Brwoser gebunden ist, solltest du diese Seite JETZT in dem Browser öffnen, indem du vorhast, den Moneytracker auch künftig zu verwenden.":
                if(lang === "de") newString = string;
                else newString = "Because the Moneytracker saves data bound to not only your device, but also your brwoser, you should NOW open this site within the browser you intend to use it in the future";
                break;
            case "Mit der weiterführenden Nutzung des Moneytrackers erklärst du dich mit der Datennutzung einverstanden":
                if(lang === "de") newString = string;
                else newString = "By using the moenytracker you accept the mentioned non-usage of the data";
                break;
            case "Um den Moneytracker zu nutzen, gib den Namen des deines ersten Tracker Accounts ein":
                if(lang === "de") newString = string;
                else newString = "To use the moneytracker, enter a name for your first trackeraccount";
                break;
            case "Namen eingeben...":
                if(lang === "de") newString = string;
                else newString = "Enter name...";
                break;
            case "Name eingeben":
                if(lang === "de") newString = string;
                else newString = "Enter name";
                break;
            case "Bestätige":
                if(lang === "de") newString = string;
                else newString = "Confirm";
                break;
            case "Für diesen Monat existieren noch keine Daten. Füge unten im Menü Ein- und Ausgaben hinzu":
                if(lang === "de") newString = string;
                else newString = "There is no data for this month yet. Add earnings and expenses in the menu down below";
                break;
            case "Menü":
                if(lang === "de") newString = string;
                else newString = "Menu";
                break;
            case "Einmalig":
                if(lang === "de") newString = string;
                else newString = "Single";
                break;
            case "Wiederholt":
                if(lang === "de") newString = string;
                else newString = "Repeating";
                break;
            case "Kategorien":
                if(lang === "de") newString = string;
                else newString = "Categories";
                break;
            case "KW":
                if(lang === "de") newString = string;
                else newString = "CW";
                break;
            case "Guten Tag, ":
                if(lang === "de") newString = string;
                else newString = "Hello ";
                break;
            case "Guten Morgen, ":
                if(lang === "de") newString = string;
                else newString = "Good morning, ";
                break;
            case "Guten Abend, ":
                if(lang === "de") newString = string;
                else newString = "Good evening, ";
                break;
            case "Montag":
                if(lang === "de") newString = string;
                else newString = "Monday";
                break;
            case "Dienstag":
                if(lang === "de") newString = string;
                else newString = "Tuesday";
                break;
            case "Mittwoch":
                if(lang === "de") newString = string;
                else newString = "Wednesday";
                break;
            case "Donnerstag":
                if(lang === "de") newString = string;
                else newString = "Thursday";
                break;
            case "Freitag":
                if(lang === "de") newString = string;
                else newString = "Friday";
                break;
            case "Samstag":
                if(lang === "de") newString = string;
                else newString = "Saturday";
                break;
            case "Sonntag":
                if(lang === "de") newString = string;
                else newString = "Sunday";
                break;
            case "Einzelausgaben: ":
                if(lang === "de") newString = string;
                else newString = "Single expenses: ";
                break;
            case "Bilanz: ":
                if(lang === "de") newString = string;
                else newString = "Balance: ";
                break;
            case "Einnahmen: ":
                if(lang === "de") newString = string;
                else newString = "Earnings: ";
                break;
            case "Fixkosten: ":
                if(lang === "de") newString = string;
                else newString = "Fixed costs: ";
                break;
            case "Daraus resultiert:":
                if(lang === "de") newString = string;
                else newString = "Results in:";
                break;
            case "Wochenbudget: ":
                if(lang === "de") newString = string;
                else newString = "Weekly Budget: ";
                break;
            case "Tagesbudget: ":
                if(lang === "de") newString = string;
                else newString = "Daily Budget: ";
                break;
            case "Januar":
                if(lang === "de") newString = string;
                else newString = "January";
                break;
            case "Februar":
                if(lang === "de") newString = string;
                else newString = "February";
                break;
            case "März":
                if(lang === "de") newString = string;
                else newString = "March";
                break;
            case "April":
                if(lang === "de") newString = string;
                else newString = "April";
                break;
            case "Mai":
                if(lang === "de") newString = string;
                else newString = "May";
                break;
            case "Juni":
                if(lang === "de") newString = string;
                else newString = "June";
                break;
            case "Juli":
                if(lang === "de") newString = string;
                else newString = "July";
                break;
            case "August":
                if(lang === "de") newString = string;
                else newString = "August";
                break;
            case "September":
                if(lang === "de") newString = string;
                else newString = "September";
                break;
            case "Oktober":
                if(lang === "de") newString = string;
                else newString = "Oktober";
                break;
            case "November":
                if(lang === "de") newString = string;
                else newString = "November";
                break;
            case "Dezember":
                if(lang === "de") newString = string;
                else newString = "December";
                break;
            case "Einzelbetrag":
                if(lang === "de") newString = string;
                else newString = "Single amount";
                break;
            case "Fixbetrag":
                if(lang === "de") newString = string;
                else newString = "Repeating amount";
                break;
            case "wöch.: ":
                if(lang === "de") newString = string;
                else newString = "wkly: ";
                break;
            case "mtl.: ":
                if(lang === "de") newString = string;
                else newString = "mthly: ";
                break;
            case "halbjährl.: ":
                if(lang === "de") newString = string;
                else newString = "halfyrly: ";
                break;
            case "jährl.: ":
                if(lang === "de") newString = string;
                else newString = "yrly: ";
                break;
            case "Detailansicht":
                if(lang === "de") newString = string;
                else newString = "Detailview";
                break;
            case "Transaktionen":
                if(lang === "de") newString = string;
                else newString = "Transactions";
                break;
            case "Zurück zum Dashboard":
                if(lang === "de") newString = string;
                else newString = "Back to dashboard";
                break;
            case "Einmaligen Betrag hinzufügen":
                if(lang === "de") newString = string;
                else newString = "Add a one-time transaction";
                break;
            case "Um Ein- und Ausgaben zu erstellen, gehe zurück ins Dashboard und erstelle eine oder mehrere Kategorien":
                if(lang === "de") newString = string;
                else newString = "To create expenses or intakes, go back to the dashboard and create categories first";
                break;
            case "Indem du deinen Ausgaben Kategorien zuweist, ermöglichst du dir einen besseren Überblick. Lösche oder erstelle hier neue Kategorien":
                if(lang === "de") newString = string;
                else newString = "By accessing categories to your transactions you maintain a better overview. Create or delete categories here";
                break;
            case "Art":
                if(lang === "de") newString = string;
                else newString = "Type";
                break;
            case "Datum":
                if(lang === "de") newString = string;
                else newString = "Date";
                break;
            case "Kategorie":
                if(lang === "de") newString = string;
                else newString = "Category";
                break;
            case "Betrag":
                if(lang === "de") newString = string;
                else newString = "Amount";
                break;
            case "Ausgabe":
                if(lang === "de") newString = string;
                else newString = "Expense";
                break;
            case "Einnahme":
                if(lang === "de") newString = string;
                else newString = "Intake";
                break;
            case "Heute":
                if(lang === "de") newString = string;
                else newString = "Today";
                break;
            case "Am...":
                if(lang === "de") newString = string;
                else newString = "On...";
                break;
            case "Betrag eingeben":
                if(lang === "de") newString = string;
                else newString = "Enter amount";
                break;
            case "Kategorienname...":
                if(lang === "de") newString = string;
                else newString = "Categoryname...";
                break;
            case "Kategorie eingeben":
                if(lang === "de") newString = string;
                else newString = "Enter category";
                break;
            case "Neue Kategorie":
                if(lang === "de") newString = string;
                else newString = "New category";
                break;
            case "Übersicht":
                if(lang === "de") newString = string;
                else newString = "Overview";
                break;
            case "Laufenden Betrag hinzufügen":
                if(lang === "de") newString = string;
                else newString = "Add a repeating transaction";
                break;
            case "Abgerechnet einmal..":
                if(lang === "de") newString = string;
                else newString = "Due...";
                break;
            case "im Monat":
                if(lang === "de") newString = string;
                else newString = "...monthly";
                break;
            case "in der Woche":
                if(lang === "de") newString = string;
                else newString = "...weekly";
                break;
            case "im Quartal":
                if(lang === "de") newString = string;
                else newString = "...quarterly";
                break;
            case "im Halbjahr":
                if(lang === "de") newString = string;
                else newString = "...halfyearly";
                break;
            case "im Jahr":
                if(lang === "de") newString = string;
                else newString = "...yearly";
                break;
            case "Neuer Trackeraccount":
                if(lang === "de") newString = string;
                else newString = "New Trackeraccount";
                break;
            case "Ungültige Eingabe":
                if(lang === "de") newString = string;
                else newString = "Invalid input";
                break;
            case "Ungültiger Betrag":
                if(lang === "de") newString = string;
                else newString = "Invalid amount";
                break;
            case "Datum wählen":
                if(lang === "de") newString = string;
                else newString = "Choose a date";
                break;
            case "Einkauf":
                if(lang === "de") newString = string;
                else newString = "Groceries";
                break;
            case "Gehalt":
                if(lang === "de") newString = string;
                else newString = "Salary";
                break;
            default:
                newString = string;
                break;
        }
        return newString;
    }
    enTOdeu(string: string) {
        let newString: string = "";
        switch(string)
        {
            case "January":
                newString = "Januar";
                break;
            case "February":
                newString = "Februar";
                break;
            case "March":
                newString = "März";
                break;
            case "May":
                newString = "Mai";
                break;
            case "June":
                newString = "Juni";
                break;
            case "July":
                newString = "Juli";
                break;
            case "October":
                newString = "Oktober";
                break;
            case "December":
                newString = "Dezember";
                break;
            default:
                newString = string;
                break;
        }
        return newString;
    }
}