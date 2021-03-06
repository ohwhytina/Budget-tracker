let db;
const request = indexedDB.open('budget_tracker',1);

request.onugradeneeded = function(evt) {
    const db = evt.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(evt) {
    db = evt.target.result;
    if (navigator.onLine) {
        addBudget();
    }
};

function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    budgetObjectStore.add(record);
};

function addBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then(response = response.json())
            .then(() => {
            const transaction = db.transaction(['new_budget'], 'readwrite');
            const budgetObjectStore = transaction.objectStore('new_budget');
            budgetObjectStore.clear();
            })
        }
    }
};

window.addEventListener('online', addBudget);