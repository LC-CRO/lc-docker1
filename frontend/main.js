document.getElementById('addTodoButton').addEventListener('click', addTodo);

function addTodo() {
    const todoContent = document.getElementById('todoInput').value;
    if (!todoContent) return;

    fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: todoContent })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('todoInput').value = '';
        loadTodos();
    });
}

function deleteTodo(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        loadTodos();
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

function loadTodos() {
    fetch('http://localhost:3000/todos')
    .then(response => {
        if (response.status === 403) {
            showNotification('BDD en cours de démarrage, patientez...');
            setTimeout(loadTodos, 1000); 
            throw new Error('Erreur BDD');
        }
        hideNotification();
        return response.json();
    })
    .then(todos => {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = todo.content;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTodo(todo.id);

            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', loadTodos);
