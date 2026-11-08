import java.util.ArrayList;
import java.util.Scanner;

// Transaction class stores individual transaction details
class Transaction {
    private String transactionId;
    private String type;
    private double amount;
    private double balanceAfter;
    private String remarks;

    public Transaction(String transactionId, String type,
                       double amount, double balanceAfter, String remarks) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.remarks = remarks;
    }

    public void displayTransaction() {
        System.out.printf(
            "%-10s | %-12s | Rs. %-10.2f | Balance: Rs. %-10.2f | Note: %s%n",
            transactionId, type, amount, balanceAfter, remarks
        );
    }
}

// BankAccount class stores account details and performs transactions
class BankAccount {
    private int accountNumber;
    private String accountHolderName;
    private String accountType;
    private double balance;

    private ArrayList<Transaction> transactionHistory;

    private static int txCounter = 101;

    public BankAccount(int accountNumber, String accountHolderName,
                       String accountType, double initialBalance) {

        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.accountType = accountType;
        this.balance = initialBalance;

        transactionHistory = new ArrayList<>();

        recordTransaction(
            "Deposit",
            initialBalance,
            "Initial Account Opening Deposit"
        );
    }

    public int getAccountNumber() {
        return accountNumber;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public double getBalance() {
        return balance;
    }

    private void recordTransaction(String type, double amount, String remarks) {
        String transactionId = "TXN" + txCounter++;

        Transaction transaction = new Transaction(
            transactionId, type, amount, balance, remarks
        );

        transactionHistory.add(transaction);
    }

    // Deposit money
    public void deposit(double amount, String remarks) {

        if (!Double.isFinite(amount) || amount <= 0) {
            System.out.println("ERROR: Deposit amount must be greater than zero.");
            return;
        }

        balance += amount;

        recordTransaction("Deposit", amount, remarks);

        System.out.printf(
            "SUCCESS: Rs. %.2f deposited successfully! New Balance: Rs. %.2f%n",
            amount, balance
        );
    }

    // Withdraw money
    public void withdraw(double amount, String remarks) {

        if (!Double.isFinite(amount) || amount <= 0) {
            System.out.println("ERROR: Withdrawal amount must be greater than zero.");
            return;
        }

        if (amount > balance) {
            System.out.printf(
                "ERROR: Insufficient balance! Available Balance: Rs. %.2f%n",
                balance
            );
            return;
        }

        balance -= amount;

        recordTransaction("Withdrawal", amount, remarks);

        System.out.printf(
            "SUCCESS: Rs. %.2f withdrawn successfully! Remaining Balance: Rs. %.2f%n",
            amount, balance
        );
    }

    // Display account information
    public void displayAccountInfo() {

        System.out.println("\n-------------------------------------------");
        System.out.println("Account Number : " + accountNumber);
        System.out.println("Account Holder : " + accountHolderName);
        System.out.println("Account Type   : " + accountType);
        System.out.printf("Current Balance: Rs. %.2f%n", balance);
        System.out.println("-------------------------------------------");
    }

    // Display transaction history
    public void viewHistory() {

        System.out.println(
            "\n--- TRANSACTION HISTORY FOR ACCOUNT: " + accountNumber + " ---"
        );

        if (transactionHistory.isEmpty()) {
            System.out.println("No transactions recorded yet.");
            return;
        }

        for (Transaction transaction : transactionHistory) {
            transaction.displayTransaction();
        }
    }
}

// Main application class
public class BankTransactionSystem {

    private static ArrayList<BankAccount> accountsList = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    private static int nextAccNumber = 1001;

    public static void main(String[] args) {

        // Creating a sample account
        accountsList.add(
            new BankAccount(nextAccNumber++, "Sonu Kumar", "Savings", 25000)
        );

        int choice;

        do {
            System.out.println("\n=== BANK TRANSACTION MANAGEMENT SYSTEM ===");
            System.out.println("1. Open New Account");
            System.out.println("2. Deposit Money");
            System.out.println("3. Withdraw Money");
            System.out.println("4. Check Balance & Details");
            System.out.println("5. View Transaction History");
            System.out.println("6. List All Accounts");
            System.out.println("7. Exit");

            choice = readInt("Enter your choice (1-7): ");

            switch (choice) {

                case 1:
                    openAccount();
                    break;

                case 2:
                    performDeposit();
                    break;

                case 3:
                    performWithdrawal();
                    break;

                case 4:
                    checkBalance();
                    break;

                case 5:
                    viewTransactionHistory();
                    break;

                case 6:
                    listAllAccounts();
                    break;

                case 7:
                    System.out.println(
                        "Exiting System. Thank you for using Apex Bank Portal!"
                    );
                    break;

                default:
                    System.out.println(
                        "Invalid choice! Please select between 1 and 7."
                    );
            }

        } while (choice != 7);
    }

    // Read integer safely
    private static int readInt(String message) {

        while (true) {
            System.out.print(message);
            String input = scanner.nextLine().trim();

            try {
                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.println("Invalid input! Please enter a valid number.");
            }
        }
    }

    // Read decimal number safely
    private static double readDouble(String message) {

        while (true) {
            System.out.print(message);
            String input = scanner.nextLine().trim();

            try {
                double value = Double.parseDouble(input);

                if (Double.isFinite(value)) {
                    return value;
                }

                System.out.println("Please enter a valid amount.");

            } catch (NumberFormatException e) {
                System.out.println("Invalid input! Please enter a numeric amount.");
            }
        }
    }

    // Find account using account number
    private static BankAccount findAccount(int accNo) {

        for (BankAccount account : accountsList) {

            if (account.getAccountNumber() == accNo) {
                return account;
            }
        }

        return null;
    }

    // Open a new account
    private static void openAccount() {

        System.out.print("Enter Account Holder Name: ");
        String name = scanner.nextLine().trim();

        if (name.isEmpty()) {
            System.out.println("ERROR: Account holder name cannot be empty.");
            return;
        }

        System.out.print("Enter Account Type (Savings/Current): ");
        String type = scanner.nextLine().trim();

        if (type.equalsIgnoreCase("Savings")) {
            type = "Savings";
        } else if (type.equalsIgnoreCase("Current")) {
            type = "Current";
        } else {
            System.out.println("ERROR: Please enter Savings or Current.");
            return;
        }

        double initialBalance = readDouble(
            "Enter Initial Deposit Amount (Minimum Rs. 500): "
        );

        if (initialBalance < 500) {
            System.out.println("ERROR: Minimum initial deposit is Rs. 500.");
            return;
        }

        BankAccount newAccount = new BankAccount(
            nextAccNumber++, name, type, initialBalance
        );

        accountsList.add(newAccount);

        System.out.println(
            "SUCCESS: Account created successfully! Account Number: "
            + newAccount.getAccountNumber()
        );
    }

    // Deposit money
    private static void performDeposit() {

        int accNo = readInt("Enter Account Number: ");
        BankAccount account = findAccount(accNo);

        if (account == null) {
            System.out.println("ERROR: Account Number not found.");
            return;
        }

        double amount = readDouble("Enter Amount to Deposit: Rs. ");

        System.out.print("Enter Deposit Remarks/Note: ");
        String remarks = scanner.nextLine().trim();

        if (remarks.isEmpty()) {
            remarks = "No remarks";
        }

        account.deposit(amount, remarks);
    }

    // Withdraw money
    private static void performWithdrawal() {

        int accNo = readInt("Enter Account Number: ");
        BankAccount account = findAccount(accNo);

        if (account == null) {
            System.out.println("ERROR: Account Number not found.");
            return;
        }

        double amount = readDouble("Enter Amount to Withdraw: Rs. ");

        System.out.print("Enter Withdrawal Remarks/Note: ");
        String remarks = scanner.nextLine().trim();

        if (remarks.isEmpty()) {
            remarks = "No remarks";
        }

        account.withdraw(amount, remarks);
    }

    // Check account balance
    private static void checkBalance() {

        int accNo = readInt("Enter Account Number: ");
        BankAccount account = findAccount(accNo);

        if (account == null) {
            System.out.println("ERROR: Account Number not found.");
            return;
        }

        account.displayAccountInfo();
    }

    // View transaction history
    private static void viewTransactionHistory() {

        int accNo = readInt("Enter Account Number: ");
        BankAccount account = findAccount(accNo);

        if (account == null) {
            System.out.println("ERROR: Account Number not found.");
            return;
        }

        account.viewHistory();
    }

    // Display all registered accounts
    private static void listAllAccounts() {

        System.out.println("\n=== ALL REGISTERED ACCOUNTS ===");

        if (accountsList.isEmpty()) {
            System.out.println("No accounts found.");
            return;
        }

        for (BankAccount account : accountsList) {

            System.out.printf(
                "Acc No: %d | Name: %-15s | Balance: Rs. %.2f%n",
                account.getAccountNumber(),
                account.getAccountHolderName(),
                account.getBalance()
            );
        }
    }
}
