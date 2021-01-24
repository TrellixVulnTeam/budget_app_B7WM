from flask_wtf import FlaskForm

from wtforms import StringField, TextField,SubmitField, IntegerField
from wtforms.validators import DataRequired, Length


class income_form(FlaskForm):
    name = StringField(
        'Name'
    )
    amount = IntegerField(
        'Amount'
    )
    frequency = StringField(
        'Frequency'
    )
    submit = SubmitField('Add Income')


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