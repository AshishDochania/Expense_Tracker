const state = {
    earnings: 0,
    expense: 0,
    net: 0,
    transactions: [
        
    ],
};

let isUpdate=false;
let tid
  
const transactionFormEl = document.getElementById("transactionForm");
  

const renderTransactions = () => {
    const transactionContainerEl = document.querySelector(".transactions");
    const netAmountEl = document.getElementById("netAmount");
    const earnEl = document.getElementById("earning");
    const expenseEl = document.getElementById("expensee");
  
    let earning = 0;
    let expense = 0;
    let net = 0;
    transactionContainerEl.innerHTML = "";
  
    state.transactions.forEach((transaction) => {
        const { id, amount, text, type } = transaction;
        const isCredit = type === "credit" ? true :false;
        const sign = isCredit ? "+" : "-";
    
        const transactionEl = `
            <div class="indiv" id="${id}" onclick="showEdit(${id})">
                <div class="content" >
                    <div class="left">
                      <p>${text}</p>
                      <p>Rs${sign}${amount}</p>
                    </div>
                </div>
                <div class="status ${isCredit ? "credit" : "debit"}">
                  ${isCredit ? "C" : "D"}
                </div>
                <div class="lower">
                    <div class="icon" onclick="handleUpdate(${id})">
                        <img src="./icons/pen.svg" alt="pen"/>
                    </div>
                    <div class="icon" onclick="handleDelete(${id})">
                        <img src="./icons/trash.svg" alt="trash"/>
                    </div>
                </div>
            </div>
        `;
    
        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;
    
        transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl);
    });
  
    netAmountEl.innerHTML = `Rs${net}`;
    earnEl.innerHTML = `Rs${earning}`;
    expenseEl.innerHTML = `Rs${expense}`;
};

const addTransaction = (e) => {
    e.preventDefault();
  
    const isEarn = e.submitter.id === "earn" ? true :false;
  
    const formData = new FormData(transactionFormEl);
    const tData = {};

    formData.forEach((value,key)=>{
        tData[key]=value;
    });
  
    const { text, amount } = tData;
  
    const transaction = {
        id: isUpdate ? tid: Math.floor(Math.random() * 1000),
        text: text,
        amount: +amount,
        type: isEarn ? "credit" : "debit",
    };
  
    if(isUpdate){
        const tIndex=state.transactions.findIndex((t)=>t.id===tid);

        state.transactions[tIndex]=transaction;
        isUpdate=false;
        tid=null;
    }else{
        state.transactions.push(transaction);
    }
  
    renderTransactions();
  
    transactionFormEl.reset();
    console.log({ tData });
};

const showEdit = (id) => {
    const selectedTransaction = document.getElementById(id);
    const lowerEl = selectedTransaction.querySelector(".lower");
    lowerEl.classList.toggle("showTransaction"); 
};

const handleUpdate = (id) =>{

    const transaction = state.transactions.find((t)=> t.id ===id);
    const {text,amount}=transaction;

    const textInput= document.getElementById("text");
    const amountInput=document.getElementById("Amount");

    textInput.value=text;
    amountInput.value=amount;

    tid=id;
    isUpdate=true;
}

const handleDelete = (id) =>{
    const filteredTransaction = state.transactions.filter(t=> t.id !== id);

    state.transactions = filteredTransaction;
    renderTransactions();
}

renderTransactions();

transactionFormEl.addEventListener("submit", addTransaction);
  