const API_URL = "http://localhost:5000/api/notes";

let currentNoteId = null;

// Add Note
document.getElementById('noteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const noteInput = document.getElementById('noteInput');
  const noteText = noteInput.value.trim();

  if (noteText !== "") {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteText })
    });
    noteInput.value = '';
    loadNotes();
  }
});

// Toggle complete
async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadNotes();
}

// Delete note
async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadNotes();
}

// Edit note
async function editNote(id) {
  const newText = prompt("Edit your note:");
  if (newText && newText.trim() !== "") {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newText })
    });
    loadNotes();
  }
}

// Load notes
async function loadNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();

  const activeList = document.getElementById('activeNotes');
  const completedList = document.getElementById('completedNotes');
  activeList.innerHTML = "";
  completedList.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = note.completed;
    checkbox.addEventListener("change", () => toggleComplete(note._id, checkbox.checked));

    const text = document.createElement('span');
    text.textContent = " " + note.content;

    const date = document.createElement('small');
    date.style.marginLeft = "10px";
    date.style.color = "#666";
    date.textContent = `(${new Date(note.createdAt).toLocaleString()})`;

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(date);

    // Right click menu
    li.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      currentNoteId = note._id;
      showContextMenu(e.pageX, e.pageY);
    });

    if (note.completed) {
      completedList.appendChild(li);
    } else {
      activeList.appendChild(li);
    }
  });
}

// Context menu logic
const contextMenu = document.getElementById("contextMenu");
const editBtn = document.getElementById("editNote");
const deleteBtn = document.getElementById("deleteNote");

function showContextMenu(x, y) {
  contextMenu.style.top = `${y}px`;
  contextMenu.style.left = `${x}px`;
  contextMenu.style.display = "block";
}

window.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

editBtn.addEventListener("click", () => {
  if (currentNoteId) editNote(currentNoteId);
  contextMenu.style.display = "none";
});

deleteBtn.addEventListener("click", () => {
  if (currentNoteId) deleteNote(currentNoteId);
  contextMenu.style.display = "none";
});

loadNotes();
