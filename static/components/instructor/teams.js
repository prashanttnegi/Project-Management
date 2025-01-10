export default{
    props:
        ['userType']
    ,
    data(){
        return{
            isPopupVisible:false,
            message:'',
            project_id:'',
            project:null,
            teams:[],
            formData:{
                subtitle:'',
                description:'',
                marks:null,
                subject_id:null,
            }
        }
    },
    template:
        `
            <div v-if="isPopupVisible" class="popup_2" id="teamsPopup">
                <div class="container mt-5">
                    <button class="close-button" @click="closePopup">&times;</button>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Teams</h3><br>
                            <ul v-if="teams && teams.length > 0">
                                <li v-for="team in teams" :key="team.id" class="team-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px;">
                                        <span>{{ team.name }}</span>
                                        <span style="float: right;">
                                            <router-link title="View Team" :to="{ name: 'team_details', params: { team_id: team.id , project_id: project_id} }"><img src="/static/images/icon_openinnewtab.png" @click="view_team(team.id)" style="width: 25px; opacity: 49%;" /></router-link>
                                            <span  
                                                class="bi bi-dash-circle text-danger" 
                                                style="cursor:pointer; padding: 10px;" 
                                                title="Delete Team" 
                                                id="deleteButton" 
                                                data-bs-toggle="modal" 
                                                :data-bs-target="'#confirmationModal' + team.id"
                                            >
                                            </span>
                                        </span>
                                        <div class="modal fade" :id="'confirmationModal' + team.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index: 10000;">
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
                                                        <button type="button" class="btn btn-danger" @click="deleteTeam(team.id)" data-bs-dismiss="modal">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-else>
                                <p>No teams found.</p>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" @click="createTeam(project_id)" style="margin-top: 10px;">Add Team</button>
                </div>
            </div>
        `
    ,
    async mounted(){
        this.project_id = this.$route.params.project_id;
        this.fetch_project(this.project_id);
    },
    methods:{
        showPopup() {
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
        },
        view_team(team_id){
            this.$emit('viewTeam', team_id);
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
                this.project=data;
                this.teams=data.teams;
            }
        },
        async createTeam(project_id){
            try {
                // this.project = await this.fetch_project(project_id);
                let len = this.project.teams.length+1;

                const res = await fetch(`/api/teams`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify({
                        'name': 'Team_' + len,
                        'project_id': project_id,
                    }),
                });

                if (res.ok) {
                    this.message = "Team created successfully!";
                    this.fetch_project(project_id);
                    this.$emit('callFetch');
                    alert(this.message);
                }
                
            }catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
        async deleteTeam(team_id){
            const res = await fetch(`/api/teams/${team_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token':localStorage.getItem('auth-token'),
                },
            });
            if (res.ok) {
                this.message = "Team deleted successfully!";
                this.fetch_project(this.project_id);
                this.$emit('callFetch');
                alert(this.message);
            }
        },
    }
}