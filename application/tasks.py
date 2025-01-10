from celery import shared_task
from .models import Team
import flask_excel as excel
from .mail_service import send_email
from datetime import datetime, timedelta
from jinja2 import Template

@shared_task(ignore_result=False)
def daily_reminder():
    teams=Team.query.all()

    for team in teams:
        milestones = team.project.milestones
        for milestone in milestones:
            if milestone.due_date - datetime.now() < timedelta(days=2) and milestone.due_date - datetime.now() > timedelta(days=0):
                days_left = (milestone.due_date - datetime.now()).days
                students = team.students
                for student in students:
                    send_email(student.email,"Please Visit",f"<html>Hello, this is a reminder that your milestone {milestone.name} due date is {milestone.due_date.strftime('%Y/%m/%d')}. Please submit you milestone as soon as possible.<html>")
    
    current_date=datetime.now()
    current_date=current_date.strftime("%Y/%m/%d")
    
    # for user in users:
    #     today_orders=Orders.query.filter_by(user_id=user.id).all()
    #     for order in today_orders:
    #         order_date=order.date
    #         if order_date.strftime("%Y/%m/%d")==current_date:
    #             users.remove(user)
    #             break
    # for user in users:
    #     send_email(user.email,"Please Visit","<html>Hello, this is a daily reminder just to remind you to visit our application 127.0.0.1:5000<html>")
    return "Email sent."
