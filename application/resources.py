from flask_restful import Resource, Api, reqparse, fields, marshal_with,marshal
from flask_security import current_user
from datetime import datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from application.models import Project, db, Milestone,User,Team,team_members
from application.models import Project, db, Milestone, Team, Submission, Notification
from flask import Flask, request, jsonify
from datetime import datetime
import pytz
import json
import urllib.request
import urllib.error
import http.client
from werkzeug.security import generate_password_hash
from sqlalchemy import and_, not_, exists
from sqlalchemy.orm import aliased

def hash_password(password):
    return generate_password_hash(password)

# Define the IST timezone
IST = pytz.timezone('Asia/Kolkata')

# Initialize API and Request Parser
api = Api(prefix='/api')
parser = reqparse.RequestParser()
project_parser = reqparse.RequestParser()

project_parser.add_argument('description', type=str, required=True, help='Description is required')
project_parser.add_argument('instructor_id', type=int, required=False, help='Instructor ID is required')
project_parser.add_argument('marks', type=int, help='Marks should be a number')
project_parser.add_argument('project_subtitle', type=str, help='Subtitle should be a string')
project_parser.add_argument('subject_id', type=int, help='Subject ID should be an integer')
project_parser.add_argument('due_date', type=str, help='Due date should be in YYYY-MM-DD format')
project_parser.add_argument('is_enabled', type=bool, help='is_enabled should be a boolean value')

#---------------------API for Users---------------------------------------

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'is_approved': fields.Boolean,
    'created_at': fields.DateTime(),
    'role': fields.String(attribute=lambda user: user.roles[0].name if user.roles else None)  # Get role name
}

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404
            return marshal(user, user_fields), 200
        else:
            users = User.query.all()
            if not users:
                return {"message": "No users found"}, 404
            return [marshal(user, user_fields) for user in users], 200

 
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        parser.add_argument('name', type=str)
        parser.add_argument('email', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('is_approved', type=bool)
        parser.add_argument('active', type=bool)  # Add active field
        args = parser.parse_args()

        if args.get('name'):
            user.name = args['name']
        if args.get('email'):
            user.email = args['email']
        if args.get('password'):
            user.password = hash_password(args['password'])  # Ensure passwords are hashed
        if args.get('is_approved') is not None:
            user.is_approved = args['is_approved']
        if args.get('active') is not None:
            user.active = args['active']  # Update active field

        try:
            db.session.commit()
            return {"message": "User updated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        if not user.active:
            return {"message": "User is already inactive"}, 400

        try:
            user.active = False  # Mark the user as inactive
            db.session.commit()
            return {"message": "User deactivated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500


# Add resource routes
api.add_resource(UserResource, '/users', '/users/<int:user_id>')

# --------------------  Api for Milestone  -----------------------------

class CustomDateField(fields.Raw):
    def format(self, value):
        if isinstance(value, datetime):
            return value.strftime('%d-%b-%Y')  # Format as DD-MMM-YYYY
        raise ValueError("Invalid datetime value")

milestone_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'start_date': CustomDateField(),
    'due_date': CustomDateField(),
    'project_id': fields.Integer,
    'created_at': fields.String,
    'last_edited_on': fields.String,
    'created_by': fields.String,
    'is_enabled': fields.Boolean
}

class MilestoneResource(Resource):
    def get(self, milestone_id=None):
        if milestone_id:
            milestone = Milestone.query.get(milestone_id)
            if not milestone:
                return {"message": "Milestone not found"}, 404
            return marshal(milestone, milestone_fields), 200
        else:
            milestones = Milestone.query.all()
            if not milestones:
                return {"message": "No Milestones Found"}, 404
            return [marshal(milestone, milestone_fields) for milestone in milestones], 200

    def post(self):
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('description', type=str)
        parser.add_argument('start_date', type=str)
        parser.add_argument('due_date', type=str)
        parser.add_argument('project_id', type=int, required=True, help='Project ID is required')
        parser.add_argument('created_by', type=str)
        parser.add_argument('is_enabled', type=bool, default=True)
        args = parser.parse_args()
        
        # Validate date format
        try:
            start_date = datetime.strptime(args['start_date'], '%Y-%m-%d') if args['start_date'] else None
            due_date = datetime.strptime(args['due_date'], '%Y-%m-%d') if args['due_date'] else None
        except ValueError:
            return {"error": "Invalid date format. Please use YYYY-MM-DD."}, 400

        # Ensure created_by is an integer (user ID)
        created_by = int(args.get('created_by')) if args.get('created_by') else None

        # Serialize milestone tasks to JSON if they exist
        # milestone_tasks = json.dumps(args.get('milestone_tasks', [])) if args.get('milestone_tasks') else None

        try:
            new_milestone = Milestone(
                name=args['name'],
                description=args.get('description', ''),
                start_date=start_date,
                due_date=due_date,
                # milestone_tasks=milestone_tasks,
                project_id=args['project_id'],
                created_at=datetime.now(IST),
                created_by=created_by,
                is_enabled=args.get('is_enabled', True)
            )
            db.session.add(new_milestone)
            db.session.commit()
            return {"message": "Milestone created successfully", "milestone_id": new_milestone.id}, 201
        except Exception as e:
            return {"error": str(e)}, 400

    def put(self, milestone_id):
        milestone = Milestone.query.get(milestone_id)
        if not milestone:
            return {"message": "Milestone not found"}, 404
        
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('start_date', type=str)
        parser.add_argument('due_date', type=str)
        args = parser.parse_args()
        
        # Validate date format
        try:
            if args.get('start_date'):
                milestone.start_date = datetime.strptime(args['start_date'], '%Y-%m-%d')
            if args.get('due_date'):
                milestone.due_date = datetime.strptime(args['due_date'], '%Y-%m-%d')
        except ValueError:
            return {"error": "Invalid date format. Please use YYYY-MM-DD."}, 400

        # Serialize milestone tasks to JSON if they exist
        # if args.get('milestone_tasks') is not None:
        #     milestone.milestone_tasks = json.dumps(args.get('milestone_tasks', []))
        if args.get('name'):
            milestone.name = args.get('name', milestone.name)
        if args.get('description'):
            milestone.description = args.get('description', milestone.description)
        milestone.last_edited_on = datetime.now(IST)
        
        try:
            db.session.commit()
            return {"message": "Milestone updated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, milestone_id):
        milestone = Milestone.query.get(milestone_id)
        if not milestone:
            return {"message": "Milestone not found"}, 404
        try:
            db.session.delete(milestone)
            db.session.commit()
            return {"message": "Milestone deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 400

# Add resource routes
api.add_resource(MilestoneResource, '/milestones', '/milestones/<int:milestone_id>')


#<------------------------------------------ API For Assigen Project and Revoke the project to Students------------------------------------------------------>#


#  fields for marshalling team data
team_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'project_id': fields.Integer,
    'github_url': fields.String,
    'created_at': fields.String,
    'students': fields.List(fields.Nested(user_fields))
}

#  parser for team creation
team_parser = reqparse.RequestParser()
team_parser.add_argument('project_id', type=int, required=True, help="Project ID is required")
team_parser.add_argument('name', type=str, required=True, help="Team name is required")
# team_parser.add_argument('user_ids', type=list, location='json', required=True, help="List of user IDs is required")

#  parser for revoking users from a team
revoke_parser = reqparse.RequestParser()
revoke_parser.add_argument('team_id', type=int, required=True, help="Team ID is required")
# revoke_parser.add_argument('user_ids', type=list, location='json', required=True, help="List of user IDs is required")


class ProjectTeamResource(Resource):
    @marshal_with(team_fields)
    def get(self, team_id=None):
        if team_id:
            team = Team.query.get(team_id)
            if not team:
                return {"error": "Team not found"}, 404
            # Include associated team details
            team_data = {
                'id': team.id,
                'name': team.name,
                'project_id': team.project_id,
                'created_at': team.created_at.isoformat() if team.created_at else None,
            }
            return marshal_with(team_fields)(team), 200
        else:
            teams = Team.query.all()
            if not teams:
                return {"message": "No teams found"}, 404
            # Optionally, serialize teams if needed
            teams_data = [
                {
                    'id': team.id,
                    'name': team.name,
                    'project_id': team.project_id,
                    'github_url': team.github_url,
                    'created_at': team.created_at.isoformat() if team.created_at else None,
                }
                for team in teams
            ]
            return teams_data, 200


    @marshal_with(team_fields)
    def post(self):
        """
        Assign project to users by creating a new team.
        """
        args = team_parser.parse_args()

        # Create a new team
        team = Team(
            name=args['name'],
            project_id=args['project_id'],
            created_at=datetime.now(IST)
        )
        db.session.add(team)
        # db.session.commit()

        # # Add users to the team
        # for user_id in args['user_ids']:
        #     db.session.execute(team_members.insert().values(team_id=team.id, user_id=user_id))
        db.session.commit()

        return team, 201
    
    def put(self, team_id):
        
        team = Team.query.get(team_id)
        if not team:
            return {"message": "Team not found"}, 404
        
        link = request.json.get('github_link')
        temp_link = link

        if link.startswith("https://github.com/"):        
            temp_link = temp_link.replace("https://github.com/", "")
            length = len(temp_link.split("/"))

            if length == 2:
                team.github_url = link

        try:
            db.session.commit()
            return {"message": "Team updated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, team_id):
        """
        Revoke users from a team or delete the team entirely.
        """
        team_id = int(team_id)

        team = Team.query.get(team_id)
        if not team:
            return {"message": "Team not found"}, 404

        # Get user IDs to revoke
        students = team.students

        for student in students:
            user_id = student.id
            db.session.execute(team_members.delete().where((team_members.c.team_id == team_id) & (team_members.c.user_id == user_id)))
            db.session.commit()

        # Revoke users from the team
        # for user_id in user_ids:
        #     db.session.execute(
        #         team_members.delete().where(
        #             (team_members.c.team_id == team_id) & (team_members.c.user_id == user_id)
        #         )
        #     )
        
        db.session.commit()

        # Check if the team is now empty
        remaining_members = db.session.execute(
            team_members.select().where(team_members.c.team_id == team_id)
        ).fetchall()

        if not remaining_members:
            # Delete the team if no members remain
            db.session.query(Team).filter_by(id=team_id).delete()
            db.session.commit()
            return {"message": "All users revoked, and the team has been deleted"}, 200

        return {"message": "Users revoked from the team successfully"}, 200


#  the resource route for team management
api.add_resource(ProjectTeamResource, '/teams', '/teams/<int:team_id>')


#------------------------API For Projects--------------------------------------------

# Define fields for marshaling
project_fields = {
    'id': fields.Integer,
    'description': fields.String,
    'instructor_id': fields.Integer,
    'created_at': fields.DateTime,
    'marks': fields.Integer,
    'project_subtitle': fields.String,
    'subject_id': fields.Integer,
    'last_edited_at': fields.DateTime,
    'is_enabled': fields.Boolean,
    'milestones': fields.List(fields.Nested(milestone_fields)),
    'teams': fields.List(fields.Nested(team_fields)),
    'instructor': fields.Nested(user_fields)
}

class ProjectCreate(Resource):
    @marshal_with(project_fields)
    def get(self, project_id=None):
        if project_id:
            project = Project.query.get(project_id)
            project.milestones = sorted(project.milestones, key=lambda x: (x.start_date, x.id))
            if not project:
                return {'message': 'Project not found'}, 404
            return project
        else:
            all_projects = Project.query.filter_by(is_enabled=1).all()
            for project in all_projects:
                project.milestones = sorted(project.milestones, key=lambda x: (x.start_date, x.id))
            return all_projects

    def post(self):
        args = project_parser.parse_args()

        # Create a new Project object
        new_project = Project(
            description=args['description'],
            instructor_id=args['instructor_id'],
            created_at=datetime.now(IST),
            last_edited_at=datetime.now(IST),
            marks=args.get('marks'),
            project_subtitle=args.get('project_subtitle'),
            subject_id=args.get('subject_id'),
            is_enabled=True
        )

        db.session.add(new_project)
        db.session.commit()

        return {'message': 'Project created successfully', 'project': marshal(new_project, project_fields)}, 201


class ProjectUpdate(Resource):
    def put(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {'message': 'Project not found'}, 404

        # Parse updated fields
        data = project_parser.parse_args()
        if data['description']:
            project.description = data['description']
        if data.get('marks') is not None:
            project.marks = data['marks']
        if data.get('project_subtitle'):
            project.project_subtitle = data['project_subtitle']
        if data.get('due_date') is not None:
            project.duedate = data['due_date']
        
        if data.get('is_enabled') is not None:
            project.is_enabled = data['is_enabled']

        # Update last edited timestamp
        project.last_edited_at = datetime.now(IST)

        db.session.commit()
        return {'message': 'Project updated successfully', 'project': marshal(project, project_fields)}, 200
    
class ProjectDisable(Resource):
    def delete(self, project_id):
        # Query the database for a specific project by its ID
        project = Project.query.get(project_id)
        
        if project is None:
            return {'message': 'Project not found'}, 404
        
        # Set the is_enabled field to False
        project.is_enabled = False
        
        # Commit the changes to the database
        db.session.commit()
        
        return {'message': f'Project with ID {project_id} has been disabled successfully'}, 200



api.add_resource(ProjectCreate, '/project','/project/<int:project_id>')
api.add_resource(ProjectUpdate, '/project/<int:project_id>')
api.add_resource(ProjectDisable, '/project/<int:project_id>')

#------------------API For team members-----------------------------------

# Define fields for marshaling the response
team_member_fields = {
    'team_member_name': fields.String,
    'team_name': fields.String,
    'project_name': fields.String,
}

class TeamMemberResource(Resource):
    @marshal_with(team_member_fields)
    def get(self, team_id=None):
        # If a team_id is provided, filter by team_id
        if team_id:
            # Query to get team member names, project names, and team names for the specified team_id
            results = (db.session.query(User.name.label("team_member_name"), Team.name.label("team_name"), 
                                       Project.project_name.label("project_name"))
                       .join(User.teams)  # Join `team_members`
                       .join(Team.project)  # Join Team to Project using `project` relationship
                       .filter(Team.id == team_id)  # Filter by team_id
                       .all()  # Fetch all results
            )
            
            # If no results, return a 404 error with a message
            if not results:
                return {"status_code": 404,"message": f"No team members found for team ID {team_id}"}, 404

        else:
            # If no team_id is provided, return all team members
            results = (db.session.query(User.name.label("team_member_name"), Team.name.label("team_name"), 
                                       Project.project_name.label("project_name"))
                       .join(User.teams)  # Join `team_members`
                       .join(Team.project)  # Join Team to Project using `project` relationship
                       .all()  # Fetch all results
            )

            # If no results, return a 404 error with a message
            if not results:
                return {"status_code": 404,"message": "No team members found"}, 404

        return results, 200  # The marshal_with decorator will handle formatting the response

# Add resource route for team members
api.add_resource(TeamMemberResource, '/team_members', '/team_members/<int:team_id>')


# --------------------  Api for Submission  -----------------------------

# Submission Fields
submission_fields = {
    'id': fields.Integer,
    'file_link': fields.String,
    'feedback': fields.String,
    'grade': fields.Integer,
    'submission_date': fields.String,
    'team_id': fields.Integer,
    'milestone_id': fields.Integer,
    'created_at': fields.String
}

# Parser for Submission
submission_parser = reqparse.RequestParser()
submission_parser.add_argument('file_link', type=str, required=False, help='File link is required')
submission_parser.add_argument('feedback', type=str, help='Feedback for the submission')
submission_parser.add_argument('grade', type=int, help='Grade for the submission')

class SubmissionResource(Resource):
    @marshal_with(submission_fields)
    def get(self, submission_id=None):
        if submission_id:
            submission = Submission.query.get(submission_id)
            if not submission:
                return {"message": "Submission not found"}, 404
            return submission
        else:
            submissions = Submission.query.all()
            if not submissions:
                return {"message": "No submissions found"}, 404
            return submissions
    '''
    def post(self, milestone_id, team_id):
        args = submission_parser.parse_args()

        # Check if the team and milestone exist
        team = Team.query.get(team_id)
        milestone = Milestone.query.get(milestone_id)
        
        if not team:
            return {"message": "Team not found"}, 404
        if not milestone:
            return {"message": "Milestone not found"}, 404

        # Create new submission object
        new_submission = Submission(
            file_link=args['file_link'],
            feedback=args.get('feedback'), 
            grade=args.get('grade'),
            team_id=team_id, # current_user.team_id
            milestone_id=milestone_id, # 
            submission_date=datetime.now(IST),
            created_at=datetime.now(IST)
        )

        try:
            db.session.add(new_submission)
            db.session.commit()
            return {"message": "Submission created successfully", "submission": marshal(new_submission, submission_fields)}, 201
        except Exception as e:
            return {"error": str(e)}, 400 '''

    def put(self, milestone_id):
        # Find the existing submission by team_id and milestone_id
        # submission = Submission.query.filter_by(team_id=team_id, milestone_id=milestone_id).first()
        submission = Submission.query.get(milestone_id)

        if not submission:
            return {"message": "Submission not found"}, 404

        args = submission_parser.parse_args()

        # Update the feedback and grade if provided
        if args.get('feedback') is not None:
            submission.feedback = args['feedback']
        if args.get('grade') is not None:
            submission.grade = args['grade']

        try:
            db.session.commit()
            return {"message": "Submission updated successfully", "submission": marshal(submission, submission_fields)}, 200
        except Exception as e:
            return {"error": str(e)}, 400
        
    @jwt_required()
    def post(self, milestone_id):
        # Parse request args
        args = submission_parser.parse_args()
        file_link = args['file_link']
        feedback = args.get('feedback')
        grade = args.get('grade')
        # Get the current user ID
        user_id = get_jwt_identity() 
        # Find the milestone based on the milestone_id from the URL
        milestone = Milestone.query.get(milestone_id)
        if not milestone:
            return {"message": "Milestone not found"}, 404
        # Query for the team ID based on the current user and the milestone's project_id
        team = (db.session.query(Team)
                .join(team_members)
                .filter(team_members.c.user_id == user_id, Team.project_id == milestone.project_id)
                .first())
        if not team:
            return {"message": "No team found for the current user in the specified project"}, 404
        # Create a new submission for the found team and milestone
        submission = Submission(
            team_id=team.id,           
            milestone_id=milestone_id, 
            file_link=file_link,
            feedback=feedback,
            grade=grade,
            submission_date=datetime.now(IST),
            created_at=datetime.now(IST)
        )

        try:
            # Add the new submission to the database and commit
            db.session.add(submission)
            db.session.commit()
        except Exception as e:
            return {"error": str(e)}, 400

        return marshal(submission, submission_fields), 201

# api.add_resource(SubmissionResource, '/submissions/<int:milestone_id>/<int:team_id>', '/submissions/<int:milestone_id>', '/submissions/<int:submission_id>','/submissions')
api.add_resource(
    SubmissionResource, 
    '/submissions/<int:milestone_id>',   #  POST AND PUT by milestone_id
    '/submissions'                       # GET all submissions
)


#------------------API for Notification--------------------------------------
notification_fields = {
    'id': fields.Integer,
    'notification_title': fields.String,
    'notification_details': fields.String,
    'notification_creation_date': fields.String,
    'created_on': fields.String,
    'last_edited_on': fields.String,
    'created_by': fields.String,
    'is_enabled': fields.Boolean,

}
# Define a separate parser for notifications
notification_parser = reqparse.RequestParser()
notification_parser.add_argument('notification_title', type=str, required=True, help="Notification title is required")
notification_parser.add_argument('notification_details', type=str, required=True, help="Notification details are required")
notification_parser.add_argument('notification_creation_date', type=str, help="Creation date in YYYY-MM-DD format")
notification_parser.add_argument('created_by', type=str, required=True, help="Created by user is required")
notification_parser.add_argument('is_enabled', type=bool, default=True)

class NotificationResource(Resource):
    @marshal_with(notification_fields)
    def get(self, notification_id=None):
        if notification_id:
            notification = Notification.query.get(notification_id)
            if not notification:
                return {"error": "Notification not found"}, 404
            return notification, 200
        else:
            notifications = Notification.query.all()
            if not notifications:
                return {'message': "No notifications found"}, 404
            return notifications, 200

    def post(self):
        # Use the notification-specific parser
        args = notification_parser.parse_args()
        
        # Parse creation date
        try:
            creation_date = datetime.strptime(args['notification_creation_date'], '%Y-%m-%d') if args['notification_creation_date'] else datetime.now(IST)
        except ValueError:
            return {'error': "Invalid date format. Use YYYY-MM-DD."}, 400

        # Create a new notification
        new_notification = Notification(
            notification_title=args['notification_title'],
            notification_details=args['notification_details'],
            notification_creation_date=creation_date,
            created_by=args['created_by'],
            is_enabled=args.get('is_enabled', True),
        )
        db.session.add(new_notification)
        db.session.commit()
        return {"message": "Notification created successfully", "notification_id": new_notification.id}, 201

    def put(self, notification_id):
        notification = Notification.query.get(notification_id)
        if not notification:
            return {"error": "Notification not found"}, 404

        # Use the notification-specific parser
        args = notification_parser.parse_args()

        # Update fields
        notification.notification_title = args['notification_title'] or notification.notification_title
        notification.notification_details = args['notification_details'] or notification.notification_details
        notification.last_edited_on = datetime.now(IST)
        notification.created_by = args['created_by'] or notification.created_by
        notification.is_enabled = args.get('is_enabled', notification.is_enabled)

        db.session.commit()
        return {"message": "Notification updated successfully"}, 200

    def delete(self, notification_id):
        notification = Notification.query.get(notification_id)
        if not notification:
            return {"error": "Notification not found"}, 404

        db.session.delete(notification)
        db.session.commit()
        return {"message": "Notification deleted successfully"}, 200

# Add the resource route for notifications
api.add_resource(NotificationResource, '/notifications/<int:notification_id>', '/notifications')


# <-----------------------------------------Git API-------------------------------------------->
gpt_parser = reqparse.RequestParser()
class GitHubCommitsResource(Resource):
    def get(self, team_id):

        team = Team.query.get(team_id)
        url=team.github_url

        url = url.replace("https://github.com/","")
        repo_owner = url.split("/")[0]
        repo_name = url.split("/")[1]

        # repo_owner = "HarshitPaunikarIITM"
        # repo_name = "soft-engg-project-sep-2024-se-sep-19"

        branch_name = "main"
        github_token = "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"

        url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits?sha={branch_name}&per_page=100&page=1"
        headers = {
            "Authorization": f"token {github_token}",
            "User-Agent": "GitHub-Commit-Fetcher",
        }

        try:
            # Create a request object with headers
            request = urllib.request.Request(url, headers=headers)
            
            # Make the HTTP GET request
            with urllib.request.urlopen(request) as response:
                data = response.read()
                commits = json.loads(data)
                
                # Parse the response to create a list of commits
                commit_list = [
                    {
                        "message": commit["commit"]["message"],
                        "author": commit["commit"]["author"]["name"],
                        "date": commit["commit"]["author"]["date"],
                        "url": commit["html_url"]
                    }
                    for commit in commits
                ]
                return {"commits": commit_list}, 200
        
        except urllib.error.HTTPError as e:
            return {"error": f"HTTP Error: {e.code}, {e.reason}"}, e.code
        except urllib.error.URLError as e:
            return {"error": f"URL Error: {e.reason}"}, 500
        except Exception as e:
            return {"error": str(e)}, 500

# Add the new resource to the API
api.add_resource(GitHubCommitsResource, '/github/commits/<int:team_id>')


# <----------------------- Gen Ai API ----------------------------->

OPENAI_API_KEY = 

class ChatGPTResource(Resource):
    def post(self):
        # Parse the query from the request body
        gpt_parser.add_argument('query', type=str, required=True, help="The 'query' field is required")
        args = gpt_parser.parse_args()
        query = args['query']

        # Prepare the payload for OpenAI API
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": query}]
        }
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            # Use http.client to make the POST request
            conn = http.client.HTTPSConnection("api.openai.com")
            conn.request("POST", "/v1/chat/completions", body=json.dumps(payload), headers=headers)
            
            # Get the response
            response = conn.getresponse()
            if response.status != 200:
                return {"error": f"OpenAI API error: {response.status}, {response.reason}"}, response.status

            # Parse the response
            response_data = json.loads(response.read().decode())
            chat_response = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')

            return {"response": chat_response}, 200

        except Exception as e:
            return {"error": str(e)}, 500

# Add the new resource to the API
api.add_resource(ChatGPTResource, '/chatgpt')



class GetProjectDetailsAdminDashboard(Resource):
    def get(self):
        try:
            projects = Project.query.all()
            if not projects:
                return {"message": "No projects found"}, 404

            project_details = []
            for project in projects:
                project_details.append({
                    "id": project.id,
                    "description": project.description,
                    "instructor_id": project.instructor_id,
                    "created_at": project.created_at.strftime('%Y-%m-%d %H:%M:%S') if project.created_at else None,
                    "marks": project.marks,
                    "project_subtitle": project.project_subtitle,
                    "subject_id": project.subject_id,
                    "last_edited_at": project.last_edited_at.strftime('%Y-%m-%d %H:%M:%S') if project.last_edited_at else None,
                    "is_enabled": project.is_enabled,
                    "duedate": project.duedate
                })

            return {"projects": project_details}, 200
        except Exception as e:
            return {"error": str(e)}, 500

# Add the new resource to the API
api.add_resource(GetProjectDetailsAdminDashboard, '/get_projectdetailsadmindashboard')
# http://127.0.0.1:5000/api/get_projectdetailsadmindashboard


class UpdateProjectActivation(Resource):
    def post(self):
        try:
            # Parse request JSON
            data = request.get_json()
            project_id = data.get('project_id')
            is_enabled = data.get('is_enabled')

            if project_id is None or is_enabled is None:
                return {"message": "project_id and is_enabled are required"}, 400

            # Fetch the project by ID
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404

            # Update the is_enabled status
            project.is_enabled = is_enabled
            project.last_edited_at = datetime.now()

            # Commit changes
            db.session.commit()

            return {"message": f"Project {'activated' if is_enabled else 'deactivated'} successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500

# Add the new resource to the API
api.add_resource(UpdateProjectActivation, '/post_projectdetailsadmindashboardactivatedeactivate')



# POST API to update "is_approved" and "active"
class UpdateUserApprovalAndActivation(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True, help="User ID is required")
        parser.add_argument('is_approved', type=bool, required=False, help="Set to true/false to approve/disapprove user")
        parser.add_argument('active', type=bool, required=False, help="Set to true/false to activate/deactivate user")
        args = parser.parse_args()

        user = User.query.get(args['user_id'])
        if not user:
            return {"message": "User not found"}, 404

        # Update only the relevant field based on the payload
        if args.get('is_approved') is not None:
            user.is_approved = args['is_approved']
        if args.get('active') is not None:
            user.active = args['active']

        try:
            db.session.commit()
            message = "User updated successfully"
            if args.get('is_approved') is not None:
                message = f"User approval status changed to {'approved' if user.is_approved else 'not approved'}."
            if args.get('active') is not None:
                message = f"User activation status changed to {'active' if user.active else 'inactive'}."
            return {"message": message}, 200
        except Exception as e:
            return {"error": str(e)}, 400

        
api.add_resource(UpdateUserApprovalAndActivation, '/post_usersdetailadminactivatedeactivate')        


class GetUserEmails(Resource):
    def get(self):
        # Fetch user data from the database including id, email, is_approved, and active
        users = User.query.with_entities(User.id, User.email, User.is_approved, User.active).all()
        if not users:
            return {"message": "No users found"}, 404
        
        # Return user data as a list of dictionaries
        return jsonify({
            "users": [
                {
                    "id": user.id,
                    "email": user.email,
                    "is_approved": user.is_approved,
                    "active": user.active
                } for user in users
            ]
        })

# Register the API route
api.add_resource(GetUserEmails, '/get_usersdetailadmin')


class assignStudent(Resource):
    def post(self):
        try:
            # Parse request JSON
            data = request.get_json()
            project_id = data.get('project_id')
            team_id = data.get('team_id')
            student_id = data.get('student_id')

            if project_id is None or student_id is None:
                return {"message": "project_id and student_id are required"}, 400

            # Fetch the project by ID
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404

            # Fetch the student by ID
            student = User.query.get(student_id)
            if not student:
                return {"message": "Student not found"}, 404

            # Add the student to the project
            db.session.execute(team_members.insert().values(team_id=team_id, user_id=student_id))
            db.session.commit()

            return {"message": "Student assigned to project successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
    def delete(self):
        try:
            # Parse request JSON
            data = request.get_json()
            project_id = data.get('project_id')
            student_id = data.get('student_id')
            team_id = data.get('team_id')

            if project_id is None or student_id is None:
                return {"message": "project_id and student_id are required"}, 400

            # Fetch the project by ID
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404

            # Fetch the student by ID
            student = User.query.get(student_id)
            if not student:
                return {"message": "Student not found"}, 404

            # Remove the student from the project
            db.session.execute(team_members.delete().where((team_members.c.user_id == student_id) & (team_members.c.team_id == team_id)))
            db.session.commit()

            return {"message": "Student removed from project successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
api.add_resource(assignStudent, '/assignstudent')


from sqlalchemy.sql import text

class GetAllDataForSearch(Resource):
    def get(self):
        try:
            # Execute the SQL query using text()
            query = text("""
            SELECT 
                GROUP_CONCAT(
                    p.project_subtitle || ' - projects - description - ' || COALESCE(p.description, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - projects - created_at - ' || COALESCE(p.created_at, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - projects - marks - ' || COALESCE(p.marks, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - projects - last_edited_at - ' || COALESCE(p.last_edited_at, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - projects - is_enabled - ' || COALESCE(p.is_enabled, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - projects - duedate - ' || COALESCE(p.duedate, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - milestones - name - ' || COALESCE(m.name, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - milestones - description - ' || COALESCE(m.description, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - milestones - start_date - ' || COALESCE(m.start_date, 'NULL') || ' , ' ||
                    p.project_subtitle || ' - milestones - due_date - ' || COALESCE(m.due_date, 'NULL')
                ) AS formatted_output
            FROM projects p
            LEFT JOIN milestones m ON p.id = m.project_id;
            """)

            result = db.session.execute(query)
            data = result.scalar()

            if not data:
                return {"message": "No data found"}, 404
            
            return {"formatted_output": data}, 200

        except Exception as e:
            return {"error": str(e)}, 500

# Add the new resource to the API
api.add_resource(GetAllDataForSearch, '/get_alldataforsearch')
