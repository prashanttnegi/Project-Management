import addProject from "./addProject.js"

export default {
    data() {
        return {
            projects: [],
            notifications: [],
            newClass: "customClass",
            role: "Admin"
        }
    },
    template: `
        <div class='container text-center main-body'>
               <div class="col-md-12 child inline-block-child">

      <div>


        <div id="fulladvdiv" style="margin-top: -52px;">

          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Students </h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> 890 </span>


                  </div>
                </div>
              </div>

              <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Projects </h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> 10 </span>


                  </div>
                </div>
              </div>

              <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Milestones</h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> 5 </span>


                  </div>
                </div>
              </div>

              <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Notifications</h5>
                    <span style="font-size: 26px;
    font-weight: 700;"> 75 </span>


                  </div>
                </div>
              </div>


            </div>






          </div>





        </div>






        <!-- ------------------pop ups end------------------------ -->

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
            <h3>Add New Project</h3>

            <!-- Project Section -->
            <form id="projectForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="projectTitle" class="form-label">Project Title</label>
                    <input type="text" class="form-control" id="projectTitle" placeholder="Enter project title"
                      required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="projectSubtitle" class="form-label">Project Sub Title</label>
                    <input type="text" class="form-control" id="projectSubtitle" placeholder="Enter project subtitle"
                      required>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label for="projectDetails" class="form-label">Project Details</label>
                    <textarea class="form-control" id="projectDetails" rows="3" placeholder="Enter project details"
                      required></textarea>
                  </div>
                </div>
                <hr>
                <br>

                <h4>Add Milestone 1 (Required)</h4>

                <div class="col-md-12">
                  <div class="mb-3">
                    <label for="milestoneName-1" class="form-label">Milestone Name</label>
                    <input type="text" class="form-control" id="milestoneName-1" placeholder="Enter milestone name"
                      required>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="startDate-1" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="startDate-1" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="endDate-1" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="endDate-1" required>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneDetails-1" class="form-label">Milestone Details</label>
                    <textarea class="form-control" id="milestoneDetails-1" rows="3"
                      placeholder="Enter milestone details" required></textarea>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneTasks-1" class="form-label">Milestone Tasks</label>
                    <textarea class="form-control" id="milestoneTasks-1" rows="3" placeholder="Enter milestone tasks"
                      required></textarea>
                  </div>
                </div>
              </div>



              <hr>

              <!-- Milestone 2 -->
              <h4>Add Milestone 2 (Optional)</h4>
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="milestoneName-2" class="form-label">Milestone Name</label>
                  <input type="text" class="form-control" id="milestoneName-2" placeholder="Enter milestone name">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="startDate-2" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="startDate-2">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="endDate-2" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="endDate-2">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneDetails-2" class="form-label">Milestone Details</label>
                    <textarea class="form-control" id="milestoneDetails-2" rows="3"
                      placeholder="Enter milestone details"></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneTasks-2" class="form-label">Milestone Tasks</label>
                    <textarea class="form-control" id="milestoneTasks-2" rows="3"
                      placeholder="Enter milestone tasks"></textarea>
                  </div>
                </div>
              </div>

              <hr>

              <!-- Milestone 3 -->
              <h4>Add Milestone 3 (Optional)</h4>
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="milestoneName-3" class="form-label">Milestone Name</label>
                  <input type="text" class="form-control" id="milestoneName-3" placeholder="Enter milestone name">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="startDate-3" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="startDate-3">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="endDate-3" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="endDate-3">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneDetails-3" class="form-label">Milestone Details</label>
                    <textarea class="form-control" id="milestoneDetails-3" rows="3"
                      placeholder="Enter milestone details"></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneTasks-3" class="form-label">Milestone Tasks</label>
                    <textarea class="form-control" id="milestoneTasks-3" rows="3"
                      placeholder="Enter milestone tasks"></textarea>
                  </div>
                </div>
              </div>

              <hr>

              <!-- Milestone 4 -->
              <h4>Add Milestone 4 (Optional)</h4>
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="milestoneName-4" class="form-label">Milestone Name</label>
                  <input type="text" class="form-control" id="milestoneName-4" placeholder="Enter milestone name">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="startDate-4" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="startDate-4">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="endDate-4" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="endDate-4">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneDetails-4" class="form-label">Milestone Details</label>
                    <textarea class="form-control" id="milestoneDetails-4" rows="3"
                      placeholder="Enter milestone details"></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="milestoneTasks-4" class="form-label">Milestone Tasks</label>
                    <textarea class="form-control" id="milestoneTasks-4" rows="3"
                      placeholder="Enter milestone tasks"></textarea>
                  </div>
                </div>
              </div>

              <!-- Button to Submit the Project -->
              <button type="submit" class="btn btn-primary">Add New Project</button>
            </form>
          </div>



        </div>









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


                <h3>Add New Notification</h3>
             

                <form>
                  <!-- Notification Title -->
                  <div class="mb-3">
                    <label for="notificationTitle" class="form-label">Notification Title</label>
                    <input type="text" class="form-control" id="notificationTitle" placeholder="Enter title">
                  </div>

                  <!-- Notification Details -->
                  <div class="mb-3">
                    <label for="notificationDetails" class="form-label">Notification Details</label>
                    <textarea class="form-control" id="notificationDetails" rows="3"
                      placeholder="Enter details"></textarea>
                  </div>

                  <!-- Notification Created On -->
                  <div class="mb-3">
                    <label for="createdOn" class="form-label">Notification Created on</label>
                    <input type="date" class="form-control" id="createdOn">
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn btn-primary">Submit</button>
                </form>
  

          </div>


        </div>





        <!-- ------------------pop ups end------------------------ -->




        <div id="fulluserdiv" style="margin-top: -23px;">


          <div class="table-responsive" style="overflow-x: hidden;">

            <div style="display: flex;">





              <div style="height: 100%; width: 70%;margin: 5px;margin-right: 10px;">


                <h2 style="font-size: 28px;">Projects
                  <span>
                    <img src="./static/Images/addicon.png" style="width: 66px;opacity: 48%;" onclick="var element = document.getElementById('addnewproject'); 
                 element.style.display = (element.style.display === 'none' ? 'block' : 'none');" />
                  </span>
                </h2>




                <div class="row" style="margin-top: -25px;">

                  <div class="col-md-6" style="margin-top: 25px;">
                    <div class="card h-100">
                      <div class="card-body" style="background-color: #fce4cc;">
                        <h5 class="card-title" style="text-align: center;"><strong>Web Designing</strong></h5>
                        <h6 class="card-subtitle mb-2 text-muted" style="text-align: center;">Prototyping</h6>



                        <br>

                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                      margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 1 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Create user story for initial Client Iteraction </span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">20 October 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">29 October 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>


                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                      margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 2 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Design UI For client demonstration </span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">1 November 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">15 November 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>







                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                          margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 3 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Submit API Documentation </span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">15 November 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">20 November 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>


                        <button class="btn btn-primary btn-sm" style="margin: 5px;">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>


                  <div class="col-md-6" style="margin-top: 25px;">
                    <div class="card h-100">
                      <div class="card-body" style="background-color: #fce4cc;">
                        <h5 class="card-title" style="text-align: center;"><strong>Payment Gateway Integration</strong>
                        </h5>
                        <h6 class="card-subtitle mb-2 text-muted" style="text-align: center;">RazorPay</h6>



                        <br>

                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                      margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 1 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Create user story for RazorPay integration </span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">21 October 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">23 October 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>





                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                      margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 2 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Provide Number of hours required for integration </span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">1 November 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">15 November 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>




                        <button class="btn btn-primary btn-sm" style="margin: 5px;">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>



                  <div class="col-md-6" style="margin-top: 25px;">
                    <div class="card h-100">
                      <div class="card-body" style="background-color: #fce4cc;">
                        <h5 class="card-title" style="text-align: center;"><strong>House Rental Application</strong>
                        </h5>
                        <h6 class="card-subtitle mb-2 text-muted" style="text-align: center;">Student Project MAD 1</h6>



                        <br>

                        <div style="    width: 100%;
                                      border: 2px dotted #d4b1b1;
                                      border-radius: 5px;
                                      height: auto;
                                      background-color: white;
                                      padding: 3px;
                                      margin-top: 5px;">

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Milestone 1 :</span> <span
                            style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">Create user story for Rental Application</span>
                          <br>

                          <span style=" font-size: 15px; font-weight: 600;color: grey;">Start date :</span><span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">21 October 2024</span>
                          <br>
                          <span style=" font-size: 15px; font-weight: 600;color: grey;">End date :</span> <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">23 October 2024</span>
                          <br>

                          <img src="./static/Images/icon_openinnewtab.png" style="width: 25px;
                                                            float: right;
                                                            margin-top: -26px;
                                                            opacity: 49%;" />

                        </div>



                        <button class="btn btn-primary btn-sm" style="margin: 5px;">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>




                </div>

              </div>





              <div style="    height: 100%;
                border-left: 4px solid #d6d0d0a8;
                width: 30%;
                margin: 5px;
                margin-left: 10px;
                padding-left: 18px;">


                <h2 style="font-size: 28px;">Notifications
                  <span>
                    <img src="./static/Images/addicon.png" style="width: 66px;opacity: 48%;" onclick="var element = document.getElementById('addnewNotification'); 
                                    element.style.display = (element.style.display === 'none' ? 'block' : 'none');" />
                  </span>
                </h2>


                <div class="col-md-12" style="margin-top: 25px;">
                  <div class="card h-100">
                    <div class="card-body" style="background-color: #f8f8e7;">

                      <h6 class="card-title"><strong>Web Designing Milestone 1</strong></h6>
                      <strong>Notification Details :</strong>
                      <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">The deadline for Web Designing Milestone 1 is approaching
                        please ensure all submissions are completed on time.</span>
                      <br>
                      <button class="btn btn-primary btn-sm" style="margin: 5px;">Edit</button>
                      <button class="btn btn-danger btn-sm" style="margin: 5px;">Delete</button>
                      <button class="btn btn-warning btn-sm">Send</button>
                    </div>
                  </div>
                </div>


                <div class="col-md-12" style="margin-top: 25px;">
                  <div class="card h-100">
                    <div class="card-body" style="background-color: #f8f8e7;">

                      <h6 class="card-title"><strong>House Rental Application</strong></h6>
                      <strong>Notification Details :</strong>
                      <span style="font-size: 15px;
                                          font-style: italic;
                                          color: #7357ae;">There is one new details please refer dashboard for the
                        same.</span>
                      <br>
                      <button class="btn btn-primary btn-sm" style="margin: 5px;">Edit</button>
                      <button class="btn btn-danger btn-sm" style="margin: 5px;">Delete</button>
                      <button class="btn btn-warning btn-sm">Send</button>
                    </div>
                  </div>
                </div>

              </div>





























            </div>



          </div>


        </div>

        <hr style="border: 4px solid #004b46;    border-radius: 8px;">






      </div>

    </div>

        </div>
    `,
    async mounted() {

    },
    components: {
        addProject,

    },
    methods: {
        showPopup() {
            this.$refs.child1.showPopup();
        },
        closePopup() {
            this.$refs.child1.closePopup();

        },
    }
}
