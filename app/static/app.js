let csrf_token = document.getElementById('csrf_token').getAttribute('value');
window.addEventListener('DOMContentLoaded',init);
let add_list_item = document.getElementById('submit');
let remove_list_item = document.getElementById('remove');
let category_list = document.getElementById('category_list');
let overview = document.getElementById('overview');
let overall_date = document.getElementById('overall-date')
let TransactionInputDate = moment().format("YYYY-MM-DD");
let UpdateTransactionDate = ''
let overallDate = {
  "start": moment().format("YYYY-MM-DD"),
  "end": moment().format("YYYY-MM-DD")
};

function init(){
    const income_form = document.getElementById('category_form')
    const transaction_form = document.getElementById('trans_input')
    generate_list(getCategories,category_list);
    generate_list(getTransactions, trans_list);
    generate_list(getOverview, overview);
    category_form.addEventListener('submit', async (e) => {
        console.log("Clicked wrong button");
        e.preventDefault();
        let name = document.getElementById('category').value;
        let amount = document.getElementById('amount').value;
        let frequency = document.getElementById('frequency').value;
        let type = document.getElementById('type').value;
        let item = {
            "Name": name,
            "Amount": amount,
            "Frequency": frequency,
            "Type": type
        };
        console.log(item)
        let data = JSON.stringify(item);
        console.log(data);
        const result = await postCategories(data);
        console.log("RESULT NEW HERE");
        if( "Error" in result){
          var error_message = document.createElement('div');
          var my_error = '<p class="help is-danger has-text-centered is-italic is-size-6">Category already exists, please update instead</p>'
          error_message.innerHTML = my_error;
          error_message.id = 'category-already-exists'
          income_form.appendChild(error_message);
        }else{
        generate_list(getCategories,category_list);
        let if_error = document.getElementById('category-already-exists')
        if (if_error != 'undefined'){
          if_error.innerHTML = ''
        }
      }
    });

    transaction_form.addEventListener('submit', async (e) => {
        console.log("Clicked right button");
       e.preventDefault();
        let category = document.getElementById('trans_category').value;
        let amount = document.getElementById('trans_amount').value;
        let type = document.getElementById('typeOfTransaction').value;
        let date = TransactionInputDate;
        let data = {
            "Category": category,
            "Amount": amount,
            "Type": type,
            "Date": date
        };
        let jdata = JSON.stringify(data);
        console.log("Posting Data:");
        console.log(jdata);
        const result = await postTransaction(jdata);
        generate_list(getTransactions, trans_list);
        generate_list(getOverview, overview);
        console.log("FINISHED HERE");
    });
};
$('#TransDate').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "startDate": moment().format("MM/DD/YYYY")
}, function(start, end, label) {
  console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  TransactionInputDate = new Date(start.format('YYYY-MM-DD')).toISOString().split('T')[0];
  console.log(TransactionInputDate);
});
$('#overall-date').daterangepicker({
    "autoApply": true,
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    "locale": {
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
        ],
        "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "firstDay": 1
    },
    "startDate": moment().format("MM/DD/YYYY"), //FIX THIS
    "endDate": moment().format("MM/DD/YYYY")
}, function(start, end, label) {
  console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  overallDate = {
    "start": new Date(start.format('YYYY-MM-DD')).toISOString().split('T')[0],
    "end": new Date(end.format('YYYY-MM-DD')).toISOString().split('T')[0]
  };
  generate_list(getTransactions, trans_list);
  generate_list(getOverview, overview);
});



async function generate_list(get_func,listToAppend){
    var i
    var my_obj = await get_func();
    console.log(my_obj['data'].length);
    if(listToAppend.getAttribute('Id') === 'category_list'){
    listToAppend.innerHTML = '';
    for (i=0; i<my_obj['data'].length; i++){
        console.log(my_obj['data'][i]['Name']);
        var list_item = document.createElement('tr');
        let string =
        `<th><input type="text" id="category-name-${my_obj["data"][i]["id"]}" value = ${my_obj['data'][i]['Name']}></th>
        <th><input type="text" id="category-amount-${my_obj["data"][i]["id"]}" value = ${my_obj['data'][i]['Amount']}></th>
        <th><input type="text" id="category-frequency-${my_obj["data"][i]["id"]}" value = ${my_obj['data'][i]['Frequency']}></th>
        <th><button type="button" name="button" class='btn-upd button is-success'><i class="gg-add-r"></i></button></th>
        <th><button type="button" name="button" class='btn-rmv button is-danger'><i class="gg-remove-r"></i></button></th>`;
        list_item.innerHTML = string;
        list_item.id = `${listToAppend.getAttribute('id')}-${my_obj["data"][i]["id"]}`;
        listToAppend.appendChild(list_item);
    }
    }
    else if (listToAppend.getAttribute('id') === 'trans_list'){
        listToAppend.innerHTML = '';
        for(i=0; i<my_obj['data'].length; i++){
            var list_item = document.createElement('tr');
            var second_item = ''
            if (my_obj['data'][i]['Type'] === 'Income'){
              second_item = 'Outgoing'
            }else{
              second_item = 'Income'
            };
            let string =
            `<th><input type="text" id="transaction-name-${my_obj["data"][i]["id"]}" value = ${my_obj['data'][i]['Category']}></th>
             <th><input type="text" id="transaction-amount-${my_obj["data"][i]["id"]}" value = ${my_obj['data'][i]['Amount']}></th>
            <th><select id="transaction-type-${my_obj["data"][i]["id"]}"><option value = ${my_obj['data'][i]['Type']}>${my_obj['data'][i]['Type']}</option><option value=${second_item}>${second_item}</option></th>
            <th><input id="transaction-date-${my_obj["data"][i]["id"]}" class="transaction_record_calendar" type="text" value= "${my_obj['data'][i]['Date']}"></th>
            <th><button type="button" name="button" class='btn-upd button is-success'><i class="gg-add-r"></i></button></th>
            <th><button type="button" name="button" class='btn-rmv button is-danger'><i class="gg-remove-r"></i></button></th>`;
            list_item.id = `${listToAppend.getAttribute('id')}-${my_obj["data"][i]["id"]}`
            list_item.innerHTML = string;
            listToAppend.appendChild(list_item);
        }
    }
    else if(listToAppend.getAttribute('id') === 'overview'){
      listToAppend.innerHTML = '';
      let string = `<div class="control">
        <div class="tags has-addons">
          <span class="tag has-text-warning-dark is-size-3">Balance:</span>
          <span class="tag  is-size-3">${my_obj['data'][0]['balance']}</span>
        </div>
      </div>
      <hr>
      <div class="control">
        <div class="tags has-addons">
          <span class="tag has-text-primary-dark is-size-3">Total Incoming:</span>
          <span class="tag is-size-3">${my_obj['data'][0]['income']}</span>
        </div>
      </div>
      <div class="control">
        <div class="tags has-addons">
          <span class="tag has-text-danger-dark is-size-3">Total Outgoing:</span>
          <span class="tag is-size-3">${my_obj['data'][0]['outgoing']}</span>
        </div>
      </div>
  </div>`
    listToAppend.innerHTML = string;
    }
}

document.querySelectorAll('.over-view-switch').forEach(item => {
  item.addEventListener('click', event => {
    switchbox = event.target;
    console.log(switchbox.checked);
  });
})

async function getCategories(){
    const res = await fetch('/add_income', {
        headers : new Headers({
        'Content-Type': 'charset=utf-8;application/json',
        //'Accept': 'application/json',
        "X-CSRFToken": csrf_token
       }),
        method:'GET',
        data: overallDate
    });
    my_result = await res.json();
    console.log("RESULTS");
    console.log(my_result);
    return my_result;

}
async function postCategories(data){
    const res = await fetch('/add_income', {
        headers : new Headers ({
        'Content-Type': 'charset=utf-8;application/json',
        "X-CSRFToken": csrf_token
       }),
        method: 'POST',
        body: data
    });
    console.log(res);
    return res.json();
};
async function getTransactions(){
  console.log("GET TRANSACTIONS");
  console.log(overallDate);
    const res = await fetch('/get_transactions', {
        headers : new Headers({
        'Content-Type': 'charset=utf-8;application/json',
        //'Accept': 'application/json',
        "X-CSRFToken": csrf_token
       }),
        method:'POST',
        body: JSON.stringify(overallDate)
    });
    my_result = await res.json();
    console.log("RESULTS TRANSACIONS");
    console.log(my_result);
    return my_result;
}
async function postTransaction(data){
        const res = await fetch('/add_transaction', {
            headers : new Headers ({
            'Content-Type': 'charset=utf-8;application/json',
            "X-CSRFToken": csrf_token
           }),
            method: 'POST',
            body: data
        });
        my_result = await res.json();
        console.log(my_result);
    }

async function getOverview(){
  const res = await fetch('/get_overview', {
    headers : new Headers ({
      'Content-Type': 'charset=utf-8;application/json',
      "X-CSRFToken": csrf_token
    }),
    method: 'post',
    body: JSON.stringify(overallDate)
    });
    my_result = await res.json()
    return my_result;
}

// DOESN'T WORK IF CLICKING ON ICON
// WILL Pass the icon node to remove item which wont remove as no id
category_list.addEventListener('click', function(target){
  let element = target.target;
  console.log("HERE");
  if(element.classList.contains('btn-rmv') || element.parentNode.classList.contains('btn-rmv')){
    console.log("CHECK RETURNED TRUE");
    remove_item(element);
  } else if (element.classList.contains('btn-upd') || element.parentNode.classList.contains('btn-upd')){
    update_item(element)
  }
});

// *************************
//SET VALUE FOR UPDATE DATE IF DATE NOT SELECTED
trans_list.addEventListener('click', function(target){
  let element = target.target;
  console.log(element);
  console.log(element.parentNode.classList.contains('btn-rmv'));

  if(element.classList.contains('btn-rmv') || element.parentNode.classList.contains('btn-rmv')){
    console.log("CHECK RETURNED TRUE");
    if (element.parentNode.classList.contains('btn-rmv')){
      remove_item(element.parentNode)
    }else{
      remove_item(element);
    }
  } else if (element.classList.contains('btn-upd') || element.parentNode.classList.contains('btn-upd')){
    if(element.parentNode.classList.contains('btn-upd')){
      update_transaction(element.parentNode)
    }else{
        update_transaction(element)
    }
  }
  });

  $('body').on('focus',".transaction_record_calendar", function(){
      $(this).daterangepicker({
          "singleDatePicker": true,
          "timePicker": true,
          "startDate": moment().format("MM/DD/YYYY")
      }, function(start, end, label) {
        UpdateTransactionDate = new Date(start.format('YYYY-MM-DD')).toISOString().split('T')[0];
      });
  });

function remove_item(element){
  console.log(element);
  el = element.parentNode.parentNode;
  console.log(el);
  id = el.attributes.id.value;
  let val = id.split("-");
  el.parentNode.removeChild(el);
    console.log("el");
    console.log(val[1]);
    let data = {"ID": val[1]};
    let jsonData = JSON.stringify(data);
    removeCategory(jsonData);
}

function update_item(element){
  el = element.parentNode.parentNode;
  record_to_update = el.attributes.id.value.split('-')[1]
  new_cat_name = document.getElementById('category-name-' + record_to_update);
  new_cat_amount = document.getElementById('category-amount-' + record_to_update)
  new_cat_frequency = document.getElementById('category-frequency-' + record_to_update)
  console.log(new_cat_name.value);
  console.log(new_cat_amount.value);
  console.log(new_cat_frequency.value);
  item = {
    "Id": record_to_update,
    "Name": new_cat_name.value,
    "Amount": new_cat_amount.value,
    "Frequency": new_cat_frequency.value
  }
  json_data_for_update = JSON.stringify(item);
  console.log(json_data_for_update);
  updateCategory(json_data_for_update);
}

function update_transaction(element){
  el = element.parentNode.parentNode;
  record_to_update = el.attributes.id.value.split('-')[1]
  new_transaction_name = document.getElementById('transaction-name-' + record_to_update);
  new_transaction_amount = document.getElementById('transaction-amount-' + record_to_update)
  new_transaction_type = document.getElementById('transaction-type-' + record_to_update)
  item = {
    "Id": record_to_update,
    "Name": new_transaction_name.value,
    "Amount": new_transaction_amount.value,
    "Type": new_transaction_type.value,
    "Date": UpdateTransactionDate
  }
  json_data_for_update = JSON.stringify(item);
  console.log(json_data_for_update);
  updateTransaction(json_data_for_update);
}

async function removeCategory(id){
    const res = await fetch('/remove-transaction', {
        headers : new Headers ({
        'Content-Type': 'charset=utf-8;application/json',
        "X-CSRFToken": csrf_token
       }),
        method: 'POST',
        body: id
    });
    result = await res.json();
    console.log(result);
}

async function updateCategory(data){
  const res = await fetch('/update_category', {
    headers : new Headers ({
    'Content-Type': 'charset=utf-8;application/json',
    "X-CSRFToken": csrf_token
   }),
    method: 'POST',
    body: data
  });
  result = await res.json();
  console.log(result);
  }

async function updateTransaction(data){
    const res = await fetch('/update_transaction', {
      headers : new Headers ({
      'Content-Type': 'charset=utf-8;application/json',
      "X-CSRFToken": csrf_token
     }),
      method: 'POST',
      body: data
    });
    result = await res.json();
    console.log(result);
    }
