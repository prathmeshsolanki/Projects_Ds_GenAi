let tasks = [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addBtn").addEventListener("click", addTask);
    document.getElementById("submitBtn").addEventListener("click", submitLog);
});

function addTask() {
    const taskInput = document.getElementById("task");
    const task = taskInput.value.trim();
    if (task !== "") {
        tasks.push(task);
        updateTaskList();
        taskInput.value = "";
    }
}

function updateTaskList() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        li.className = "task-item";
        list.appendChild(li);
    });
}

document.getElementById("viewLogsBtn").addEventListener("click", function () {
    fetch("/logs")
        .then(res => res.json())
        .then(logs => {
            const logDiv = document.getElementById("past-logs");
            if (logs.length === 0) {
                logDiv.innerHTML = "<p>No past logs available.</p>";
                return;
            }

            logDiv.innerHTML = "<h2>Past Daily Logs:</h2><ul class='log-list'>" +
                logs.map(log => `<li>${log}</li>`).join("") +
                "</ul>";
        })
        .catch(error => {
            console.error("Error fetching logs:", error);
            alert("Could not load past logs.");
        });
});

function submitLog() {
    const mood = document.getElementById("mood").value;

    fetch("/log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mood, tasks })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML = `
            <p>Date: ${data.date}</p>
            <p>Mood: ${data.mood}</p>
            <p>Task: ${data.tasks}</p>
            <p>Productivity Score: ${data.score}</p>
            <p>Motivational Quote: <em>"${data.quote}"</em></p>
        `;
        tasks = [];
        updateTaskList();
    })
    
    .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong while submitting the log.");
    });

}
