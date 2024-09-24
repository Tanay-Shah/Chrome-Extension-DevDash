document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('new-task');
  const addTaskBtn = document.getElementById('add-task-btn');
  const tasksList = document.getElementById('tasks-list');

  // Load tasks from localStorage when the page loads
  loadTasks();

  // Event listener for adding tasks
  addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText) {
      addTaskToDOM(taskText);  // Add task to the list in DOM
      saveTaskToLocalStorage(taskText);  // Save task to localStorage
      taskInput.value = '';  // Clear the input field
    }
  });

  // Add task to DOM
  function addTaskToDOM(taskText) {
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    // Create a remove button for each task
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.style.marginLeft = '10px';
    removeBtn.addEventListener('click', function() {
      tasksList.removeChild(listItem);  // Remove task from DOM
      removeTaskFromLocalStorage(taskText);  // Remove task from localStorage
    });

    listItem.appendChild(removeBtn);  // Append remove button to list item
    tasksList.appendChild(listItem);  // Add task to the list
  }

  // Save task to localStorage
  function saveTaskToLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Remove task from localStorage
  function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskText);  // Filter out the removed task
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Load tasks from localStorage and display them in the DOM
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => {
      addTaskToDOM(taskText);
    });
  }



  // Code Editor (basic)
  const editor = document.getElementById('editor');

  // Store and retrieve editor content from Chrome storage
  editor.addEventListener('input', function() {
    chrome.storage.sync.set({ code: editor.value });
  });

  chrome.storage.sync.get('code', function(data) {
    editor.value = data.code || '';
  });

  // GitHub PR Tracker
  const fetchPRsBtn = document.getElementById('fetch-prs-btn');
  const prList = document.getElementById('pr-list');

  fetchPRsBtn.addEventListener('click', function() {
    fetch('https://api.github.com/Tanay-Shah')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        prList.innerHTML = '';  // Clear the list
        data.forEach(pr => {
          const listItem = document.createElement('li');
          listItem.textContent = `${pr.title} - ${pr.user.login}`;
          prList.appendChild(listItem);
        });
      });
  });

  // Daily Coding Challenges (using LeetCode API)
  const fetchChallengesBtn = document.getElementById('fetch-challenges-btn');
  const challengeDisplay = document.getElementById('challenge-display');

 
fetchChallengesBtn.addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'fetchChallenges' }, function(response) {
    if (response.data) {
      const challenge = response.data.stat_status_pairs[Math.floor(Math.random() * response.data.stat_status_pairs.length)];
      challengeDisplay.textContent = challenge.stat.question__title;
    } else {
      console.error('Error fetching challenges:', response.error);
    }
  });
});
});
