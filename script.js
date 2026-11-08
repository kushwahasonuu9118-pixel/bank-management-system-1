// Initial Bank Data Store (Simulated Database)
let bankData = {
    accounts: [
        { accNo: 1001, name: "Sonu Kumar", type: "Savings", balance: 25000, status: "Active" },
        { accNo: 1002, name: "Amit Sharma", type: "Current", balance: 12000, status: "Active" },
        { accNo: 1003, name: "Priya Singh", type: "Savings", balance: 45000, status: "Active" }
    ],
    transactions: [
        { id: "TXN101", accNo: 1001, date: "2026-10-28 10:30 AM", type: "Deposit", amount: 10000, balanceAfter: 25000, remarks: "Initial Deposit" },
        { id: "TXN102", accNo: 1002, date: "2026-10-29 02:15 PM", type: "Deposit", amount: 12000, balanceAfter: 12000, remarks: "Opening Deposit" },
        { id: "TXN103", accNo: 1003, date: "2026-10-30 11:00 AM", type: "Deposit", amount: 45000, balanceAfter: 45000, remarks: "Salary Credit" }
    ],
    activeAccNo: 1001,
    currentTxType: "Deposit"
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    populateAccountSelector();
    renderDashboard();
    renderAllAccounts();
    renderFullHistory();
});

// Tab Navigation Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    
    // Highlight matching sidebar nav
    const activeNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.getAttribute('onclick').includes(tabId));
    if (activeNav) activeNav.classList.add('active');
}

// Populate Account Selector Dropdowns
function populateAccountSelector() {
    const selector = document.getElementById("activeAccountSelect");
    const standaloneSelect = document.getElementById("selectAccountTx");
    
    selector.innerHTML = "";
    standaloneSelect.innerHTML = "";

    bankData.accounts.forEach(acc => {
        const option1 = `<option value="${acc.accNo}" ${acc.accNo === bankData.activeAccNo ? 'selected' : ''}>${acc.accNo} - ${acc.name}</option>`;
        const option2 = `<option value="${acc.accNo}">${acc.accNo} - ${acc.name}</option>`;
        selector.innerHTML += option1;
        standaloneSelect.innerHTML += option2;
    });
}

// Change Active Account
function changeActiveAccount(accNo) {
    bankData.activeAccNo = parseInt(accNo);
    renderDashboard();
}

// Set Quick Transaction Type (Deposit vs Withdrawal)
function setTransactionType(type) {
    bankData.currentTxType = type;
    document.getElementById("btnTabDeposit").classList.toggle("active", type === "Deposit");
    document.getElementById("btnTabWithdraw").classList.toggle("active", type === "Withdrawal");
    
    const submitBtn = document.getElementById("txSubmitBtn");
    submitBtn.innerHTML = type === "Deposit" ? `<i class="fa-solid fa-check"></i> Process Deposit` : `<i class="fa-solid fa-minus-circle"></i> Process Withdrawal`;
    submitBtn.className = type === "Deposit" ? "btn btn-success block-btn" : "btn btn-primary block-btn";
}

// Render Dashboard Details
function renderDashboard() {
    const acc = bankData.accounts.find(a => a.accNo === bankData.activeAccNo);
    if (!acc) return;

    document.getElementById("welcomeTitle").innerText = `Welcome, ${acc.name}`;
    document.getElementById("currentBalance").innerText = `₹${acc.balance.toLocaleString('en-IN')}`;

    // Filter transactions for active account
    const accTransactions = bankData.transactions.filter(t => t.accNo === acc.accNo);
    
    const totalDep = accTransactions.filter(t => t.type === "Deposit").reduce((sum, t) => sum + t.amount, 0);
    const totalWith = accTransactions.filter(t => t.type === "Withdrawal").reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("totalDeposits").innerText = `₹${totalDep.toLocaleString('en-IN')}`;
    document.getElementById("totalWithdrawals").innerText = `₹${totalWith.toLocaleString('en-IN')}`;
    document.getElementById("totalTransactionsCount").innerText = accTransactions.length;

    // Render Account Details
    document.getElementById("accountInfoDetails").innerHTML = `
        <p><span>Account Holder:</span> <strong>${acc.name}</strong></p>
        <p><span>Account Number:</span> <strong>${acc.accNo}</strong></p>
        <p><span>Account Type:</span> <strong>${acc.type}</strong></p>
        <p><span>Status:</span> <strong style="color: green;">${acc.status}</strong></p>
    `;

    // Render Recent Transactions
    const recentTable = document.getElementById("recentTransactionsTable");
    recentTable.innerHTML = "";
    
    accTransactions.slice().reverse().slice(0, 5).forEach(t => {
        recentTable.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.date}</td>
                <td><span class="badge ${t.type === 'Deposit' ? 'badge-deposit' : 'badge-withdrawal'}">${t.type}</span></td>
                <td>${t.remarks}</td>
                <td style="color: ${t.type === 'Deposit' ? 'green' : 'red'}; font-weight: 600;">
                    ${t.type === 'Deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
                </td>
                <td>₹${t.balanceAfter.toLocaleString('en-IN')}</td>
            </tr>
        `;
    });
}

// Handle Quick Transaction Form Submission
function handleTransaction(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("txAmount").value);
    const remarks = document.getElementById("txRemarks").value;
    const type = bankData.currentTxType;

    executeTransactionLogic(bankData.activeAccNo, type, amount, remarks);
    document.getElementById("transactionForm").reset();
}

// Handle Standalone Transaction Form Submission
function handleStandaloneTransaction(e) {
    e.preventDefault();
    const accNo = parseInt(document.getElementById("selectAccountTx").value);
    const type = document.getElementById("standaloneType").value;
    const amount = parseFloat(document.getElementById("standaloneAmount").value);
    const remarks = document.getElementById("standaloneRemarks").value;

    executeTransactionLogic(accNo, type, amount, remarks);
    document.getElementById("standaloneTxForm").reset();
}

// Main Transaction Business Logic
function executeTransactionLogic(accNo, type, amount, remarks) {
    const acc = bankData.accounts.find(a => a.accNo === accNo);
    if (!acc) return alert("Account not found!");

    if (type === "Withdrawal" && acc.balance < amount) {
        alert("Insufficient Balance! Transaction cancelled.");
        return;
    }

    if (type === "Deposit") {
        acc.balance += amount;
    } else {
        acc.balance -= amount;
    }

    const newTx = {
        id: "TXN" + (bankData.transactions.length + 101),
        accNo: acc.accNo,
        date: new Date().toLocaleString(),
        type: type,
        amount: amount,
        balanceAfter: acc.balance,
        remarks: remarks
    };

    bankData.transactions.push(newTx);
    alert(`${type} of ₹${amount} successful!`);

    renderDashboard();
    renderAllAccounts();
    renderFullHistory();
}

// Create New Account
function handleCreateAccount(e) {
    e.preventDefault();
    const name = document.getElementById("newAccName").value;
    const type = document.getElementById("newAccType").value;
    const initialDeposit = parseFloat(document.getElementById("initialDeposit").value);

    const newAccNo = bankData.accounts.length > 0 ? Math.max(...bankData.accounts.map(a => a.accNo)) + 1 : 1001;

    const newAccount = {
        accNo: newAccNo,
        name: name,
        type: type,
        balance: initialDeposit,
        status: "Active"
    };

    bankData.accounts.push(newAccount);

    // Initial Deposit Transaction Record
    bankData.transactions.push({
        id: "TXN" + (bankData.transactions.length + 101),
        accNo: newAccNo,
        date: new Date().toLocaleString(),
        type: "Deposit",
        amount: initialDeposit,
        balanceAfter: initialDeposit,
        remarks: "Account Opening Deposit"
    });

    bankData.activeAccNo = newAccNo;
    populateAccountSelector();
    renderDashboard();
    renderAllAccounts();
    renderFullHistory();
    closeModal("openAccountModal");
    document.getElementById("createAccountForm").reset();

    alert(`Account Created Successfully! Account Number: ${newAccNo}`);
}

// Render All Accounts Table
function renderAllAccounts() {
    const table = document.getElementById("allAccountsTable");
    table.innerHTML = "";

    bankData.accounts.forEach(acc => {
        table.innerHTML += `
            <tr>
                <td><strong>${acc.accNo}</strong></td>
                <td>${acc.name}</td>
                <td>${acc.type}</td>
                <td>₹${acc.balance.toLocaleString('en-IN')}</td>
                <td><span class="badge badge-deposit">${acc.status}</span></td>
                <td>
                    <button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="changeActiveAccount(${acc.accNo}); switchTab('dashboard');">
                        View Dashboard
                    </button>
                </td>
            </tr>
        `;
    });
}

// Render Full Transaction History Table
function renderFullHistory() {
    const table = document.getElementById("fullHistoryTable");
    table.innerHTML = "";

    bankData.transactions.slice().reverse().forEach(t => {
        table.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.accNo}</td>
                <td>${t.date}</td>
                <td><span class="badge ${t.type === 'Deposit' ? 'badge-deposit' : 'badge-withdrawal'}">${t.type}</span></td>
                <td>${t.remarks}</td>
                <td style="color: ${t.type === 'Deposit' ? 'green' : 'red'}; font-weight: 600;">
                    ${t.type === 'Deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
                </td>
                <td>₹${t.balanceAfter.toLocaleString('en-IN')}</td>
            </tr>
        `;
    });
}

// Filter Transaction History
function filterHistory() {
    const filter = document.getElementById("historyFilterType").value;
    const table = document.getElementById("fullHistoryTable");
    table.innerHTML = "";

    const filtered = filter === "All" ? bankData.transactions : bankData.transactions.filter(t => t.type === filter);

    filtered.slice().reverse().forEach(t => {
        table.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.accNo}</td>
                <td>${t.date}</td>
                <td><span class="badge ${t.type === 'Deposit' ? 'badge-deposit' : 'badge-withdrawal'}">${t.type}</span></td>
                <td>${t.remarks}</td>
                <td style="color: ${t.type === 'Deposit' ? 'green' : 'red'}; font-weight: 600;">
                    ${t.type === 'Deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
                </td>
                <td>₹${t.balanceAfter.toLocaleString('en-IN')}</td>
            </tr>
        `;
    });
}

// Modal Toggle Functions
function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

// Mobile Navigation Functions
function toggleMobileMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
}

function closeMobileMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
}
