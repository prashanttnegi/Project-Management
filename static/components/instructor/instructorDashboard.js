import addProject from "../admin/addProject.js";
import addNotification from "../admin/addNotification.js";
import view_milestones from "./view_milestones.js";
import editProject from "./editProject.js";

export default{
    data(){
        return{
            projects:[],
            notifications:[],
            editNotificationData: null, 
            newClass:"customClass",
            role:"instructor",
            popupVisible: false,
            milestone_popup:null,
            students:[],
            milestones:[],
            
        }
    },
    template:`
    <div class="container text-center main-body">
        <!-- Top Summary Cards -->
        <div class="col-md-12 child inline-block-child">
            <div id="fulladvdiv" style="margin-top: -52px;">
                <div class="container">
                    <div class="row">
                        <!-- Total Students Card -->
                        <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body" style="text-align: center;">
                                    <h5 class="card-title">Total Students</h5>
                                    <span style="font-size: 26px; font-weight: 700;">{{students.length}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Total Projects Card -->
                        <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body" style="text-align: center;">
                                    <h5 class="card-title">Total Projects</h5>
                                    <span style="font-size: 26px; font-weight: 700;">{{projects.length}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Total Milestones Card -->
                        <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body" style="text-align: center;">
                                    <h5 class="card-title">Total Milestones</h5>
                                    <span style="font-size: 26px; font-weight: 700;">{{milestones.length}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Section -->
            <div id="fulluserdiv">
                <div class="table-responsive" style="overflow-x: hidden;">
                    <!-- Flexbox for aligning Projects and Notifications sections -->
                    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                        
                        <!-- Projects Section -->
                        <div style="width: 70%; margin: 5px; padding-left: 18px;">
                            <h2 style="font-size: 28px;">Projects
                                <span>
                                    <img src="/static/images/addicon.png" style="width: 66px; opacity: 48%;" @click="showPopup()" />
                                </span>
                            </h2>

                            <!-- Project Cards -->
                            <div class="row" v-if="projects.length > 0" style="margin-top: -25px;">
                                <div class="col-md-6" v-for="project in projects" style="margin-top: 25px;">
                                    
                                    <div class="card h-100" v-if="project.is_enabled == 1">
                                        <div class="card-body" style="background-color: #fce4cc;">
                                            <h5 class="card-title" style="text-align: center;"><strong>{{project.project_subtitle}}</strong></h5>
                                            <h6 class="card-subtitle mb-2 text-muted" style="text-align: center;">Created By: {{project.instructor.name}}</h6>

                                            <!-- Milestone Details -->
                                            <template v-if="(count = 0)"></template>
                                            
                                            <div class="project-milestone-info-admin" v-for="(milestone,index) in project.milestones">
                                                <div style="text-align: center;">
                                                    <span style="font-size: 20px; font-weight: 600; color: grey;">Milestone {{count = count + 1}}</span>
                                                </div>
                                                <span style="font-size: 15px; font-style: italic; font-weight: bold; color: #7357ae;"> {{milestone.name}} </span>
                                                <br>
                                                <span style="font-size: 15px; font-weight: 600; color: grey;">Start date :</span>
                                                <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{milestone.start_date}}</span>
                                                <br>
                                                <span style="font-size: 15px; font-weight: 600; color: grey;">End date :</span>
                                                <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{milestone.due_date}}</span>
                                                <img src="/static/images/icon_openinnewtab.png" @click="view_milestone(milestone.id)" style="width: 25px; float: right; margin-top: -26px; opacity: 49%;" />
                                            </div>
                                        
                                            <div class="card-footer">
                                                <!--
                                                    <button class="btn btn-primary btn-sm" @click="edit_project(project.id)" style="margin: 5px;">Edit</button>
                                                
                                                    <a :href="'/#/project_details/' + project.id" class="btn btn-primary btn-sm" style="margin: 5px;">Edit</a>
                                                -->

                                                <router-link :to="{name:'project_details',params:{project_id:project.id}}" style="text-decoration: none;">
                                                    <button class="btn btn-primary btn-sm" style="margin: 5px;">Manage</button>
                                                </router-link>
                                                <button class="btn btn-warning btn-sm" @click="showPopupEditProject(project.id)" style="margin: 5px;">Edit</button>
                                                <button class="btn btn-danger btn-sm" id="deleteButton" data-bs-toggle="modal" :data-bs-target="'#confirmationModal' + project.id" style="margin: 5px;">Delete</button>
                                                
                                                <div class="modal fade" :id="'confirmationModal' + project.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index: 10000;">
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
                                                                <button type="button" class="btn btn-danger" @click="deleteProject(project.id), fetchProjects()" data-bs-dismiss="modal">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>No Projects created yet.</div>
                        </div>

                        <!-- Vertical Divider Line -->
                        <div class="vr" style="border: 3px solid #004b46; border-radius: 4px;"></div>

                        <!-- Notifications Section -->
                        <div style="width: 30%; margin: 5px; padding-left: 18px;">
                            <h2 style="font-size: 28px;">Notifications
                                <span>
                                    <img src="/static/images/addicon.png" style="width: 66px; opacity: 48%;" @click="showPopupNotifications()" />
                                </span>
                            </h2>

                            <!-- Notification Cards -->
                                <div class="row" v-if="notifications.length > 0" style="margin-top: -25px;">
                                    <div class="col-md-12" v-for="notification in notifications" style="margin-top: 25px;">
                                        <div class="card h-100">
                                            <div class="card-body" style="background-color: #f8f8e7;">
                                                <h6 class="card-title"><strong>{{ notification.notification_title }}</strong></h6>
                                                <strong>Notification Details :</strong>
                                                <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{ notification.notification_details }}</span>
                                                <br>
                                                <button class="btn btn-primary btn-sm" style="margin: 5px;" @click="openEditNotification(notification)">Edit</button>
                                                <button class="btn btn-danger btn-sm" style="margin: 5px;" @click="deleteNotification(notification.id)">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            <div v-else>No notifications created yet.</div>
                        </div>

                            <div v-if="editNotificationData" 
                                style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; border-radius: 8px; width: 555px;border: 2px solid grey;">
                                <h4>Edit Notification</h4>
                                <form @submit.prevent="updateNotification">
                                    <div class="form-group" style="margin-bottom: 10px;">
                                        <label for="title" style="display: block; margin-bottom: 5px;">Title</label>
                                        <input type="text" id="title" v-model="editNotificationData.notification_title" 
                                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
                                    </div>
                                    <div class="form-group" style="margin-bottom: 10px;">
                                        <label for="details" style="display: block; margin-bottom: 5px;">Details</label>
                                        <textarea id="details" v-model="editNotificationData.notification_details" 
                                                style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                                    </div>
                                    <div class="form-group" style="text-align: right;">
                                        <button type="submit" 
                                                style="background-color: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Save</button>
                                        <button type="button" 
                                                @click="editNotificationData = null" 
                                                style="background-color: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin-left: 5px; cursor: pointer;">Cancel</button>
                                    </div>
                                </form>
                            </div>



                    </div>
                </div>

                <hr style="border: 4px solid #004b46; border-radius: 8px;">
            </div>
        </div>

        <!-- Footer with Add Project Component -->
        <footer>
            <addProject :userType="role" @callFetch="fetchProjects" ref="child1"></addProject>
            <addNotification :userType="role" @callFetch2="fetchNotifications" ref="child2"></addNotification>
            <view_milestones :userType="role" :milestone="milestone_popup" :visible="popupVisible" @close-popup="popupVisible = false, fetchProjects()" @callFetch4="fetchProjects()"/>
            <editProject :userType="role" ref="child3" @callFetch3="fetchProjects" />
        </footer>
    </div>
    `,
    async mounted(){
        this.fetchProjects()
        this.fetchNotifications()
        this.fetchMilestones()
        this.fetchUsers()
    },
    components:{
        addProject,
        addNotification,
        view_milestones,
        editProject
    },
    methods:{
        showPopup() {
            this.$refs.child1.showPopup();
        },
        closePopup() {
            this.$refs.child1.closePopup();
            this.fetchProjects()
        },
        showPopupNotifications() {
            this.$refs.child2.showPopup();
        },
        closePopupNotifications() {
            this.$refs.child2.closePopup();
            this.fetchNotifications()
        },
        showPopupEditProject(projectId) {
            this.$refs.child3.showPopup(projectId);
        },
        closePopupEditProject() {
            this.$refs.child3.closePopup();
            this.fetchProjects()
        },
        // showPopupEditNotifications(notificationId) {
        //     this.$refs.child4.showPopup(notificationId);
        // },
        // closePopupEditNotifications() {
        //     this.$refs.child4.closePopup();
        //     this.fetchNotification()
        // },
        async fetchProjects(){
            try{
                const res=await fetch('/api/project',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.projects=data
            } catch(error){
                console.log('Error:',error)
            }
        },

        async fetchNotifications(){
            try{
                const res=await fetch('/api/notifications',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.notifications=data
            } catch(error){
                console.log('Error:',error)
            }
        },

        edit_project(project_id){
            this.$refs.child3.showPopup(project_id);
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
        async fetchUsers(){
            try{
                const res=await fetch('/api/users',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.users=data
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].role == "student") {
                        this.students.push(this.users[i]);
                    }
                }
            } catch(error){
                console.log('Error:',error)
            }
        },
        async fetchMilestones(){
            try{
                const res=await fetch('/api/milestones',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.milestones=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        async deleteProject(project_id){
            try{
                const res=await fetch(`/api/project/${project_id}`,{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    }
                })
                const data=await res.json()
                this.fetchProjects()
                if (res.ok){
                    alert("Project deleted successfully")
                }else{
                    alert("Some error happened")
                    console.log(data)
                }
            } catch(error){
                console.log('Error:',error)
            }
        },
        
        async fetchNotifications() {
            try {
                const res = await fetch('/api/notifications', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                });
                const data = await res.json();
                this.notifications = data;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        openEditNotification(notification) {
            this.editNotificationData = { ...notification }; // Create a copy of the notification data
        },
        async updateNotification() {
            try {
                const res = await fetch(`/api/notifications/${this.editNotificationData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify(this.editNotificationData),
                });
                if (res.ok) {
                    this.editNotificationData = null;
                    this.fetchNotifications();
                    alert('Notification updated successfully.');
                } else {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.error || 'Failed to update notification'}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async deleteNotification(notificationId) {
            try {
                const res = await fetch(`/api/notifications/${notificationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                });
                if (res.ok) {
                    this.fetchNotifications();
                    alert('Notification deleted successfully.');
                } else {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.error || 'Failed to delete notification'}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
    }
}
