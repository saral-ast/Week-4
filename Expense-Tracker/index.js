
$(document).ready(function() {
    // localStorage.clear();
   let groups = JSON.parse(localStorage.getItem('groups')) || [];
   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  
  
    let totalExpense = expenses.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
    let thisMonth = getTime().slice(0, 7);
    let thisMonthExpense = expenses.filter((expense) => expense.date.slice(0,7) == thisMonth).reduce((acc, expense) => acc + parseInt(expense.amount),0);


//    console.log(expenses);

    // console.log(thisMonthExpense);
    
    //  console.log(groups)
    dashBoardRender(totalExpense, thisMonthExpense);
    updateGroupDashboard(groups);
    updateDataInAddExpense(groups);
    ExpenseRender(expenses)
    // updateGroupDashboard();
    // Add Group
   
    $('#addGroup').on('click', function() {
        $('#addGroupForm').toggle();
        $('#addGroupData').click(function(e) {
            e.preventDefault();
             const groupName = $('#groupName').val().trim();
             if(!groupName) return 
             const createdDate = getTime();
             let updatedDate = getTime();    
             saveGroup({groupName, createdDate, updatedDate});
                $('#groupName').val('');   
             $('#addGroupForm').hide();     
        })

    });

    $('#addExpense').on('click', function() {
        const date = getTime();
        $('#expenseDate').val(date);
        // console.log(hi);
        $('#addExpenseForm').toggle();
        $('#addExpenseData').click(function(e) {
            e.preventDefault();
            const name = $('#expenseName').val().trim();
            const groupName = $('#group-Name').val().trim();
            const amount = $('#expenseAmount').val();
            const date = $('#expenseDate').val();
            
            $('#addExpenseForm').toggle();
            saveExpense({name, groupName, amount, date});
            dashBoardRender();
            $('#expenseForm')[0].reset();

           
            // console.log(name, groupName, amount, date);
        })
    });
      

    //Render the dashboard
    function dashBoardRender(totalExpense, thisMonthExpense) {
       

        $('#totalExpense').html(totalExpense || 0);
        $('#monthExpense').html(thisMonthExpense || 0);
         
    }
      
 
        //Get The time from the current time
        function getTime() {
            const today = new Date().toISOString().slice(0, 10);
            return today;
        }

        //Save Group in localStorage
        function saveGroup(group) {
            // localStorage.clear();
            const groups = JSON.parse(localStorage.getItem('groups')) || [];
            // console.log(typeof groups);
            groups.push(group);
            localStorage.setItem('groups', JSON.stringify(groups));

            updateGroupDashboard(groups);
            updateDataInAddExpense(groups);
        }

            //update the group in add expense
        function updateDataInAddExpense(groups) {
                $('#expenseData').html(``);
               
                // console.log(groups);
                let  data = groups.map((group) => {
                        return `<option value="${group.groupName}">${group.groupName}</option>`;
                    })
                // console.log(data);
                $('#group-Name').html(data || `<option value="">No Group Available</option>`);
        }

        //Save Expense in localStorage
        function saveExpense(expense) {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            // const data = JSON.parse(localStorage.getItem('expenses'));
            // console.log(data);
            ExpenseRender(expenses);
           
            // let totalExpense = expense.reduce((acc, curr) => acc + curr.amount, 0);
            // console.log(totalExpense);

        }


        //render the groups list
        function updateGroupDashboard(groups) {
            // console.log(groups);
            let data;
           if(groups.length > 0) {
               data = groups.map((group) => {
                //    console.log(group.groupName);
                  return ` <div class="flex flex-row h-16 w-2xl justify-between m-2 bg-gray-200">    
                        <h3 class ="p-3 content-center">${group.groupName}</h3>
                        <p class ="p-3 content-center">${group.createdDate}</p>
                        <p class ="p-3 content-center">${group.updatedDate}</p>
                     </div>`;
                 })
            }
            // console.log(groupHTML);
             $('#groupData').html( data || `<h3 class="text-left p-3 text-xl">No Group Available</h3>`);
        }

        // render the expense list
        function ExpenseRender() {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            // console.log(expenses);
            let data;
            if(expenses.length > 0) {
                data = expenses.map((expense) => {
                    return `<div class="flex flex-row h-16 w-2xl justify-between m-2 bg-gray-200">    
                    <h3 class ="p-3 content-center">${expense.name}</h3>
                    <p class ="p-3 content-center">${expense.groupName}</p>
                    <p class ="p-3 content-center">${expense.amount}</p>
                    <p class ="p-3 content-center">${expense.date}</p>
                 </div>`;
                })
            }
            $('#expenseData').html(data || `<h3 class="text-left p-3 text-xl">No Expense Available</h3>`);
        }



});