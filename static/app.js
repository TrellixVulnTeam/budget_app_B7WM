let csrf_token = document.getElementById('csrf_token').getAttribute('value');
window.addEventListener('DOMContentLoaded',init);
let add_list_item = document.getElementById('submit');
let remove_list_item = document.getElementById('remove');
let category_list = document.getElementById('category_list');
let overview = document.getElementById('overview');
let overall_date = document.getElementById('overall-date')

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
        generate_list(getCategories,category_list);
    });

    transaction_form.addEventListener('submit', async (e) => {
        console.log("Clicked right button");
       e.preventDefault();
        let category = document.getElementById('trans_category').value;
        let amount = document.getElementById('trans_amount').value;
        let type = document.getElementById('typeOfTransaction').value;
        let date = document.getElementById('TransDate').value;
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
// $('#TransDate').daterangepicker({
//     "singleDatePicker": true,
//     "timePicker": true,
//     "startDate": "03/21/2021",
//     "endDate": "03/27/2021"
// }, function(start, end, label) {
//   console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
// });
// $('#overall-date').daterangepicker({
//     "autoApply": true,
//     ranges: {
//         'Today': [moment(), moment()],
//         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//         'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//         'This Month': [moment().startOf('month'), moment().endOf('month')],
//         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//     },
//     "locale": {
//         "format": "MM/DD/YYYY",
//         "separator": " - ",
//         "applyLabel": "Apply",
//         "cancelLabel": "Cancel",
//         "fromLabel": "From",
//         "toLabel": "To",
//         "customRangeLabel": "Custom",
//         "weekLabel": "W",
//         "daysOfWeek": [
//             "Su",
//             "Mo",
//             "Tu",
//             "We",
//             "Th",
//             "Fr",
//             "Sa"
//         ],
//         "monthNames": [
//             "January",
//             "February",
//             "March",
//             "April",
//             "May",
//             "June",
//             "July",
//             "August",
//             "September",
//             "October",
//             "November",
//             "December"
//         ],
//         "firstDay": 1
//     },
//     "startDate": "03/20/2021", //FIX THIS
//     "endDate": "03/26/2021"
// }, function(start, end, label) {
//   console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
// });


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
        `<th><input type="text" id="name" value = ${my_obj['data'][i]['Name']}></th>
        <th>${my_obj['data'][i]['Amount']}</th>
        <th>${my_obj['data'][i]['Frequency']}</th>
        <th><button type="button" name="button" class='btn-rmv'>Remove</button></th>`;
        //
        list_item.innerHTML = string;
        list_item.id = `${listToAppend.getAttribute('id')}-${my_obj["data"][i]["id"]}`;
        listToAppend.appendChild(list_item);
    }
    }
    else if (listToAppend.getAttribute('id') === 'trans_list'){
        listToAppend.innerHTML = '';
        for(i=0; i<my_obj['data'].length; i++){
            var list_item = document.createElement('tr');
            let string =
            `<th><input type="text" id="name" value = ${my_obj['data'][i]['Category']}></th>
            <th>${my_obj['data'][i]['Amount']}</th>
            <th>${my_obj['data'][i]['Type']}</th>
            <th>${my_obj['data'][i]['Date']}</th>
            <th><button type="button" name="button" class='btn-rmv'>Remove</button></th>`;
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

async function getCategories(){
    const res = await fetch('/add_income', {
        headers : new Headers({
        'Content-Type': 'charset=utf-8;application/json',
        //'Accept': 'application/json',
        "X-CSRFToken": csrf_token
       }),
        method:'GET'
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
    const res = await fetch('/get_transactions', {
        headers : new Headers({
        'Content-Type': 'charset=utf-8;application/json',
        //'Accept': 'application/json',
        "X-CSRFToken": csrf_token
       }),
        method:'GET'
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
    method: 'GET',
    });
    my_result = await res.json()
    return my_result;
}
