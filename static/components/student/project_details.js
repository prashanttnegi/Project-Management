import teams from "../instructor/teams.js";
import view_milestones from "../instructor/view_milestones.js"
import addMilestone from "../admin/addMilestone.js";

export default {
    template:`
<div class='container text-left main-body' >
    <div class="col-md-12 child inline-block-child">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0"><u>Project Title:</u> {{project_subtitle}} </h2>
                <h3 class="mb-0"><u>Project Marks:</u> {{marks}}</h3> 
            </div><br>
                  <br>
            <div>
                <h4> <u>Project Description </u></h4><br>
                <div> {{description}} </div><br>
                <button class="btn btn-primary" @click="downloadResource(project_id)">Get PDF</button> <!--download/redirect to project_doc_link-->
            </div><br>

            <div v-if="role == 'instructor' || role == 'admin'">
                <button class="btn btn-primary" @click="showPopupTeams(project_id)">Teams</button>
            </div><br>

        </div>
        <div> 
            <h4>
                <u> Milestones </u>
                <span v-if="role == 'instructor' || role == 'admin'">
                    <img src="/static/images/addicon.png" style="width: 66px; opacity: 48%;" @click="showPopupAddMilestone(project_id)" />
                </span>
                <div v-else>
                    <br>
                </div>
            </h4> 
            <div class="row" v-if="milestones.length > 0" style="margin-top: -25px;">
                <div class="col-md-6" v-for="(milestone,index) in milestones" style="margin-top: 25px;">
                    <div class="card h-100">
                        <div class="card-body" style="background-color: white;">
                            <div style="text-align: center;">
                                <span style="font-size: 20px; font-weight: 600; color: grey;">Milestone {{index+1}}</span>
                            </div>
                            <span style="font-size: 15px; font-style: italic; font-weight: bold; color: #7357ae;"> {{milestone.name}} </span>
                            <br>
                            <span style="font-size: 15px; font-weight: 600; color: grey;">Start date :</span>
                            <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{milestone.start_date}}</span>
                            <br>
                            <span style="font-size: 15px; font-weight: 600; color: grey;">End date :</span>
                            <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{milestone.due_date}}</span>
                            <img src="/static/images/icon_openinnewtab.png" style="width: 25px; float: right; margin-top: -26px; opacity: 49%;" @click="view_milestone(milestone.id)" />    
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p style="margin-top: 15px;"> No milestones found. </p>
            </div>
        </div>
    </div>

        <!-- Popup Component -->
        <div class="container text-center main-body">
            <view_milestones :userType="role" :milestone="milestone_popup" :visible="popupVisible" @close-popup="popupVisible = false, fetch_project(project_id)" @callFetch4="fetch_project(project_id)" />
        </div>
        
        <teams :userType="role" :teams="teams" :project_id="project_id" ref="child" @callFetch="fetch_project(project_id)"/>
        <addMilestone :userType="role" :project_id="project_id" @callFetch="fetch_project(project_id)" ref="child2"/>

</div>
     `,
    data() {
        return {
          milestones: [],
          tasks:[],
          feedbacks:[],
          project:null,
          role: localStorage.getItem('role'),
          token: localStorage.getItem('auth-token'),
          isWaiting: false,
          project_subtitle: null,
          description: null,
          marks: null,
          milestone_popup:null,
          popupVisible: false,
          project_id: null,
          teams: [],
        }
    },
    components: {
        view_milestones,
        teams,
        addMilestone
      },
    async mounted(){
        this.project_id = this.$route.params.project_id;
        this.fetch_project(this.project_id);
    },
    methods: {
        
        async downloadResource(project_id) {
            this.isWaiting = true
            const res = await fetch(`/download_projects/${project_id}`);
            const data = await res.json()
            if (res.ok && data['task_id']) {
            const taskId = data['task_id']
            const intv = setInterval(async () => {
                const pdf_res = await fetch(`/get-pdf/${taskId}`);
                if (pdf_res.ok) {
                this.isWaiting = false
                clearInterval(intv)
                window.location.href = `/get-pdf/${taskId}`
                }
            }, 1000)
            }
        },

        async fetch_project(project_id) {
            const res = await fetch(`/api/project/${project_id}`, {
                method: 'GET',
                headers: {
                    'X-Request-Source': 'all',
                    "Authentication-Token": this.token,
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.project = data;
                this.teams = data.teams;
                this.project_subtitle = data.project_subtitle;
                this.description = data.description;
                this.marks = data.marks;
                this.milestones = data.milestones;
            }
        },
        async view_milestone(milestone_id) {
            try {
                const res = await fetch(`/api/milestones/${milestone_id}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    this.milestone_popup = data; 
                    this.popupVisible = true; 
                } 
            } catch (error) {
                console.log('Error:', error);
            }
        },

        showPopupTeams(){
            this.$refs.child.showPopup();
        },
        closePopupTeams(){
            this.$refs.child.closePopup();
        },
        showPopupAddMilestone(project_id) {
            this.$refs.child2.showPopup(project_id);
        },
        closePopupAddMilestone() {
            this.$refs.child2.closePopup();
        },


        
    /*
        get_pdf: will need miletones - projects - teams - students link to be established by populating these tables
    */   
    }
}

