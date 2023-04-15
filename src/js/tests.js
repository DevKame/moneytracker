

//Manages usage of every data and all extern classes

let form = document.querySelector(".secondary-input");
let btn = document.getElementById("create-new-tracker-account-btn");
if(btn)
{
    btn.addEventListener("click", e => {
        if(form.classList.contains("sec-inside"))
        {
            form.classList.remove("sec-inside");
            form.classList.add("sec-outside");
        }
        else
        {
            form.classList.remove("sec-outside");
            form.classList.add("sec-inside");
        }
    });

}

let allMasterContainers = document.querySelectorAll(".sMenu-wrappers");

let masButton = document.getElementById("sMenu-master-button");
if(masButton)
{
    masButton.addEventListener("click", e => {
        if(e.target.classList.contains("not-clicked"))
        {
            e.target.classList.replace("not-clicked", "clicked");
            allMasterContainers.forEach(container => {
                container.classList.replace("not-clicked", "clicked");
            });
        }
        else
        {
            e.target.classList.replace("clicked", "not-clicked");
            allMasterContainers.forEach(container => {
                container.classList.replace("clicked", "not-clicked");
            });

        }
    });
}