from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Junction table for many-to-many relationship between students and teams
team_members = Table(
    'team_members', db.metadata,
    Column('team_id', Integer, ForeignKey('teams.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), ForeignKey('users.id'))
    role_id = Column(Integer(), ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('all_users'))


class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True)
    description = Column(String(255))

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(Text)
    instructor_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime)
    marks = Column(Integer, default=None)
    project_subtitle = Column(String, nullable=True)
    subject_id = Column(Integer, nullable=True)
    last_edited_at = Column(DateTime, nullable=True)
    is_enabled = Column(Boolean, default=True)
    duedate = Column(String)

    # Relationships
    instructor = relationship('User', backref='projects', lazy=False)
    milestones = relationship('Milestone', backref='project', lazy=False)
    teams = relationship('Team', backref='project')

class Team(db.Model):
    __tablename__ = 'teams'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey('projects.id'))
    github_url = Column(String, nullable=True)
    created_at = Column(DateTime)

    # Relationships
    students = relationship('User', secondary='team_members', backref=db.backref('all_teams', lazy=False), lazy=False)

class Milestone(db.Model):
    __tablename__ = 'milestones'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, nullable=True)       # New field added
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey('projects.id'))
    created_at = Column(DateTime)
    last_edited_on = Column(DateTime, nullable=True)
    created_by = Column(Integer, nullable=True)
    is_enabled = Column(Boolean, default=True)

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    file_link = Column(String, nullable=False)
    feedback = Column(Text, nullable=True)
    grade = Column(Integer, nullable=True)
    submission_date = Column(DateTime, nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'))
    milestone_id = Column(Integer, ForeignKey('milestones.id'))
    created_at = Column(DateTime)

    # Relationships
    team = relationship('Team', backref='submissions')
    milestone = relationship('Milestone', backref='submissions')

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    notification_title = Column(String, nullable=False)
    notification_details = Column(Text)
    notification_creation_date = Column(DateTime)
    created_on = Column(DateTime)
    last_edited_on = Column(DateTime, nullable=True)
    created_by = Column(Integer, nullable=True)
    is_enabled = Column(Boolean, default=True)

class Github_url(db.Model):
    __tablename__ = 'github_url'

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer, ForeignKey('teams.id'))
    github_url = Column(String)