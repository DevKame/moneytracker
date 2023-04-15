

import { Datamanager } from "./Aggregator.js";
import { DOMGenerator } from "./Aggregator.js";

let dMan = new Datamanager();
let domGen = new DOMGenerator();

let english = document.getElementById("english-language")!;
let german = document.getElementById("german-language")!;

english.addEventListener("click", () => {
    if(localStorage.getItem("kamedin-moneytracker-language") !== "en" &&
       localStorage.getItem("kamedin-moneytracker") !== null)
       localStorage.setItem("kamedin-moneytracker-language", "en");
       dMan.mydata.language = "en"
       dMan.saveData();
       domGen.render_dashboard();
});
german.addEventListener("click", () => {
    if(localStorage.getItem("kamedin-moneytracker-language") !== "de" &&
       localStorage.getItem("kamedin-moneytracker") !== null)
       localStorage.setItem("kamedin-moneytracker-language", "de");
       dMan.mydata.language = "de"
       dMan.saveData();
       domGen.render_dashboard();
});

if(dMan.isDataExistent())
{
    domGen.render_dashboard();
}
else
{
    domGen.render_firstOpening();
}