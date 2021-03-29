from flask_wtf import FlaskForm

from wtforms import StringField,DateField, TextField, SubmitField, BooleanField, IntegerField, SelectField, PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from app.models import User, Categories
from flask_login import current_user, login_user, logout_user, login_required

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
    dateActive = StringField(
        'Date',
        id='TransDate'
    )
    Transaction_submit = SubmitField('Add Transaction')


class login_form(FlaskForm):
    username = StringField(
        'Username', validators=[DataRequired()])
    password = PasswordField(
        'Password', validators=[DataRequired()]
    )
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')
