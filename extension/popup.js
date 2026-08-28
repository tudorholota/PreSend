const messageInput = document.getElementById("message");
const analyzeButton = document.getElementById('analyzeButton');
const resultSection = document.getElementById('result');
const predictionElement = document.getElementById('prediction');
const confidenceElement = document.getElementById('confidence');
const probabilitiesElement = document.getElementById('probabilities');
const errorElement = document.getElementById('error');

const labelNames = {OTHER : "Normal / Other", PROFANITY: "Profanity", INSULT: 'Insult', ABUSE : "Abuse"};

analyzeButton.addEventListener('click', analyzeMessage);

async function analyzeMessage(){
     const text = messageInput.value.trim();
     errorElement.classList.add("hidden");
     resultSection.classList.add("hidden");

     if(!text){
        showError("Please enter a message to analyze.");
        return;
     }

     analyzeButton.disabled = true;
     analyzeButton.textContent = "Analyzing..";

     
     try {
        const response = await fetch("http://127.0.0.1:8000/analyze",{
            method : "POST",
            headers :  {"Content-Type": "application/json"},
            body : JSON.stringify({text : text})
        });

        if(!response.ok){
            throw new Error('Server error');
        }

        const data = await response.json();
        displayResult(data);
     } catch(error){
        console.error(error);
        showError('API request failed. Please try again later.');
     } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyze";
     }
}



function displayResult(data){
    const friendlyLabel = labelNames[data.label] ?? data.label;
    predictionElement.textContent = friendlyLabel;
    confidenceElement.textContent = `Confidence: ${formatPercent(data.confidence)}`;
    probabilitiesElement.innerHTML = "";
    const sorted = Object.entries(data.probabilities).sort((a, b) => b[1] - a[1]);

    for(const [label, probability] of sorted){
        const row = document.createElement("div");
        row.className = "probability-row";

        const header = document.createElement("div");
        header.className = 'probability-header';

        const labelElement = document.createElement("span");
        labelElement.textContent = labelNames[label] ?? label;

        const valueElement = document.createElement("span");
        valueElement.textContent = formatPercent(probability);

        header.appendChild(labelElement);
        header.appendChild(valueElement);

        const background = document.createElement('div');
        background.className = "bar-background";

        const bar = document.createElement("div");
        bar.className = 'bar';

        bar.style.width = `${probability * 100}%`;
        background.appendChild(bar);

        row.appendChild(header);
        row.appendChild(background);

        probabilitiesElement.appendChild(row);
    }

    resultSection.classList.remove('hidden');
}


function formatPercent(value){
    return `${(value * 100).toFixed(1)}%`;
}

function showError(message){
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}