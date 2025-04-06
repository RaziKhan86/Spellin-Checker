const Textarea = document.getElementById('text');
const Display = document.querySelector(".display");

document.getElementById('reset').addEventListener('click',(button)=>{
    ResetText();
});

function ResetText() {
    Textarea.value = '';
    Display.innerHTML  = '';
}

// Check Spelling mistek using Typo.js
// And Typo.js not check any name and special character
// then i am using localStorage for store name & special charcter.

let customWords = new Set(JSON.parse(localStorage.getItem("customWords")) || []);
function saveCustomWords() {
    localStorage.setItem("customWords", JSON.stringify([...customWords])); // Save words permanently
}

async function loadDictionary(Text) {
    let affPath = "typo/dictionaries/en_US/en_US.aff";
    let dicPath = "typo/dictionaries/en_US/en_US.dic";

    let affData = await fetch(affPath).then(res => res.text());
    let dicData = await fetch(dicPath).then(res => res.text());

    dictionary = new Typo("en_US", affData, dicData, { ignoreCase: true });


    let words = Text.trim().split(/\s+/).map(word => word.replace(/[^a-zA-Z]/g, ""));  // Split sentence into words
    let misspelledWords = words.filter(word => !dictionary.check(word)  && !customWords.has(word));

    if (misspelledWords.length > 0) {
        Display.innerHTML =  misspelledWords.join(", ");
        console.log("Misspelled words:", misspelledWords.join(", "));
         // Auto-learn option
         misspelledWords.forEach(word => {
            if (confirm(`Do you want to add "${word}" to the dictionary?`)) {
                customWords.add(word);
                saveCustomWords();
                Display.innerHTML = `"${word}" has been added to the dictionary permanently!`;
            }
        });
    } else {
       Display.innerHTML = "No spelling mistakes!";
    }
}




// caling function when i click check button
document.querySelector('.js-checkout').addEventListener('click',()=>{
    CheckText();
});

function CheckText() {
    let Text = Textarea.value;
    if (Text.length > 0) {
        loadDictionary(Text);
    }
}

// DarkMode
document.querySelector('.js-dark-mode').addEventListener('click',()=>{
    DrakMode();
});
let darkMode = false;
function DrakMode(){ 
    if(!darkMode){
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        darkMode = true;
    }else{
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        darkMode = false;
    }
}