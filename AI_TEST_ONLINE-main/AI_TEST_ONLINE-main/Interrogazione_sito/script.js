let testResults = {}; // Oggetto per salvare le risposte
let timeLeft = sessionStorage.getItem("timeLeft") ? sessionStorage.getItem("timeLeft") : 300; // Tempo iniziale: 5 minuti

// SALVATAGGIO RISPOSTE APERTE
function saveOpenAnswers() {
  const form = document.getElementById('openQuestionsForm');
  const formData = new FormData(form);

  // Salva le risposte nel testResults
  formData.forEach((value, key) => {
    testResults[key] = value.trim(); // Rimuove spazi bianchi in eccesso
  });

  console.log("Risposte aperte salvate:", testResults); // Debug delle risposte

  // Vai alla pagina delle domande chiuse
  window.location.href = "closed-questions.html";
}

// SALVATAGGIO RISPOSTE CHIUSE
function submitAnswers() {
  const form = document.getElementById('closedQuestionsForm');
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    testResults[key] = value; // Salva anche le risposte delle domande chiuse
  });

  saveResultsToFile(); // Salva i risultati in un file
  clearTimer(); // Stop del timer
  window.location.href = "result.html"; // Vai alla pagina dei risultati
}

// SALVATAGGIO RISULTATI SU FILE
function saveResultsToFile() {
  let formattedData = "=== Risultati del Test ===\n\n";

  // Aggiunge le risposte delle domande aperte
  let count = 1;
  for (const [key, value] of Object.entries(testResults)) {
    formattedData += `Domanda ${count}: ${key}\nRisposta: ${value}\n\n`;
    count++;
  }

  // Creazione e download del file
  const blob = new Blob([formattedData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "test-results.txt"; // Nome del file che verrà scaricato
  a.click();
}

// CANCELLA TIMER
function clearTimer() {
  sessionStorage.removeItem("timeLeft");
}

// TIMER GLOBALE
function startTimer() {
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  document.body.prepend(timerElement); // Mostra il timer in cima alla pagina

  const interval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent = `Tempo rimanente: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;
    sessionStorage.setItem("timeLeft", timeLeft); // Aggiorna il tempo nel sessionStorage

    // Cambia stile quando il tempo è quasi scaduto
    if (timeLeft < 30) {
      timerElement.classList.add("warning"); // Aggiunge stile di avviso
    }
    if (timeLeft < 0) {
      clearInterval(interval);
      timerElement.textContent = "Tempo scaduto!";
      saveResultsToFile(); // Salva i risultati anche alla fine del tempo
      window.location.href = "result.html"; // Reindirizza alla pagina finale
    }
  }, 1000);
}

// AVVIA IL TIMER AL CARICAMENTO DELLA PAGINA
window.onload = startTimer;
