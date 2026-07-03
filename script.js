// Initialize variables
let serialNo = 1;
let totalAmount = 0;
const addButton = document.querySelector('#addButton');
const totalExp = document.querySelector('#Expense'); 
const totalInc = document.querySelector('#income');
const balance = document.querySelector('#balance');
const resetBtn = document.querySelector('.reset');
const Entry = document.querySelector('.entries-list');
const dropDown = document.querySelector("#entryType"); 

// Add entry on button click
addButton.addEventListener("click", () => {
    const inputName = document.getElementById('name').value.trim();
    const amountInput = document.getElementById('amount').value.trim();
    const dateInput = document.getElementById('date').value;

    // Validate inputs
    if (!inputName) {
        alert("Please enter a name for the entry");
        return;
    }
    
    if (!amountInput || isNaN(amountInput) || parseFloat(amountInput) <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }
    
    if (!dateInput) {
        alert("Please select a date");
        return;
    }

    // Create new entry element
    const entryItem = document.createElement('div');
    entryItem.className = 'entry';  
    entryItem.innerHTML = 
        `<span class="serialNo">${serialNo}</span>
        <span class="name">${inputName}</span>
        <span class="amount">${amountInput}</span>
        <span class="date">${dateInput}</span>
        <button class="delete-btn">Delete</button>`;
    
    Entry.appendChild(entryItem);  // Append the entry to the entries list
    
    // Increment serial number and update total expense
    serialNo++; 
    totalAmount = totalAmount + parseFloat(amountInput);
    totalExp.value = totalAmount; 
    
    Balance(); // Update balance after adding the expense

    // Store the entry in localStorage
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push({
        serialNo: serialNo - 1,
        name: inputName, 
        amount: amountInput, 
        date: dateInput,
    });

    // Update localStorage with the new data
    localStorage.setItem("entries", JSON.stringify(entries));
    localStorage.setItem('totalExp', totalAmount);
    localStorage.setItem('totalInc', totalInc.value);
    localStorage.setItem('balance', balance.value);
    localStorage.setItem('serialNo', serialNo);

    // Clear input fields after adding the entry
    document.getElementById('name').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('date').value = ""; 
});

// Delete entry functionality
Entry.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const entry = event.target.closest('.entry');
        if (entry) {
            const amountSpan = entry.querySelector('.amount');
            const amountValue = parseFloat(amountSpan.textContent);

            // Update total amount and balance after deletion
            totalAmount -= amountValue; 
            totalExp.value = totalAmount;
            
            // Update balance
            const income = parseFloat(totalInc.value) || 0;
            const expense = parseFloat(totalExp.value) || 0;
            if (income >= expense) {
                balance.value = income - expense;
            } else {
                balance.value = "Negative";
            }

            // Remove the entry from localStorage
            const serialNoToDelete = parseInt(entry.querySelector('.serialNo').textContent);
            let entries = JSON.parse(localStorage.getItem('entries')) || [];
            const updatedEntries = entries.filter(entry => entry.serialNo !== serialNoToDelete);

            // Reindex the serial numbers after deletion
            updatedEntries.forEach((entry, index) => {
                entry.serialNo = index + 1;
            });

            // Update localStorage after deletion
            localStorage.setItem('entries', JSON.stringify(updatedEntries));
            localStorage.setItem('totalExp', totalExp.value);
            localStorage.setItem('balance', balance.value);
            localStorage.setItem('serialNo', updatedEntries.length + 1);

            entry.remove(); // Remove the entry from the DOM
            
            // Update serial number for next entry
            serialNo = updatedEntries.length + 1;
        }
    }
});

// Load entries from localStorage on page load
window.onload = function() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    serialNo = entries.length > 0 ? Math.max(...entries.map(e => e.serialNo)) + 1 : 1;

    // Display stored entries in the DOM
    entries.forEach(entry => {
        const entryItem = document.createElement('div');
        entryItem.className = 'entry';
        entryItem.innerHTML = 
            `<span class="serialNo">${entry.serialNo}</span>
            <span class="name">${entry.name}</span>
            <span class="amount">${entry.amount}</span>
            <span class="date">${entry.date}</span>
            <button class="delete-btn">Delete</button>`;
        
        Entry.appendChild(entryItem);
        totalAmount += parseFloat(entry.amount);
    });

    // Load stored values for total expenses, income, and balance
    totalExp.value = localStorage.getItem('totalExp') || '0';
    totalInc.value = localStorage.getItem('totalInc') || '';
    balance.value = localStorage.getItem('balance') || '';
    
    // Update totalAmount from localStorage
    totalAmount = parseFloat(localStorage.getItem('totalExp')) || 0;
};

// Function to calculate balance based on total income and expense
const Balance = () => {
    const income = parseFloat(totalInc.value) || 0;
    const expense = parseFloat(totalExp.value) || 0;
    if (income >= expense) {
        let b = income - expense; 
        balance.value = b; 
    } else {
        balance.value = "Negative";
    }
}

// Reset button functionality to clear all data
resetBtn.addEventListener("click", () => {
    alert("Please Enter Your Income First"); 
    Entry.innerHTML = ""; 
    totalExp.value = ""; 
    totalInc.value = "";
    balance.value = "";
    serialNo = 1; 

    // Clear input fields
    document.getElementById('name').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';

    // Clear localStorage
    localStorage.clear();
});

// Navigate through input fields using Enter key
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach((input) => {
    input.addEventListener('keydown', (e) => {
        const key = e.key; 
        if (key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            const currentIndex = Array.from(inputs).indexOf(e.target);
            if (currentIndex > -1 && currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus(); // Focus on the next input field
            }
        }
    });
});

// dropDown.addEventListener("change" , ()=> {
//     const selectedValue = dropDown.value ; 
//     document.getElementById('name').value = selectedValue;
// });