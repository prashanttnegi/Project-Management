import github from "./github.js";
import assignStudents from "./assignStudents.js"

export default {
  data() {
    return {
        message: null,        
        team_id: null,
        team: null,
        project_id: null,
        students: [],
        githubLink: null,
        entry:{
            grade: null,
            feedback: null,
            status: 'submit'
        },
        milestones: null,
        filteredMilestones: [], // Variable to store filtered milestones
        matchedSubmissions: [], // Variable to store matched submissions
    };
  },
  computed: {},
  async mounted() {
    this.team_id = this.$route.params.team_id;
    this.project_id = this.$route.params.project_id
    this.view_team(this.team_id)
    console.log(this.team)

    const res = await fetch(`/api/milestones`, {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json();
    this.milestones = data;
    console.log("All Milestones: ", this.milestones);

    await this.view_team(this.team_id);

    // Filter milestones based on the project ID from the team variable
    if (this.team && this.team.project_id) {
      this.filteredMilestones = this.milestones.filter(
        (milestone) => milestone.project_id === this.team.project_id
      );
      console.log("Filtered Milestones: ", this.filteredMilestones);
    }

    // Check submissions for filtered milestones
    await this.check_submissions(this.filteredMilestones, this.team);
  },
  template: `
    <div class="container text-center main-body">
        <div class="col-md-12 child inline-block-child">
            <div class="container">
                <div class="row" v-if="team">
                    <!-- First Box -->
                    <div class="col-lg-6 col-md-4 col-sm-6 mb-4">
                        <div class="card h-100">
                            <div class="card-body" style="text-align: center;">
                                <h5 class="card-title">{{team.name}}</h5>
                                <hr>
                                <ul v-if="students && students.length > 0" style="list-style-type: none; padding: 0;">
                                    <li v-for="student in students" :key="student.id" class="team-member">
                                        <div class="team-member-container" style="display: flex; justify-content: space-between; align-items: center;">
                                            <span class="member-info" style="text-align: left;">
                                                <span class="member-name">{{ student.name }}</span>
                                                <span class="member-role">{{ student.email }}</span>
                                            </span>
                                            <button @click="unassign(student.id)" class="view-button"> Unassign </button>
                                        </div>
                                    </li>
                                </ul>
                                <div v-else>
                                    <p>No students assigned to this team.</p>
                                </div>
                                <button @click="openPopupAssign()" class="btn btn-primary">Assign Students</button>
                            </div>
                        </div>
                    </div>
                    <!-- Second Box -->
                    <div class="col-lg-6 col-md-4 col-sm-6 mb-4">
                        <div class="card h-100">
                            <div class="card-body" style="text-align: center;">
                                <h5 class="card-title">Submissions</h5>
                                <hr />
                                <ul v-if="matchedSubmissions.length > 0" style="list-style-type: none; padding: 0;">
                                  <li
                                    v-for="(submission, index) in matchedSubmissions"
                                    :key="submission.id"
                                    class="milestone-item"
                                    style="margin-bottom: 15px;"
                                  >
                                    <div
                                      class="milestone-container"
                                      style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;"
                                    >
                                      <!-- Milestone name and submission date -->
                                            <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px;">
                                                <span class="milestone-name" style="font-weight: bold;">
                                                    {{ submission.milestone_name }}
                                                </span>
                                                <span class="submission-date" style="font-style: italic; color: #555;">
                                                    Submitted on: {{ formatDate(submission.created_at) }}
                                                </span>
                                            </div>
                                
                                            <!-- Submission Link -->
                                            <span class="milestone-info" style="text-align: left; margin-bottom: 8px;">
                                                <strong>Submission Link:</strong>
                                                <div style="display: flex; justify-content: space-between; width: 100%;">
                                                    <button
                                                      @click="copySubmissionLink(submission.file_link)"
                                                      style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;"
                                                    >
                                                        Copy URL
                                                    </button>
                                                </div>
                                            </span>
                                
                                            <!-- Grade and Feedback Section -->
                                            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; align-items: center; gap: 20px;">
                                                <!-- Display Grade and Feedback -->
                                                <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start;">
                                                    <span><strong>Grade:</strong> {{ submission.grade || 'No Grade' }}</span>
                                                    <span><strong>Feedback:</strong> {{ submission.feedback || 'No Feedback' }}</span>
                                                </div>
                                
                                                <!-- Input for Grade and Feedback -->
                                                <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                                                    <input 
                                                        type="number" 
                                                        v-model.number="submission.grade" 
                                                        :disabled="!submission.isEditing" 
                                                        placeholder="Enter Grade" 
                                                        @input="validateGrade(submission)" 
                                                        style="padding: 5px; border: 1px solid #ccc; border-radius: 4px;" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        v-model="submission.feedback" 
                                                        :disabled="!submission.isEditing" 
                                                        placeholder="Enter Feedback" 
                                                        style="padding: 5px; border: 1px solid #ccc; border-radius: 4px;" 
                                                    />
                                                </div>
                                
                                                <!-- Buttons for editing and submitting -->
                                                <div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 10px;">
                                                    <button 
                                                        v-if="!submission.isEditing" 
                                                        @click="enableEditing(submission)" 
                                                        class="edit-button" 
                                                        style="padding: 5px 10px; background-color: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                                        Edit
                                                    </button>
                                                    <button 
                                                        v-if="submission.isEditing" 
                                                        @click="submitMarksAndFeedback(submission, submission.grade, submission.feedback)" 
                                                        class="submit-button" 
                                                        style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                
                                            <!-- Divider -->
                                            <hr style="margin: 10px 0; border-top: 1px solid #ddd;" />
                                        </div>
                                    </li>
                                </ul>
                            
                                <p v-else style="color: #555; font-style: italic;">No submissions available for this team.</p>
                                <!-- Average Marks -->
                                <div style="margin-top: 20px; font-weight: bold; font-size: 16px; text-align: center;">
                                    Average Marks: {{ calculateAverageMarks() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div class="row">
                    <github v-if="team && team.github_url"></github>
                    <div v-else>
                        <form @submit.prevent="addGithubLink">
                            <h5>Add GitHub Link</h5>
                            <br>
                            <div class="mb-3" v-if="message" style="color:red;">{{ message }}</div>
                            <div class="mb-3">
                                <label for="githubLink" class="form-label">Github Link</label>
                                <input type="text" class="form-control" id="githubLink" v-model="githubLink">
                            </div>
                            <button type="submit" class="btn btn-primary">Add</button>
                        </form>
                    </div>
                </div>
            </div>
            <assignStudents ref="child" @callFetch="view_team(team_id)"></assignStudents>
        </div>
    </div>

    `,
  components: {
    github,
    assignStudents
  },
  methods: {
    calculateAverageMarks() {
        const totalMarks = this.matchedSubmissions
          .filter((submission) => submission.grade !== null && submission.grade !== undefined)
          .reduce((sum, submission) => sum + parseFloat(submission.grade || 0), 0);
    
        const validSubmissions = this.matchedSubmissions.filter(
          (submission) => submission.grade !== null && submission.grade !== undefined
        ).length;
    
        return validSubmissions > 0 ? (totalMarks / validSubmissions).toFixed(2) : "No Marks Yet";
      },
    enableEditing(submission) {
        // Set editing to true
        submission.isEditing = true;

      },
    
      async submitMarksAndFeedback(submission, grade, feedback) {
        if (grade > 100 || grade < 0) {
            alert("Grade must be between 0 and 100!");
            return;
          }
        try {
          // Submit the grade and feedback
          const res = await fetch(`/api/submissions/${submission.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({
              grade: grade,
              feedback: feedback,
            }),
          });
    
          if (res.ok) {
            alert("Grade and Feedback Updated!");
    
            // Fetch the updated submissions
            const submissionsRes = await fetch(`/api/submissions`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
              },
            });
    
            const data = await submissionsRes.json();
            console.log(data)
            if (submissionsRes.ok) {
              // Match and update the current submission in the matchedSubmissions array
              this.matchedSubmissions = this.matchedSubmissions.map((current) => {
                const updatedSubmission = data.find(
                  (sub) =>
                    sub.milestone_id === current.milestone_id &&
                    sub.team_id === current.team_id
                );
    
                if (updatedSubmission) {
                  return {
                    ...current,
                    isEditing: false, // Disable editing after submission
                  };
                }
                return current;
              });
            } else {
              console.error("Error fetching updated submissions:", data.message);
            }
          } else {
            const errorData = await res.json();
            console.error("Error submitting grade and feedback:", errorData.message);
          }
        } catch (error) {
          console.error("Error while submitting feedback:", error);
        }
      },
    async view_team(team_id) {
      const res = await fetch(`/api/teams/${team_id}`, {
        method: "GET",
        headers: {
          "X-Request-Source": "all",
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      console.log("Team Data: ", data);
      this.team = data;
      this.students = data.students;
    },
    openPopupAssign() {
        this.$refs.child.showPopup();
    },
    closePopupAssign() {
        this.$refs.child.closePopup();
    },
    async unassign(student_id) {
        try {
            const response = await fetch(`/api/assignstudent`, {
                method: 'DELETE',
                headers: {
                    'X-Request-Source': 'all',
                    "Authentication-Token": this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'project_id': this.project_id,
                    'team_id': this.team_id,
                    'student_id': student_id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                this.message = "Student unassigned successfully";
                this.view_team(this.team_id);
                alert(this.message);
                this.$refs.child.closePopup();
            } else if (response.status === 400) {
                this.message = "Wrong data inputs!";
                alert(this.message);
            } else {
                this.message = "Failed to unassign student";
                alert(this.message);
            }
        } catch (error) {
            console.error(error);
        }
    },
    async check_submissions(stud_milestones,team) {
        const res = await fetch(`/api/submissions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
          },
        });
      
        const data = await res.json();
        if (res.ok) {
          console.log("All submissions", data);
      
          // Match submissions with milestone IDs
          // Filter submissions by milestones and team.id
          const submissionsForMilestones = data.filter(
            (submission) =>
              stud_milestones.some((milestone) => milestone.id === submission.milestone_id) &&
              submission.team_id === team.id // Ensure the team ID matches
          );
      
          // Find the latest submission for each milestone
          const latestSubmissions = submissionsForMilestones.reduce((acc, submission) => {
            const existing = acc.find((item) => item.milestone_id === submission.milestone_id);
            if (!existing || new Date(submission.created_at) > new Date(existing.created_at)) {
              acc = acc.filter((item) => item.milestone_id !== submission.milestone_id); // Remove older entry if exists
              acc.push(submission); // Add the latest one
            }
            return acc;
          }, []);
      
          // Add milestone name and store submission IDs
          this.matchedSubmissions = latestSubmissions.map((submission) => {
            const milestone = stud_milestones.find(
              (milestone) => milestone.id === submission.milestone_id
            );
      
            if (milestone) {
              submission.milestone_name = milestone.name; // Add the milestone name to submission
            }
      
            
            submission.isEditing = false; // By default, editing is disabled
      
            return submission;
          });
      
          console.log("Latest Submissions with Milestone Names and Grades: ", this.matchedSubmissions);
        }
      },      
    // Method to format date as DD Month YYYY
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    },
    
      // Method to copy the submission URL to clipboard
    copySubmissionLink(url) {
        // Strip the domain (e.g., "http://127.0.0.1:5000/") from the URL
        const strippedUrl = url.replace("http://127.0.0.1:5000/", "");
        
        // Use the Clipboard API to copy the URL
        navigator.clipboard.writeText(strippedUrl).then(() => {
          alert('Submission URL copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    },
    async addGithubLink() {
        try {
            const response = await fetch(`/api/teams/${this.team_id}`, {
                method: 'PUT',
                headers: {
                    'X-Request-Source': 'all',
                    "Authentication-Token": this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    github_link: this.githubLink,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                this.message = "Github link added successfully";
                this.view_team(this.team_id);
                alert(this.message);
                this.$refs.child.closePopup();
            } else if (response.status === 400) {
                this.message = "Wrong data inputs!";
                alert(this.message);
            } else {
                this.message = "Failed to add github link";
                alert(this.message);
            }
        } catch (error) {
            console.error(error);
        }
    },
      
  }
};
