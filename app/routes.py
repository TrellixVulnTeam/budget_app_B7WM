from app import app, db
from app.models import User, Categories, Transactions
from app.forms import income_form, transaction_form, login_form, RegisterForm
from flask import render_template, flash, redirect, request, url_for
from datetime import datetime
from sqlalchemy.sql import func, case
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from wtforms.validators import ValidationError


@app.route('/')
@app.route('/index')
@login_required
def index():
    form = income_form()
    tran_form = transaction_form()
    tran_form.trans_category.choices = [i[0] for i in
                                        db.session.query(Categories.category).filter(Categories.archived == 'n',
                                                                                     Categories.user_id == current_user.id).all()]
    # tran_form.trans_category.choices = run_query('getCategories', select_categories_query, '')
    return render_template('index.html', form=form, tran_form=tran_form)


@app.route('/add_income', methods=['GET', 'POST'])  # NOT WORKING#
def add_income():
    if request.method == "POST":
        data = request.get_json(force=True)
        new_category = Categories.query.filter_by(category=data['Name'],
                                                  user_id=current_user.id).first()
        if new_category is not None:
            return {"Error": 'Category already Exists'}
        new_cat = Categories(category=data['Name'], amount=data['Amount'], frequency=data['Frequency'],
                             type=data['Type'], archived='n', user_id=current_user.id)
        db.session.add(new_cat)
        db.session.commit()
        return {"Status": "success"}
    elif request.method == "GET":
        data = []
        returned_categories = Categories.query.filter(Categories.user_id == current_user.id,
                                                      Categories.archived == 'n').all()
        for category in returned_categories:
            item = {"id": category.id, "Name": category.category, "Amount": category.amount,
                    "Frequency": category.frequency, "Type": category.type}
            data.append(item)
        return {"data": data}


@app.route('/login', methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = login_form()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/register', methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/remove-category', methods=['POST'])
def remove_category():
    data = request.get_json(force=True)
    Categories.query.filter(Categories.id == data['ID']).update({Categories.archived: "y"})
    db.session.commit()
    return {"Success": "Item removed from database"}


@app.route('/remove-transaction', methods=['POST'])
def remove_transaction():
    data = request.get_json(force=True)
    Transactions.query.filter(Transactions.id == data['ID']).update({Transactions.archived: "y"})
    db.session.commit()
    return {"Success": "Item removed from database"}


@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json(force=True)
    try:
        new_transaction = Transactions(category=data['Category'], amount=data['Amount'],
                                       type=data['Type'], date=datetime.strptime(data['Date'], '%Y-%m-%d').date(),
                                       user_id=current_user.id, archived='n')
        db.session.add(new_transaction)
        db.session.commit()
        return {"message": data, "type": str(type(data))}
    except Exception:
        return {"message": Exception}


@app.route('/get_transactions', methods=['POST'])
def get_transactions():
    dates = request.get_json(force=True)
    data = []
    returned_transactions = Transactions.query.filter(Transactions.date >= dates['start'],
                                                      Transactions.date <= dates['end'],
                                                      Transactions.user_id == current_user.id,
                                                      Transactions.archived == 'n')
    for transaction in returned_transactions:
        item = {"id": transaction.id, "Category": transaction.category,
                "Amount": transaction.amount, "Type": transaction.type,
                "Date": transaction.date}
        data.append(item)
    return {"data": data}


@app.route('/get_overview', methods=['POST'])
def get_overview():
    dates = request.get_json(force=True)
    overview = Transactions.query.with_entities(Transactions.type, func.sum(Transactions.amount)).filter(
        Transactions.date >= dates['start'],
        Transactions.date <= dates['end'],
        Transactions.archived == 'n',
        Transactions.user_id == current_user.id).group_by(Transactions.type).all()
    return_object = {}
    for item in overview:
        return_object[item[0].lower()] = item[1]

    if len(return_object) == 0:
        return_object = {"income": 0, "outgoing": 0, "balance": 0}
    elif len(return_object) == 2:
        return_object['balance'] = return_object['income'] - return_object['outgoing']
    elif "income" not in return_object:
        return_object['income'] = 0
        return_object['balance'] = return_object['outgoing'] * -1
    else:
        return_object['outgoing'] = 0
        return_object['balance'] = return_object['income']
    return {"data": [return_object]}


@app.route('/update_category', methods=['POST'])
def update_category():
    data = request.get_json(force=True)
    Categories.query.filter(Categories.id == data['Id']).update({
        Categories.category: data['Name'],
        Categories.amount: data['Amount'],
        Categories.frequency: data['Frequency']
    })
    db.session.commit()
    return {"Success": "Successfully updated"}


@app.route('/update_transaction', methods=['POST'])
def update_transaction():
    data = request.get_json(force=True)
    Transactions.query.filter(Transactions.id == data['Id']).update({
        Transactions.category: data['Name'],
        Transactions.amount: data['Amount'],
        Transactions.type: data['Type'],
        Transactions.date: datetime.strptime(data['Date'], '%m/%d/%Y').date()
    })
    db.session.commit()
    return {"success": "Successfully Updated"}