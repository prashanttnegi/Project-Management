from flask import Flask
from application.worker import celery_init_app
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
import flask_excel as excel
from celery.schedules import crontab
from application.instances import cache
from application.auth import jwt
from flask_cors import CORS
from application.tasks import daily_reminder
 


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authorization'
    app.config['WTF_CSRF_ENABLED'] = False
    app.config['JWT_SECRET_KEY']='12345'
    # Base.metadata.create_all(None)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        import application.controllers

    return app

app = create_app()
celery_app=celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=10, minute=0),
        daily_reminder.s(),
    )

    sender.add_periodic_task(
        crontab(hour=20, minute=30),
        daily_reminder.s(),
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

    
    