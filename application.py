from flask import Flask, render_template, request, jsonify
import sqlite3
from sqlite3 import Error
from flask_wtf.csrf import CSRFProtect
from forms import income_form,outgoing_form
import json


csrf = CSRFProtect()
app = Flask(__name__)
csrf.init_app(app)

app.config['SECRET_KEY']='useless'
DBFILE = 'budget.db'

def create_connection():
    try:
        conn = sqlite3.connect(DBFILE)
        print(sqlite3.version)
    except Error as e:
        print(e)

insert_query = """insert into income (name, amount,frequency) values (?,?,?);"""
select_query = """select * from income"""
def run_query(type, query, data):
    my_data = data
    try:
        conn = sqlite3.connect(DBFILE)
    except Error as e:
        print(e)
    if type == 'insert':
        cursor = conn.cursor()
        cursor.execute(query, (data['Name'], int(data['Amount']), data['Frequency']))
        conn.commit()
    elif type == 'select':
        cursor = conn.execute(query)
        my_list = [i for i in cursor]
        conn.commit()
        my_object = []
        for i in my_list:
            item = {"Name":i[0], "Amount":i[1], "Frequency":i[2]}
            my_object.append(item)
        return my_object

@app.route('/')
def index():
    form = income_form()
    form1 = outgoing_form()
    return render_template('index.html', form_test=form, form=form1)

@app.route('/add_income', methods=['GET','POST']) #NOT WORKING#
def add_income():
    if(request.method == 'POST'):
        data = request.get_json(force=True)
        run_query('insert', insert_query, data)
        return jsonify(data['Name'])
    elif(request.method == 'GET'):
        return {"data":run_query('select', select_query, '')}
    else:
        return 'error'
def process_text(text):
    return text * 10


@app.route('/down', methods=['POST'])
def downvote():
    global votes
    if votes > 0:
        votes-=1
    return str(votes)

# ###
# TODO
# - figure out promise issue
# - clean up code
# add functinality for the other forms
# clean interface
# ###