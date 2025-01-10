from main import app
from application.sec import datastore
from application.models import db,Role
#from werkzeug.security import generate_password_hash
from flask_security import hash_password

print("Running initial_data.py")

with app.app_context(): #this code will have access to all app level data
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="instructor", description="User is an instructor")
    datastore.find_or_create_role(name="student", description="User is a student")
    db.session.commit()

    # Fetch roles from the database
    admin_role = datastore.find_role("admin")
    instructor_role = datastore.find_role("instructor")
    student_role = datastore.find_role("student")

    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(name='Admin', email="admin@email.com", password=hash_password("admin"), roles=[admin_role] )
    if not datastore.find_user(email="instructor1@email.com"):
        datastore.create_user(name='Instructor1', email="instructor1@email.com", password=hash_password("instructor1"), roles=[instructor_role])
    if not datastore.find_user(email="student1@email.com"):
        datastore.create_user(name='Student1', email="student1@email.com", password=hash_password("student1"), roles=[student_role])
    db.session.commit()
    