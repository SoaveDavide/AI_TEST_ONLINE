let testResults = {};

function saveOpenAnswers() {
  const form = document.getElementById('openQuestionsForm');
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    testResults[key] = value;
  });

  window.location.href = "closed-questions.html";
}

function submitAnswers() {
  const form = document.getElementById('closedQuestionsForm');
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    testResults[key] = value;
  });

  saveResultsToFile();
}

function saveResultsToFile() {
  // Organizza i dati in formato leggibile
  let formattedData = "Risultati del Test:\n\n";

  // Aggiungi le risposte alle domande aperte
  formattedData += "Domande Aperte:\n";
  for (const [key, value] of Object.entries(testResults)) {
    formattedData += `${key}: ${value}\n`;
  }

  // Aggiungi le risposte alle domande chiuse
  formattedData += "\nDomande Chiuse:\n";
  for (const [key, value] of Object.entries(testResults)) {
    formattedData += `${key}: ${value}\n`;
  }

  // Crea il Blob per il download
  const blob = new Blob([formattedData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "test-results.txt";
  a.click();

  alert("Risultati salvati con successo!");
}

let timeLeft = sessionStorage.getItem("timeLeft") ? sessionStorage.getItem("timeLeft") : 300; // 5 minuti (o tempo rimasto precedentemente salvato)

function startTimer() {
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  document.body.prepend(timerElement);

  const interval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent = `Tempo rimanente: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;
    sessionStorage.setItem("timeLeft", timeLeft); // Salva il tempo rimanente nel sessionStorage

    // Cambia il colore del timer quando il tempo è quasi scaduto
    if (timeLeft < 30) {
      timerElement.classList.add("warning");
    } else {
      timerElement.classList.remove("warning");
    }

    // Cambia il colore quando il tempo è scaduto
    if (timeLeft < 0) {
      clearInterval(interval);
      timerElement.classList.add("expired"); // Aggiungi classe di scadenza
      alert("Tempo scaduto!");
      saveResultsToFile();
      window.location.href = "completion-page.html"; // Vai alla pagina di completamento
    }
  }, 1000);
}

// Assicurati che il timer parta quando la pagina delle domande aperte viene caricata
window.onload = startTimer;
