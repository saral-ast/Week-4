$(document).ready(function() {
    console.log(localStorage);

    // let groups = JSON.parse(localStorage.getItem('groups')) || [];
    // let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    // localStorage.clear();
    dashBoardRender();
    updateGroupDashboard();
    updateDataInAddExpense();
    ExpenseRender();

    // Open Add Group Modal
    $('#addGroup').on('click', function() {
        $('#groupModal').removeClass('hidden').addClass('bg-[#EFF1F3]'); // Modal background change
    });

    // Close Add Group Modal
    $('#closeGroupModal').click(() => $('#groupModal').addClass('hidden'));

    // Add Group Data
    $('#addGroupData').click(function(e) {
        e.preventDefault();
        const groupName = $('#groupName').val().trim();
        if (!groupName) return;
        const validate = validateGroup(groupName);

        if (validate) {
            const createdDate = getTime();
            let updatedDate = getTime();
            saveGroup({ groupName, createdDate, updatedDate });
            $('#groupName').val('');
            $('#groupModal').addClass('hidden');
        } else {
            alert('Group Already Exists');
            $('#groupName').val('');
            $('#groupModal').addClass('hidden');
        }
    });

    // Open Add Expense Modal
    $('#addExpense').click(function() {
        const date = getTime();
        $('#expenseDate').val(date);
        $('#expenseModal').removeClass('hidden').addClass('bg-[#EFF1F3]'); // Modal background change
    });

    // Close Add Expense Modal
    $('#closeExpenseModal').click((e) => {
        e.preventDefault();
        $('#expenseModal').addClass('hidden');
    });

    // Add Expense Data
    $('#addExpenseData').click(function(e) {
        e.preventDefault();
        const name = $('#expenseName').val().trim();
        const groupName = $('#group-Name').val().trim();
        const amount = $('#expenseAmount').val();
        const date = $('#expenseDate').val();

        if(amount < 0) {
            alert('Please enter a valid amount');
            return;
        };

        $('#expenseModal').toggleClass('hidden');
        $('#expenseForm')[0].reset();
        const validate = validateExpense(name, groupName, amount, date);

        if (validate) {
            saveExpense({ name, groupName, amount, date });
            dashBoardRender();
        } else {
            let check = confirm('Expense Already Exists');
            if (check) {
                saveExpense({ name, groupName, amount, date });
            }
            dashBoardRender();
        }
    });

    $('.anchor').on('click', viewExpennse);
    $('.deleteExpense').on('click', deleteExpense);
    $('.deleteGroup').on('click', deleteGroupExpense);
    $('#closeGroupWiseData').click(() => $('#groupWiseData').addClass('hidden'));

    // Render the dashboard
    function dashBoardRender() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const totalExpense = expenses.length ? expenses.reduce((acc, curr) => acc + parseInt(curr.amount), 0) : 0;
        const thisMonth = getTime().slice(0, 7);
        const thisMonthExpense = expenses.length ? expenses.filter((expense) => expense.date.slice(0, 7) == thisMonth) : 0;
        const thisMonthExpenseTotal = thisMonthExpense ? thisMonthExpense.reduce((acc, curr) => acc + parseInt(curr.amount), 0) : 0;
        const highestExpense = thisMonthExpense ? thisMonthExpense.reduce((acc, curr) => Math.max(acc, parseInt(curr.amount)), 0) : 0;

        $('#totalExpense').text("₹"+totalExpense);
        $('#monthExpense').html("₹"+thisMonthExpenseTotal);
        $('#highestExpense').html("₹"+highestExpense);
    }

    // Get the time from the current time
    function getTime() {
        const today = new Date().toISOString().slice(0, 10);
        return today;
    }

    // Save Group in localStorage
    function saveGroup(group) {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups.push(group);
        localStorage.setItem('groups', JSON.stringify(groups));
        updateGroupDashboard(groups);
        updateDataInAddExpense(groups);
    }

    // Update the group in add expense
    function updateDataInAddExpense() {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        let data = groups.map((group) => {
            return `<option value="${group.groupName}">${group.groupName}</option>`;
        })
        $('#group-Name').html(data || `<option value="">No Group Available</option>`);
    }

    // Save Expense in localStorage
    function saveExpense(expense) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateGroupDashboard();
        ExpenseRender();
    }

    // Render the groups list
    function updateGroupDashboard() {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        let groupHTML = groups.map((group) => {
            const totalAmount = totalGroup(group);
            return `<tr class="bg-[#EFF1F3] shadow-md rounded-lg p-4 my-2">
                <td class="p-3 text-left" id="${group.groupName}">${group.groupName}</td>
                <td class="p-3 text-left">${group.createdDate}</td>
                <td class="p-3 text-left">${group.updatedDate}</td>
                <td class="p-3 text-left text-green-700 font-bold">₹${totalAmount}</td>
                <td><a href="#groupData" class="text-[#223843] font-medium hover:underline anchor">View Expenses</a></td>
                <td><button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 justify-self-end font-medium rounded-lg text-sm px-3 py-2 ml-1.5 me-2 mb-2 deleteGroup">Delete</button></td>
            </tr>`;
        }).join('');
        $('#groupData').html(groupHTML || `<h3 class="text-left p-3 text-xl font-semibold text-gray-700">No Group Available</h3>`);

        $('.anchor').click(viewExpennse);
        $('.deleteGroup').click(deleteGroupExpense);
        ExpenseRender();
    }

    // Render the expense list
    // Render the expense list
        function ExpenseRender() {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            let data = expenses.length ? expenses.map((expense) => {
                return `<tr class="bg-[#EFF1F3] shadow-md rounded-lg p-4 my-2">
                    <td class="p-3 text-left">${expense.name}</td>
                    <td class="p-3 text-left">${expense.groupName}</td>
                    <td class="p-3 text-left text-green-700 font-bold">₹${expense.amount}</td>
                    <td class="p-3 text-left">${expense.date}</td>
                    <td><button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 justify-self-end font-medium rounded-lg text-sm px-3 py-2 ml-1.5 me-2 mb-2 deleteExpense">Delete</button></td>
                </tr>`;
            }) : `<h3 class="text-left p-3 text-xl font-semibold text-gray-700">No Expense Available</h3>`;
            
            $('#expenseData').html(data);

            // Re-bind delete event listener after rendering
            $('.deleteExpense').on('click', deleteExpense);
        }


    // Calculate total for group
    function totalGroup(group) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const totalAmount = expenses.filter((expense) => expense.groupName == group.groupName).reduce((acc, expense) => acc + parseInt(expense.amount), 0);
        return totalAmount;
    }

    // Validate group
    function validateGroup(Name) {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        if (groups.length == 0) return true;
        for (let group of groups) {
            if (group.groupName.toLowerCase() === Name.toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    // Validate expense
    function validateExpense(name, groupName, amount, date) {
        
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        for (let expense of expenses) {
            if (expense.name.toLowerCase() === name.toLowerCase() && expense.groupName.toLowerCase() === groupName.toLowerCase() && expense.amount === amount && expense.date === date) {
                return false;
            }
        }
        return true;
    }

    // View Expense
    function viewExpennse(e) {
        e.preventDefault();
        $('#groupWiseData').removeClass('hidden');
        const name = $(this).parent().parent().find('td').first().text();
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const groupWiseData = expenses.filter((expense) => expense.groupName === name);
        const totalValue = groupWiseData.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
        let data = groupWiseData.map((expense) => {
            return `<tr class="border-b">
                <td class="p-3 text-left">${expense.name}</td>
                <td class="p-3 text-left">${expense.amount}</td>
                <td class="p-3 text-left">${expense.date}</td>
                <td><button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 justify-self-end font-medium rounded-lg text-sm px-3 py-2 ml-1.5 me-2 mb-2 deleteExpense">Delete</button></td>
            </tr>`;
        }).join('');
        $('#groupWiseDataContent').html(data || `<h3 class="text-left p-3 text-xl">No Expense Available</h3>`);
        $('#totalData').text(`Total Expense: ₹${totalValue}`);
    }

    


    //Delete Group Expense
    function deleteGroupExpense(){
        const name = $(this).parent().parent().find('td').first().text();  // Get the name of the expense to delete
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        const updatedGroups = groups.filter((group) => group.groupName !== name);  // Remove the expense from the list
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const updatedExpenses = expenses.filter((expense) => expense.groupName !== name);
        localStorage.setItem('groups', JSON.stringify(updatedGroups));  // Save the updated list to localStorage
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));  // Save the updated list to localStorage
        ExpenseRender();  // Re-render the expense list after deletion
        dashBoardRender();
        updateGroupDashboard();

    }
    // Delete expense
    function deleteExpense() {
        const name = $(this).parent().parent().find('td').first().text();  // Get the name of the expense to delete
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const updatedExpenses = expenses.filter((expense) => expense.name !== name);  // Remove the expense from the list
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));  // Save the updated list to localStorage
        ExpenseRender();  // Re-render the expense list after deletion
        dashBoardRender();
        updateGroupDashboard();

    }
    
});
