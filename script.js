// =============================== Intersection Observer =====================================
const homeElement = document.querySelector('#home');
const homeNavLink = document.querySelector('a[href="#home"]'); 

let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      homeNavLink.classList.add('text-primary-2'); 
    } else {
      homeNavLink.classList.remove('text-primary-2');
    }
  });
}, {
  threshold: 0.5 
});

observer.observe(homeElement);

// ==================================== Side-Bar ============================================
const barsToggle = document.getElementById('side-bar');

function sideBar() {
    barsToggle.classList.toggle('hidden');
    barsToggle.classList.toggle('flex');
}

// ================================ Words Count/Clear/Paste =================================================
const inputBox = document.getElementById("inputBox");
const wordCount = document.getElementById("wordCount");
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");

//  word count
function updateWordCount() {
    let words = inputBox.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `Words: ${words.length}`;
}

//  input changes
inputBox.addEventListener("input", () => {
    updateWordCount();
    togglePasteButton();
});

//  Clear button
clearBtn.addEventListener("click", () => {
    inputBox.value = "";
    updateWordCount();
    togglePasteButton();
});

// Paste button 
function togglePasteButton() {
  pasteBtn.classList.toggle("hidden", inputBox.value.trim().length > 0);
}

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputBox.value = text;
        updateWordCount();
        togglePasteButton();
    } catch (err) {
        console.error("Failed to paste: ", err);
    }
});

updateWordCount();
togglePasteButton();

// ====================================================== Fetching Api From Open AI ==========================
const outputBox = document.getElementById("outputBox");
const humanizeBtn = document.getElementById("humanizeBtn");


const geminiApiKey = "AIzaSyBu5uCf4pV-i1y32Mu4pxyTl2eSO8PzBFA"; 

humanizeBtn.addEventListener("click", async () => {
    const inputText = inputBox.value.trim();
    if (!inputText) return;  

    try {
        
        console.log("Sending request to Gemini API with input text:", inputText);

       
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: inputText }]
                }]
            })
        });

        
        console.log("Response Status Code:", response.status);  
        const rawResponse = await response.text(); 
        console.log("Raw Response Text:", rawResponse); 
        if (response.ok) {
            
            const data = JSON.parse(rawResponse);
            console.log("Parsed API Response:", data); 
            
            if (data && data.candidates && data.candidates.length > 0) {
                const geminiText = data.candidates[0].content.parts[0].text; 
                if (geminiText) {
                    outputBox.value = geminiText.trim();  
                } else {
                    outputBox.value = "Error: No text returned from Gemini. Please check the input.";
                }
            } else {
                
                outputBox.value = "Error: No valid content returned from Gemini.";
            }
        } else {
            
            outputBox.value = `Error: Received status code ${response.status} from Gemini API.`;
        }
    } catch (error) {
        console.error("Error fetching from Gemini:", error);
        outputBox.value = `Error processing request: ${error.message}`;  
    }
});






  