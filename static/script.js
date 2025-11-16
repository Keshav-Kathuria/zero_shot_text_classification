document.getElementById("classifyBtn").addEventListener("click", async () => {
    const text = document.getElementById("text").value.trim();
    const labelsInput = document.getElementById("labels").value.trim();

    // ✅ Check if text and labels are entered
    if (!text || !labelsInput) {
        alert("Please enter both text and labels!");
        return;
    }

    // ✅ Split labels and validate
    const labels = labelsInput.split(",").map(s => s.trim()).filter(s => s !== "");

    // Ensure labels are only alphabetic words and at least 3 letters
    const invalidLabels = labels.filter(l => !/^[a-zA-Z\s]{3,}$/.test(l));
    if (invalidLabels.length > 0) {
        alert("Please enter valid labels (only letters, at least 3 chars): " + invalidLabels.join(", "));
        return; // stop execution if invalid
    }

    // ✅ Check at least 2 labels
    if (labels.length < 2) {
        alert("Please enter at least 2 labels, separated by commas (e.g., sports, finance, politics).");
        return;
    }

    // ✅ Call Flask API
    try {
        const response = await fetch("http://127.0.0.1:5000/classify", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ text, labels })
        });

        const data = await response.json();

        // Find top predicted label
        const maxIndex = data.scores.indexOf(Math.max(...data.scores));
        const predictedLabel = data.labels[maxIndex];

        // Show top label and button
        document.getElementById("result").innerHTML = `
            <h3>Predicted Label: <span class="top-label">${predictedLabel}</span></h3>
            <button id="showScoresBtn">View Confidence Scores</button>
            <div id="scoreTable" style="display:none;"></div>
        `;

        // Build confidence table
        let tableHTML = `<table>
            <tr><th>Label</th><th>Confidence</th></tr>`;
        for (let i = 0; i < data.labels.length; i++) {
            tableHTML += `<tr>
                <td>${data.labels[i]}</td>
                <td>${(data.scores[i]*100).toFixed(2)}%</td>
            </tr>`;
        }
        tableHTML += `</table>`;
        document.getElementById("scoreTable").innerHTML = tableHTML;

        // Toggle confidence table visibility
        document.getElementById("showScoresBtn").onclick = () => {
            const table = document.getElementById("scoreTable");
            table.style.display = table.style.display === "none" ? "block" : "none";
            document.getElementById("showScoresBtn").textContent =
                table.style.display === "none" ? "View Confidence Scores" : "Hide Scores";
        };

    } catch (err) {
        console.error(err);
        alert("Error: Could not classify text. Please try again.");
    }
});
