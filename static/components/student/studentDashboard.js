import view_milestones from "../instructor/view_milestones.js";

export default {
    data() {
        return {
            projects: [],
            notifications: [],
            milestones: [],            
            newClass: "customClass",
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            milestone_popup:null,
            popupVisible: false,
        }
    },
    template: `
        <div class='container text-center main-body'>
               <div class="col-md-12 child inline-block-child">

      <div>


        <div id="fulladvdiv" style="margin-top: -52px;">

          <div class="container">
            <div class="row">
              

              <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Projects </h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> {{projectCount}} </span>


                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Milestones</h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> {{milestoneCount}} </span>


                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Notifications</h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> {{notifications.length}} </span>


                  </div>
                </div>
              </div>


            </div>






          </div>





        </div>






        <!-- ------------------PROJECT DETAILS pop ups ------------------------ -->

        <div id="addnewproject" class="col-md-6" style="border: 1px solid red;
                    width: 70%;
                    height: 70%;
                    background-color: #f1f1f1;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 99999;
                    border-radius: 15px;
                    border: 5px solid #80808080;
                    display:none;
                    overflow-y: auto;">



          <span style="float: right;
                            margin: 7px;
                            border: 3px solid red;
                            padding: 5px;
                            border-radius: 50px;
                            width: 50px;
                            text-align: center;
                            font-weight: 700;
                            font-size: 22px;
                            color: grey; cursor: pointer;" onclick="var element = document.getElementById('addnewproject'); 
                                    element.style.display = (element.style.display === 'none' ? 'block' : 'none');">
            X
          </span>


          <div class="container mt-5">
            <h3>Project Details</h3>

            <!-- Project Section -->
            <form id="projectForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="projectTitle" class="form-label">Project Title : </label>
                    <br>
                    <span>Demo project title...</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="projectSubtitle" class="form-label">Project Sub Title : </label>
                    <br>
                    <span>Demo project subtitle ...</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label for="projectDetails" class="form-label">Project Details</label>
<br>
<span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer 
took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s 
with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                  </div>
                </div>
                <hr>
                <br>

         

              </div>

              
              </div>

              <!-- Button to Submit the Project -->
              <button type="submit" class="btn btn-primary">Click here to submit your Final Project as instructed by IITM</button>
            </form>
          </div>



        </div>







        <!-- ------------------View milestone pop up------------------------ -->

        <div id="milestonepopup" class="col-md-6" style="border: 1px solid red;
                    width: 70%;
                    height: 70%;
                    background-color: #f1f1f1;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 99999;
                    border-radius: 15px;
                    border: 5px solid #80808080;
                    display:none;
                    overflow-y: auto;">



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
          </span>


          <div class="container mt-5">
            <h3>Milestone  Details</h3>

            <!-- Project Section -->
            <form id="projectForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="projectTitle" class="form-label">Milestone Name : </label>
                    <br>
                    <span>Demo project title...</span>
                  </div>
                </div>


              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label for="projectDetails" class="form-label">Milestone Details : </label>
<br>
<span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer 
took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s 
with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                  </div>
                </div>
                <hr>
                <br>

         

              </div>

              
              </div>

              <!-- Button to Submit the Project -->
              <button type="submit" class="btn btn-primary">Click here to submit your Milestone </button>
            </form>
          </div>



        </div>




 <!-- ------------------View NOTIFICATION pop up------------------------ -->

        <div id="addnewNotification" class="col-md-6" style="border: 1px solid red;
                    width: 70%;
                    height: 70%;
                    background-color: #f1f1f1;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 99999;
                    border-radius: 15px;
                    border: 5px solid #80808080;
                    display:none;
                    overflow-y: auto;">




          <span style="float: right;
                            margin: 7px;
                            border: 3px solid red;
                            padding: 5px;
                            border-radius: 50px;
                            width: 50px;
                            text-align: center;
                            font-weight: 700;
                            font-size: 22px;
                            color: grey; cursor: pointer;" onclick="var element = document.getElementById('addnewNotification'); 
                                    element.style.display = (element.style.display === 'none' ? 'block' : 'none');">
            X
          </span>

          <div class="container mt-5">


                <h3>Notification Details</h3>
             

                <form>
                  <!-- Notification Title -->
                  <div class="mb-3">
                    <label for="notificationTitle" class="form-label">Notification Title</label>
                   <br>
                   Upcoming Milestone (Due date)
                  </div>

                  <!-- Notification Details -->
                  <div class="mb-3">
                    <label for="notificationDetails" class="form-label">Notification Details</label>
                  <br>
                  <span>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in 
                  a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
                   a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words,
                    consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, 
                    discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum 
                    et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory 
                  of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. -- KUBRA ( Project TA )</span>
                  </div>

                  <!-- Notification Created On -->
                  <div class="mb-3">
                    <label for="createdOn" class="form-label">Notification Created on</label>
                  <br>
                  <span>
                  12 October 2024
                  </span>
                  </div>

                </form>
  

          </div>


        </div>





        <!-- ------------------pop ups end------------------------ -->

            <!-- Main Content Section -->
            <div id="fulluserdiv">
                <div class="table-responsive" style="overflow-x: hidden;">
                    <!-- Flexbox for aligning Projects and Notifications sections -->
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-top: 20px">
                        
                        <!-- Projects Section -->
                        <div style="width: 70%; margin: 5px; padding-left: 18px;">
                            <h2 style="font-size: 28px;">Projects</h2><br>
                          
                            <!-- Project Cards -->
                            <div class="row" v-if="projectCount > 0" style="margin-top: -25px;">
                            <div class="col-md-6" v-for="(project, index) in projects" :key="index" style="margin-top: 25px;">
                                    <div class="card h-100">
                                        <div class="card-body" style="background-color: #fce4cc;">
                                            <h5 class="card-title" style="text-align: center;"><strong> {{project.project_subtitle}} </strong></h5>

                                        
                                            
                                            <!-- Milestone Details -->
                                            
                                            <div class="project-milestone-info-admin" v-for="(milestone,index) in project.milestones">
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
                                            <div class="card-footer">
                                                <router-link :to="{name:'project_details',params:{project_id:project.id}}" style="text-decoration: none;">
                                                    <button class="btn btn-primary btn-sm" style="margin: 5px;">View Details</button>
                                                </router-link>
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
                            <h2 style="font-size: 28px;"> Notifications </h2><br>

                            <!-- Notification Cards -->
                            <div class="row" v-if="notifications.length > 0" style="margin-top: -25px;">
                                <div class="col-md-12" v-for="notification in notifications" style="margin-top: 25px;">
                                    <div class="card h-100">
                                        <div class="card-body" style="background-color: #f8f8e7;">
                                            <h6 class="card-title"><strong>{{notification.notification_title}}</strong></h6>
                                            <strong>Notification Details :</strong>
                                            <span style="font-size: 15px; font-style: italic; color: #7357ae;">{{notification.notification_details}}</span>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>No notifications created yet.</div>
                        </div>
                    </div>
                </div>

                <hr style="border: 4px solid #004b46; border-radius: 8px;">
            </div>
        </div>

<!-- Popup Component -->
        <div class="container text-center main-body">
            <view_milestones :userType="role" :milestone="milestone_popup" :visible="popupVisible" @close-popup="popupVisible = false" />
</div>

        </div>
    `,
    async mounted() {
      await this.fetch_projects()
      this.fetchNotifications()
    },
    created() {
      this.token = localStorage.getItem("auth-token"); // Retrieve the token after login
      this.role = localStorage.getItem('role');
      if (!this.token) {
          console.error("Authentication token is missing");
      }
  },  
  computed: {
    projectCount() {
      return this.projects ? this.projects.length : 0;
    },
    milestoneCount() {
      if (!this.projects || this.projects.length === 0) {
          return 0; 
      }
      return this.projects.reduce((total, project) => {
          return total + (project.milestones ? project.milestones.length : 0);
      }, 0);
  }
  },  
watch: {
    projects(newVal) {
        console.log('Projects updated:', newVal);
    }
},

    components: {
        view_milestones,
    },
    methods: {
        showPopup() {
            this.$refs.child1.showPopup();
        },
        closePopup() {
            this.$refs.child1.closePopup();
        },        
      async fetch_projects() {
        try {
          const res = await fetch('/student_projects', {
            method: 'GET',
            headers: {
              'X-Request-Source': 'all',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
          });
      
          if (res.ok) {
            const data = await res.json();
            this.projects = Array.isArray(data.projects) ? data.projects : [];
            console.log(this.projects[0].milestones)
          } else {
            console.error('Failed to fetch projects');
            this.projects = [];
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          this.projects = [];
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
    async view_milestone(milestone_id){
      try{
          const res=await fetch(`/api/milestones/${milestone_id}`,{
              method:'GET',
              headers:{
                  'Authentication-Token':localStorage.getItem('auth-token')
              }
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
    }
}
