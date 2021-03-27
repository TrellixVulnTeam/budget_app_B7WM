from flask_wtf import FlaskForm

from wtforms import StringField,DateField, TextField,SubmitField, IntegerField, SelectField
from wtforms.validators import DataRequired, Length


class income_form(FlaskForm):
    category = StringField(
        'Category'
    )
    amount = IntegerField(
        'Amount'
    )
    frequency = StringField(
        'Frequency'
    )
    type = StringField(
        'Type'
    )
    dateActive = DateField(
        'StartDate',
        format='%d-%m-%Y'
    )
    Category_submit = SubmitField('Add Category')


class outgoing_form(FlaskForm):
    name1 = StringField(
        'Name'
    )
    amount1 = IntegerField(
        'Amount'
    )
    frequency1 = StringField(
        'Frequency'
    )
    submit = SubmitField('Add Income')
    select = SelectField(
        'select',
        choices=['One', 'Two', 'Three'],
        id='MyID'
    )

class transaction_form(FlaskForm):
    trans_category = SelectField(
        'Category'
    )
    typeOfTransaction = SelectField(
        'In/Out',
        choices=['Income','Outgoing']
    )
    trans_amount = IntegerField(
        'Amount'
    )
    dateActive = DateField(
        'Date',
        format='%Y-%m-%d',
        id='TransDate'
    )
    Transaction_submit = SubmitField('Add Transaction')