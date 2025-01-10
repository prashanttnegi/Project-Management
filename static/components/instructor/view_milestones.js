import editMilestone from "./editMilestone.js";

export default {
    template:` <!-- ------------------View milestone pop up------------------------ -->

<div v-if="popupVisible" id="milestonepopup" class="milestone_popup">
<span style="float: right; margin: 7px; border: 3px solid red; padding: 5px; 
             border-radius: 50px; width: 50px; text-align: center; 
             font-weight: 700; font-size: 22px; color: grey; cursor: pointer;"
            @click="closePopup"   > X </span><br>

<!--
  <span style="float: right;
                    margin: 7px;
                    border: 3px solid red;
                    padding: 5px;
                    border-radius: 50px;
                    width: 50px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 22px;
                    color: grey; cursor: pointer;" onclick="var element = document.getElementById('milestonepopup'); 
                            element.style.display = (element.style.display === 'none' ? 'block' : 'none');">
    X
  </span> -->


  <div class="container mt-10">
  
    <h3>Milestone: {{milestone.name}} </h3><br>

    <div class="row"> 
      <div class="col-md-6">
        <div class="row">
          <div class="mb-3">
            <span> Start Date : {{milestone.start_date}} </span>
          </div>
        </div>

        <div class="row">
          <div class="mb-3">
            <span> Due Date : {{milestone.due_date}} </span>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="row">
          <div class="mb-3">
            Milestone Description : <br>
            <span> {{milestone.description}} </span>
          </div>
        </div>
      </div>
    </div>

    <hr class="section-separator">
      
      <div class="row" v-if="userType == 'student'">
        <div v-if="!isSubmitted" class="col-md-12">
          <div class="mb-3">
            <h6 style="margin-bottom:20px;">Submit Milestone</h6>
            <!-- Button to Submit the Milestone -->
            <form id="projectForm" @submit.prevent="submit_milestone_link(milestone.id)">
              <input type="text" v-model="submission.file_link" name="submission_link" class="form-control" placeholder="Enter the link to your submission file" required/><br>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>

      <div class="row" v-if="userType == 'student'">
        <div v-if="isSubmitted" class="col-md-12" >
          <h5 style="margin-bottom:20px;">Assessment</h5>
          <div v-if="graded" class="mb-3">            
            <span> Submission Marks Received : {{submission_grade}} </span>
          </div>
          <div v-if="!graded" class="mb-3">            
            <span> Submission Marks Received : Not graded yet. </span>
          </div>
        </div>
      </div>

      <div class="row" v-if="userType == 'student'">
        <div v-if="isSubmitted" class="col-md-12" >
          <div v-if="feedback_recd" class="mb-3">            
            <span> Instructor Feedback : {{submission_feedback}} </span>
          </div>
          <div v-if="!feedback_recd" class="mb-3">            
            <span> Instructor Feedback : No feedback received yet. </span>
          </div>
        </div>
      </div>

      <div class="row" v-if="userType == 'instructor' || userType == 'admin'"><br>
        <div class="col-md-6">
          <div class="mb-3">
            <button class="btn btn-warning" @click="showPopupEdit(milestone.id)">Edit</button>
          </div>
          <div class="mb-3">
            <button class="btn btn-danger" id="deleteButton" data-bs-toggle="modal" :data-bs-target="'#confirmationModal' + milestone.id">Delete</button>
          </div>
          <div class="modal fade" :id="'confirmationModal' + milestone.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index: 10000;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this item?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteMilestone(milestone.id)" data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <editMilestone ref="child" :userType="userType" :milestone="milestone"/>
    </div>
</div>
`,
props: {
  userType: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  milestone: {
    type: Object,
    default: () => null, 
  },
},
data() {
  return {
    popupVisible: this.visible,  
    message: '',
    submission: { file_link: '' },
    role: localStorage.getItem('role'),
    token: localStorage.getItem('auth-token'),
    submission_grade : null,
    submission_feedback: null,
    isSubmitted: false
  }
},
async mounted() {
  if (this.milestone && this.milestone.id && this.userType == 'student') {
    await this.show_score(this.milestone.id);
  }
},
computed: {
  graded() {
    return this.submission_grade != null ;
  },
  feedback_recd() {
    return this.submission_feedback != null ;
  }
},
watch: {
  visible(newVal) {
    this.popupVisible = newVal; 
  },
  milestone: {
    immediate: true, // Trigger this immediately on mount
    handler(newMilestone) {
      if (newMilestone && newMilestone.id) {
        this.show_score(newMilestone.id);
      }
    },
  },
},
components: {
  editMilestone
},
methods:{
    showPopup() {
        this.popupVisible = true;
    },
    closePopup() {
      this.$emit('close-popup'); 
      this.$emit('callFetch4');
      this.message = '';
  },
    async show_score(milestone_id){
      const res = await fetch(`/show_score/${milestone_id}`, {
        method: 'GET',
        headers: {
          'Role': this.role,
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const data = await res.json();
        this.isSubmitted=true;
        this.submission_grade = data.grade;
        this.submission_feedback = data.feedback;
      } else if (res.status === 404) {
        this.isSubmitted=false;
        this.submission_grade = null;
        this.submission_feedback = null;
      }},
    async submit_milestone_link(milestone_id) {
    const res = await fetch(`/api/submissions/${milestone_id}`, {
      method: 'POST',
      headers: {
        'Role': this.role,
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.submission),
    })
    console.log(this.submission)
    const data = await res.json()
    if (res.ok) {
      alert(data.message || 'Milestone link submitted')
    }
  },
  showPopupEdit(milestone_id) {
    this.$refs.child.showPopup(milestone_id);
  },
  closePopupEdit() {
    this.$refs.child.closePopup();
  },
  async deleteMilestone(milestone_id) {
    try{
      const res = await fetch(`/api/milestones/${milestone_id}`, {
        method: 'DELETE',
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Milestone deleted successfully')
        this.closePopup();
      }else{
        alert(data.message || 'Milestone not deleted')
      }
    }catch(error){
      console.log('Error:', error)
    }
  }
}
}
