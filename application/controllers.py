from flask import request,render_template,send_file,make_response
from flask import jsonify, current_app as app
from flask_security import auth_required, roles_required, verify_password, current_user, roles_accepted, hash_password
from PIL import Image as PILImage
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from io import BytesIO
from datetime import datetime
from celery import shared_task
import flask_excel as excel
from jinja2 import Template
from sqlalchemy import or_
from flask_jwt_extended import jwt_required, get_jwt_identity
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from application.models import *
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle, Paragraph
#from werkzeug.security import generate_password_hash, check_password_hash
import matplotlib.pyplot as plt
from .sec import datastore
#from celery.result import AsyncResult
from .instances import cache
from .resources import CustomDateField

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register_user():
    data=request.get_json()
    name = data['name'] 
    email=data['email']
    password=data['password']
    role=data['role']
    print(role)
    if not email:
        return jsonify({"error":"Email is required"}),400
    if datastore.find_user(email=email):
        print(email)
        return jsonify({"error":"Email already registered. Try logging in or registering using different email_id."}),402
    hashed_password = hash_password(password)
    if role=='instructor':
        new_user = datastore.create_user(name = name, email=email, password=hashed_password, created_at=datetime.now(), is_approved=False, roles=[role])
    else:
        new_user = datastore.create_user(name = name, email=email, password=hashed_password, created_at=datetime.now(), is_approved=True, roles=[role])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'error': 'User created successfully. Please log in.'}), 201

    #if role=='Store_Manager':
     #   datastore.create_user(email=email,password=generate_password_hash(password),active=False,roles=[role])
    #else:
     #   datastore.create_user(email=email,password=generate_password_hash(password),roles=[role])
        
   # db.session.commit()
    #return jsonify({'message':'User registered successfully'}), 201
    

@app.route('/user_login', methods=['POST'])
def user_login():
    data=request.get_json()
    email=data['email']
    password=data.get('password')
    if not email:
        return jsonify({"error":"Email is required"}),400
    user=datastore.find_user(email=email)    
    if not user:
        return jsonify({"error":"User not found"}),404    
    if user.active==False:
        return jsonify({"error":"User not activated. Please activate your account"}),400
    if verify_password(password, user.password):
        jwt_token=create_access_token(identity=user.id)
        return jsonify({"token": jwt_token, "email": user.email, "id": user.id, "role": user.roles[0].name}),200
    else:
        return jsonify({"error":"Wrong password"}),400
    
    
@app.route('/api/students', methods=['GET'])
def get_students():
    # Query to find all users with the role "student"
    students = (
        db.session.query(User)
        .join(RolesUsers, User.id == RolesUsers.user_id)  # Join with roles_users on user ID
        .join(Role, RolesUsers.role_id == Role.id)  # Join with Role on role ID
        .filter(Role.name == 'student')  # Filter by role name "student"
        .all()
    )
    # Format the result into a list of dictionaries
    student_list = [{
        'id': student.id,
        'name': student.name,
        'email': student.email,
        'created_at': student.created_at,
        'is_approved': student.is_approved,
    } for student in students]

    # Return the list of students as a JSON response
    return jsonify(student_list), 200

@app.route('/download_projects', methods=['GET'])
@app.route('/download_projects/<int:project_id>', methods=['GET'])  # Optional project_id
def download_pdf(project_id=None):
    filename = create_resource_pdf(project_id)  # Pass project_id if provided, else None
    with open(filename, "rb") as f:
        pdf_data = f.read()

    response = make_response(pdf_data)
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    response.headers['Content-Type'] = 'application/pdf'
    return response

@app.get('/get-pdf/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename=res.result
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message": "Download Pending"}),404
    

@shared_task(ignore_result=False)
def create_resource_pdf(project_id=None):
    if project_id:
        # Query for the specific project by project_id
        data = Project.query.with_entities(
            #Project.project_name,
            Project.description,
            Project.project_subtitle,
            Project.marks,
            User.name.label("instructor_name")
        ).join(User, Project.instructor_id == User.id).filter(Project.id == project_id).all()

        # Check if the project exists
        if not data:
            raise ValueError(f"Project with id {project_id} not found.")

        # Prepare data for the table
        table_data = [["Project Description", "Project Subtitle", "Instructor Name", "Marks"]] #"Project Name",
        for row in data:
            table_data.append([
                #row.project_name,
                Paragraph(row.description), 
                row.project_subtitle,
                row.instructor_name,
                str(row.marks)
            ])

        filename = f"project_{project_id}_details.pdf"  # Filename for the specific project

    else:
        # Query for all projects if project_id is not provided
        data = Project.query.with_entities(
            #Project.project_name,
            Project.description,
            Project.project_subtitle,
            Project.marks,
            User.name.label("instructor_name")
        ).join(User, Project.instructor_id == User.id).all()

        # Prepare data for the table
        table_data = [[ "Project Description", "Project Subtitle", "Instructor Name", "Marks"]] #"Project Name"
        for row in data:
            table_data.append([
                #row.project_name,
                row.description, 
                row.project_subtitle,
                row.instructor_name,
                str(row.marks)
            ])

        filename = "all_projects_details.pdf"  # Filename for all projects

    # Generate PDF
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Add title in the center
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawCentredString(width / 2, height - 50, "Project Data")
    y_position = height - 100

    # Adjust column widths for a wider table
    col_widths = [150, 150, 120, 80]  # Set custom widths for each column
    table = Table(table_data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Header background color
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center align all cells
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Header font bold
        ('FONTSIZE', (0, 0), (-1, 0), 10),  # Header font size
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Header padding
        ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Add grid to the table
        ('FONTSIZE', (0, 1), (-1, -1), 9),  # Content font size
        ('LEFTPADDING', (0, 0), (-1, -1), 10),  # Increase left padding
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),  # Increase right padding
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Align text to the top
        ('WORDWRAP', (0, 1), (-1, -1)),  # Enable word wrapping
    ]))

    # Calculate table position
    table_width, table_height = table.wrapOn(pdf, width, y_position)
    table.drawOn(pdf, (width - table_width) / 2, y_position - table_height)

    pdf.save()

    # Save PDF to file
    with open(filename, 'wb') as f:
        f.write(buffer.getvalue())
    buffer.close()

    return filename  # Return the file path

@app.route('/student_projects', methods=['GET'])
@jwt_required()
def student_projects():
    user_id = get_jwt_identity()
    try:
        # Query to get projects for the given user_id using the team_members junction table
        projects = (
            db.session.query(Project)
            .join(Team, Team.project_id == Project.id)  # Join Team with Project
            .join(team_members, team_members.c.team_id == Team.id)  # Join team_members junction table with Team
            .filter(team_members.c.user_id == user_id, Project.is_enabled==1)  # Filter by user_id
            .all()
        ) 
        
        if not projects:
            return jsonify({"message": "No projects found for the given user"}), 404

        # Prepare the response data
        project_data = []
        for project in projects:
            # Query milestones for the current project
            milestones = (
                db.session.query(Milestone)
                .filter(Milestone.project_id == project.id)
                .order_by(Milestone.start_date, Milestone.id)
                .all()
            )

            # Serialize milestones
            milestone_data = [
                {
                    "id": milestone.id,
                    "name": milestone.name,
                    "description": milestone.description,
                    "start_date": CustomDateField().format(milestone.start_date),  
                    "due_date": CustomDateField().format(milestone.due_date),
                }
                for milestone in milestones
            ]

            # Add project and milestone data
            project_data.append({
                "id": project.id,
                "description": project.description,
                "project_subtitle": project.project_subtitle,
                "marks": project.marks,
                "milestones": milestone_data,
            })
        
        return jsonify({"projects": project_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/show_score/<int:milestone_id>', methods=['GET'])
@jwt_required()
def show_score(milestone_id):
    user_id = get_jwt_identity()
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    milestone = Milestone.query.get(milestone_id)
    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    project_id = milestone.project_id # Project id associated with milestone

    # Check for user validation 
    team = (
        Team.query.join(team_members)
        .filter(
            team_members.c.user_id == user_id,
            Team.project_id == project_id
        )
        .first()
    )
    if not team:
        return jsonify({"error": "User is not part of a team for this milestone's project"}), 404

    submission = Submission.query.filter_by(
        milestone_id=milestone_id,
        team_id=team.id
    ).first()

    if not submission:
        return jsonify({"error": "No submission found for the given milestone"}), 404

    return jsonify({
        "id": submission.id,
        "file_link": submission.file_link,
        "feedback": submission.feedback,
        "grade": submission.grade,
        "submission_date": submission.submission_date.isoformat(),
        "team_id": submission.team_id,
        "milestone_id": submission.milestone_id
    }), 200

'''

@app.route('/show_score/<int:milestone_id>', methods=['GET'])
@jwt_required()
def show_score(milestone_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.all_teams:
        return jsonify({"error": "User is not part of any team"}), 404

    team = user.all_teams[0] # fetch the team that is asssociated with the given milestone_id - project_id - and user_id

    submission = Submission.query.filter_by(
        milestone_id=milestone_id,
        team_id=team.id
    ).first()

    if not submission:
        return jsonify({"error": "No submission found for the given milestone"}), 404

    return jsonify({
        "id": submission.id,
        "file_link": submission.file_link,
        "feedback": submission.feedback,
        "grade": submission.grade,
        "submission_date": submission.submission_date.isoformat(),
        "team_id": submission.team_id,
        "milestone_id": submission.milestone_id
    }), 200
'''