from flask import Flask, render_template, request, jsonify
import sqlite3
from sqlite3 import Error
from flask_wtf.csrf import CSRFProtect
from forms import income_form,outgoing_form, transaction_form
import json




app = Flask(__name__)
csrf = CSRFProtect(app)
csrf.init_app(app)

app.config['SECRET_KEY'] = 'useless1'
app.config['SESSION_COOKIE_NAME'] = 'myApp-session-1'
DBFILE = 'budget.db'

def create_connection():
    try:
        conn = sqlite3.connect(DBFILE)
        print(sqlite3.version)
    except Error as e:
        print(e)

select_categories_query = """select name from money where archived = 'n';"""
insert_query = """insert into money (name, amount,frequency, type) values (?,?,?,?);"""
select_query = """select rowid, name, amount, frequency, type from money where archived = 'n'"""
update_query = """UPDATE money SET archived = 'y' WHERE rowid = ?"""
insert_transaction = """insert into transactions (category, amount, type, date) VALUES (?,?,?,?);"""
get_transactions_query = """select rowid, category, amount, type, date from transactions;"""
get_overview_query = """select type, sum(amount) from transactions group by type;"""
def run_query(type, query, data):
    my_data = data
    try:
        conn = sqlite3.connect(DBFILE)
    except Error as e:
        print(e)
    if type == 'insert':
        cursor = conn.cursor()
        cursor.execute(query, (data['Name'], int(data['Amount']), data['Frequency'], data["Type"]))
        conn.commit()
    elif type == 'select':
        cursor = conn.execute(query)
        my_list = [i for i in cursor]
        conn.commit()
        my_object = []
        for i in my_list:
            item = {"id":i[0], "Name":i[1], "Amount":i[2], "Frequency":i[3], "Type":i[4]}
            my_object.append(item)
        return my_object
    elif type=='update':
        cursor = conn.cursor()
        cursor.execute(query, data)
        conn.commit()
    elif type == 'getCategories':
        cursor = conn.execute(query)
        my_list = []
        for i in cursor:
            my_list.append(i[0])
        return my_list
    elif type == 'insertTransaction':
        cursor = conn.cursor()
        cursor.execute(query, (data['Category'], int(data['Amount']), data['Type'], data['Date']))
        conn.commit()
    elif type == 'getTransactions':
        cursor = conn.execute(query)
        my_list = [i for i in cursor]
        my_object = []
        for i in my_list:
            item = {'id': i[0], "Category": i[1], "Amount":i[2], "Type": i[3], "Date":i[4]}
            my_object.append(item)
        return my_object
    elif type == 'getOverview':
        cursor = conn.execute(query)
        my_list = [i for i in cursor]
        my_object = [{"income": my_list[0][1], "outgoing": my_list[1][1], "balance":
                      my_list[0][1] - my_list[1][1]}]
        return my_object

@app.route('/')
def index():
    form = income_form()
    tran_form = transaction_form()
    tran_form.trans_category.choices = run_query('getCategories', select_categories_query, '')
    return render_template('index.html', form=form, tran_form = tran_form)

@app.route('/new_home')
def new_home():
    form = income_form()
    tran_form = transaction_form()
    tran_form.trans_category.choices = run_query('getCategories', select_categories_query, '')
    return render_template('index1.html', form=form, tran_form=tran_form)

@app.route('/add_income', methods=['GET','POST']) #NOT WORKING#
def add_income():
    if(request.method == 'POST'):
        data = request.get_json(force=True)
        run_query('insert', insert_query, data)
        return jsonify(data['Name'])

    elif(request.method == 'GET'):
        data = run_query('select', select_query, '')
        with open('get.txt', 'w') as f:
            f.write(str(data))
        return {"data": data}
    else:
        return 'error'
def process_text(text):
    return text * 10


@app.route('/remove-category', methods =['POST'])
def remove_category():
    data = request.get_json(force=True)
    try:
        run_query('update', update_query, data["ID"])
    except:
        return {"Message":"Error"}
    return {"Message": "Success"} # FIX THIS HAVE PROPER RESPONSES

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json(force=True)
    with open('test.txt', 'w') as f:
        f.write(str(data));
    try:
        run_query('insertTransaction', insert_transaction, data)
    except:
        return {"Message":"Error"}
    return {"Message": "Success"}

@app.route('/get_transactions', methods=['GET'])
def get_transactions():
    data = run_query('getTransactions', get_transactions_query, '')
    with open('get.txt', 'w') as f:
        f.write(str(data))
    return {"data": data}

@app.route('/get_overview', methods=['GET'])
def get_overview():
    data = run_query('getOverview', get_overview_query, '')
    return {"data":data}




