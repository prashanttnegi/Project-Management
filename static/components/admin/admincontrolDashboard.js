// import addProject from "./addProject.js"

export default {
    data() {
        return {
            projectsData: {
                total: 100,
                completed: 60,
                incomplete: 40,
                lastFourMonths: [20, 25, 30, 35]// Example static data


            },
            projectDetails: [], // Store project details from API
            notifications: [], // Assuming you may use this in other parts of the dashboard
            newClass: "customClass",
            role: "Admin",
            currentDate: new Date(), // Initialize the current date
            currentMonth: new Date().getMonth() + 1, // JS months are 0-indexed
            currentYear: new Date().getFullYear(),
            sampleEvents: [], // Placeholder for events
            users: [], // List of users
            query: "", // Holds the input query
            apiResponse: null, // Holds the API response
            isTyping: false, // Indicates if the typewriter effect is in progress
            students: [],
            milestones: [],
            projects: [],

        };
    },
    template: `
          <div class="container-fluid px-0 main-body">

        <main class="p-3 min-vh-100">



        <div id="fulladvdiv" style="margin-top: -2px;">

          <div class="container">
            <div class="row">
              <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Students </h5>
                     <span style="font-size: 26px; font-weight: 700;">{{students.length}}</span>


                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                  <div class="card-body" style="text-align: center;">

                    <h5 class="card-title">Total Projects </h5>
                    <span style="font-size: 26px; font-weight: 700;">{{projects.length}}</span>


                  </div>
                </div>
              </div>

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




            <h3>AI Search Bar</h3>
            <div id="searchbtn"  onclick="document.getElementById('searchbtn').style.display = 'none'; document.getElementById('searchbararea').style.display = 'block';"
               class="jumbotron jumbotron-fluid rounded bg-white border-0 shadow-sm border-left px-4" style="max-height: 180px; overflow-y: auto;">
                <div class="container">


                    <div class="col-md-12" style="height:50px; border:1px solid rgb(144, 142, 142); margin:5px; border-radius:50px; padding:15px; display:flex; align-items:center;">
                       
                        <div style="flex: 0 0 80%; font-size:14px;"> 
                            <span class="bi bi-list-task" style="margin-right:5px;"></span> NOTE: The search bar operates solely based on data stored within the application's database.<span style="float:right;"> Click here to search . . .  &nbsp; &nbsp;       </span>
                        </div>
                        <div style="flex: 0 0 20%;
                            display: flex;
                            justify-content: space-between;
                            border: 5px solid #f1d9d9;
                            text-align: center;
                            flex-direction: column;
                            border-radius: 50px;
                            background-color: antiquewhite;">
                                                           <i class="bi bi-search"></i>
                        </div>

                    </div>
                    
               
                </div>
            </div>

            <div id="searchbararea" class="col-md-12" 
            style="
                height: 250px;
                border: 3px solid #ffffff;
                display: block;
                border-radius: 10px;
                background-color: #ffffff9e;
                display:none;
            ">

            <div 
            onclick="document.getElementById('searchbararea').style.display = 'none'; document.getElementById('searchbtn').style.display = 'block';"
            style="
            float: right;
            border: 3px solid #df0f0f;
            padding: 10px;
            border-radius: 63px;
            width: 48px;
            text-align: center;
            font-size: 17px;
            font-weight: 700;
            color: red;
            background: #f1f1e77d;
            margin: 12px;
            ">X</div>

            <div style="margin-bottom: 10px;">
                <input id="queryInput" type="text" v-model="query" placeholder="Enter your query here"
                    style="width: 70%; padding: 8px; margin-right: 5px;"/>

                     <button  @click="submitQuery" id="btnclickai"
                     style=" width: 150px;
                            border: 5px solid #f1d9d9;
                            text-align: center;
                            flex-direction: column;
                            border-radius: 50px;
                            background-color: antiquewhite;">
                                                           <i class="bi bi-search"></i>
                    </button>


                
            </div>
            <div>
                <div id="typewriterOutput" style="border: 0px solid #ccc; padding: 10px; border-radius: 5px; min-height: 40px;"></div>
                <div v-if="!apiResponse && !isTyping" style="color: gray;">No response yet</div>
            </div>

            </div>


            <br>
            <br>
            <div class="container-fluid">
                <div class="row">
                    <!-- Left Jumbotron -->
                    <div class="col-md-6">
                        <div class="container ">
                            <h3>All Projects</h3>
                            <canvas id="projectsChart"></canvas>
                        </div>
<br>
                       <h3>Project Control</h3>

                        <div class="jumbotron jumbotron-fluid rounded bg-white border-0 shadow-sm border-left px-4" style="max-height: 180px; overflow-y: auto;">
                       
                            <div class="container">



                                <!-- Dynamically Render Project Details -->

                                <div v-for="project in projectDetails" :key="project.id" class="col-md-12" style="height:50px; border:1px solid rgb(144, 142, 142); margin:5px; border-radius:5px; padding:15px; display:flex; align-items:center;">
                                    <div style="flex: 0 0 80%; font-size:14px;">
                                        <span class="bi bi-list-task" style="margin-right:5px;"></span>
                                        {{ project.project_subtitle }}  <span style="color:grey;"> | current status: {{ project.is_enabled ? 'activate' : 'Deactivate' }} </span>
                                    </div>
                                    <div style="flex: 0 0 20%; display:flex; justify-content:space-between;">
                                        
                                                <span 
                                                    v-if="project.is_enabled" 
                                                    class="bi bi-slash-circle text-warning" 
                                                    style="cursor:pointer;" 
                                                    title="Deactivate" 
                                                    @click="toggleProjectActivation(project)">
                                                    Deactivate
                                                </span>
                                                <span 
                                                    v-else 
                                                    class="bi bi-check-circle text-success" 
                                                    style="cursor:pointer;" 
                                                    title="Activate" 
                                                    @click="toggleProjectActivation(project)">
                                                    Activate
                                                </span>
                                    </div>
                                </div>






                            </div>
                        </div>



                    </div>
            
                    <!-- Right Jumbotron -->
                    <div class="col-md-6">

                    <!-- Calendar Chart Integration -->


                    <h3>Project Calendar</h3>
                            <div>
                                <button @click="previousMonth" class="btn btn-secondary btn-sm">Previous Month</button>
                                <button @click="nextMonth" class="btn btn-secondary btn-sm" style="margin-left:5px;float:right;">Next Month</button>
                            </div>
                            <div id="chartDiv" style="width: 100%; height: 500px;background-color: white;border: 10px solid white;"></div>

                                <div>
                                <br>
                                    <h3>Manage Users</h3>
                                    <div class="jumbotron rounded bg-white shadow-sm border-left px-4" style="max-height: 300px; overflow-y: auto;">
                                        <div v-for="user in users" :key="user.id" class="user-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #ccc; margin-bottom: 5px; border-radius: 5px;">
                                            <div style="flex: 1;">
                                                <strong>Email:</strong> {{ user.email }} <br>
                                                <strong>Approved:</strong> {{ user.is_approved ? "Yes" : "No" }} <br>
                                                <strong>Active:</strong> {{ user.active ? "Yes" : "No" }}
                                            </div>
                                            <div style="display: flex; gap: 10px;">
                                                <!-- Approve Button -->
                                                <button 
                                                    class="btn btn-success btn-sm" 
                                                    :disabled="user.is_approved" 
                                                    @click="approveUser(user)">Approve</button>
                                                
                                                <!-- Activate/Deactivate Button -->
                                                <button 
                                                    class="btn btn-warning btn-sm" 
                                                    @click="toggleActivation(user)">
                                                    {{ user.active ? "Deactivate" : "Activate" }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                
                    </div>
                </div>
            </div>
        
        </main>
    </div>
    `,

    async mounted() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/get_projectdetailsadmindashboard");
            const data = await response.json();

            if (data.projects) {
                this.sampleEvents = data.projects.map((project) => {
                    const duedate = new Date(project.duedate);
                    const formattedDate = `${duedate.getMonth() + 1}/${duedate.getDate()}/${duedate.getFullYear()}`;
                    // Function to handle substring and replace empty values with "......"
                    const safeSubstring = (str, start, end) => {
                        const substr = str.substring(start, end);
                        return substr.trim() === "" ? "." : substr;
                    };
                    return [
                        formattedDate,
                        formattedDate,
                        safeSubstring(project.description, 0, 9),
                        safeSubstring(project.description, 9, 18),
                        safeSubstring(project.description, 18, 27),
                        safeSubstring(project.description, 27, 36)

                    ];
                });
            }


            if (data.projects) {
                // Extract and group projects by month
                const monthCounts = Array(4).fill(0); // Initialize array for last four months
                const currentDate = new Date();

                data.projects.forEach(project => {
                    const duedate = new Date(project.duedate);
                    const diffInMonths = currentDate.getMonth() - duedate.getMonth() +
                        12 * (currentDate.getFullYear() - duedate.getFullYear());
                    if (diffInMonths >= 0 && diffInMonths < 4) {
                        monthCounts[3 - diffInMonths]++; // Increment respective month's count
                    }
                });

                // Create the chart with calculated data
                const ctx = document.getElementById('projectsChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: [
                            new Date(new Date().setMonth(currentDate.getMonth() - 3)).toLocaleString('default', { month: 'long' }),
                            new Date(new Date().setMonth(currentDate.getMonth() - 2)).toLocaleString('default', { month: 'long' }),
                            new Date(new Date().setMonth(currentDate.getMonth() - 1)).toLocaleString('default', { month: 'long' }),
                            new Date().toLocaleString('default', { month: 'long' })
                        ],
                        datasets: [{
                            label: 'Projects Count',
                            data: monthCounts,
                            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                            borderColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Count'
                                }
                            }
                        }
                    }
                });
            }

            if (data.projects) {
                this.projectDetails = data.projects.map(project => ({
                    id: project.id,
                    project_subtitle: project.project_subtitle,
                    is_enabled: project.is_enabled
                }));
            }



            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1; // JS months are 0-indexed
            const daysInMonth = new Date(year, month, 0).getDate();

            // console.log(this.sampleEvents);


            this.createCalendarChart(month, year, daysInMonth);


            const response2 = await fetch("http://127.0.0.1:5000/api/get_usersdetailadmin");
            const data2 = await response2.json();

            if (response.ok && data2.users) {
                this.users = data2.users.map(user => ({
                    id: user.id,
                    email: user.email,
                    is_approved: user.is_approved,
                    active: user.active,
                }));
            } else {
                console.error("Failed to fetch users");
            }







        } catch (error) {
            console.error("Error fetching project details:", error);
        }
        this.fetchUsers()
        this.fetchProjects()
        this.fetchMilestones()
    },

    methods: {
        createCalendarChart(month, year, daysInMonth) {
            var chartConfig = {
                debug: true,
                type: "calendar month solid",
                title: {
                    margin_bottom: 15,
                    label: {
                        text: `${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`,
                        style: {
                            fontSize: 20,
                            fontFamily: "Arial",
                            fontWeight: "bold",
                            color: "#0b7285",
                            whiteSpace: "nowrap" // Prevent unexpected wrapping
                        },
                    },
                },
                yAxis_visible: false,
                legend_visible: false,
                calendar: {
                    range: [`${month}/1/${year}`, `${month}/${daysInMonth}/${year}`],
                    defaultEdgePoint: {
                        color: "white",
                        label_color: "#83b2b7",
                        mouseTracking: false,
                    },
                },
                defaultSeries: {
                    shape_innerPadding: 0,
                    mouseTracking_enabled: false,
                    defaultPoint: {
                        tooltip_enabled: false,
                        states_hover: { color: "#e3fafc" },
                        label: {
                            text:
                                '<span style="align:right; font-size:14px;"><b>%name</b></span><br>%events',
                            align: "left",
                            verticalAlign: "top",
                            padding: 3,
                            style: {
                                fontWeight: "bold",
                                color: "#1098ad",
                                fontFamily: "Arial",
                            },
                        },
                        attributes_events: "",
                    },
                },
                series: [
                    {
                        points: this.sampleEvents.map((row) => {
                            return {
                                date: [row[0], row[1]],
                                attributes: {
                                    events: [
                                        `<span style="color:#09234b;" >PROJECT : </span>
                          <br><span style="color:#78909c;font-size:12px; font-weight:normal">${row[2]}</span>
                           <br><span style="color:#78909c;font-size:12px; font-weight:normal">${row[3]}</span>
                           <br><span style="color:#78909c;font-size:12px; font-weight:normal">${row[4]}</span>
                           <br><span style="color:#78909c;font-size:12px; font-weight:normal">${row[5]}</span>
                        `,
                                    ],
                                },
                            };
                        }),
                    },
                ],
            };
            JSC.chart("chartDiv", chartConfig);
        },
        previousMonth() {
            if (this.currentMonth === 1) {
                this.currentMonth = 12;
                this.currentYear -= 1;
            } else {
                this.currentMonth -= 1;
            }
            this.updateCalendar();
        },
        nextMonth() {
            if (this.currentMonth === 12) {
                this.currentMonth = 1;
                this.currentYear += 1;
            } else {
                this.currentMonth += 1;
            }
            this.updateCalendar();
        },
        updateCalendar() {
            const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
            this.createCalendarChart(this.currentMonth, this.currentYear, daysInMonth);
        },

        async toggleProjectActivation(project) {
            try {
                // Prepare the payload
                const payload = {
                    project_id: project.id,
                    is_enabled: !project.is_enabled // Toggle the current state
                };

                // Call the API
                const response = await fetch("http://127.0.0.1:5000/api/post_projectdetailsadmindashboardactivatedeactivate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    // Update the local state
                    project.is_enabled = !project.is_enabled;
                } else {
                    alert(result.message || "Failed to update project status");
                }
            } catch (error) {
                console.error("Error toggling project activation:", error);
            }
        },

        async approveUser(user) {
            try {
                const payload = {
                    user_id: user.id,
                    is_approved: true, // Set 'is_approved' to true
                };

                const response = await fetch("http://127.0.0.1:5000/api/post_usersdetailadminactivatedeactivate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message || "User approved successfully!");
                    user.is_approved = true; // Update local state
                } else {
                    alert(result.message || "Failed to approve user.");
                }
            } catch (error) {
                console.error("Error approving user:", error);
                alert("An error occurred while approving the user.");
            }
        },

        async toggleActivation(user) {
            try {
                const payload = {
                    user_id: user.id,
                    active: !user.active, // Toggle 'active' state
                };

                const response = await fetch("http://127.0.0.1:5000/api/post_usersdetailadminactivatedeactivate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message || `User ${user.active ? "deactivated" : "activated"} successfully!`);
                    user.active = !user.active; // Update local state
                } else {
                    alert(result.message || "Failed to toggle activation.");
                }
            } catch (error) {
                console.error("Error toggling activation:", error);
                alert("An error occurred while toggling user activation.");
            }
        },

        async submitQuery() {
            if (!this.query.trim()) {
                alert("Please enter a valid query.");
                return;
            }

            this.apiResponse = null;
            this.isTyping = true;
            document.getElementById("typewriterOutput").innerHTML = ""; // Clear previous output

            document.getElementById('btnclickai').style.opacity = '0';

            try {

                // Fetch data from the first API
                const searchResponse = await fetch("http://127.0.0.1:5000/api/get_alldataforsearch", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!searchResponse.ok) {
                    throw new Error(`Error fetching data from search API: ${searchResponse.status}`);
                }

                const searchData = await searchResponse.json();
                const formattedOutput = searchData.formatted_output || "";

                // Append the "formatted_output" data to the query
                const completeQuery = this.query + " --- " + "PLEASE USE ONLY THIS DATA TO ANSWER THE QUESTION:"+formattedOutput + " Please answer in 200 words only";



                const response = await fetch("http://127.0.0.1:5000/api/chatgpt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query: completeQuery }),
            });
            // console.log(this.query );

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            this.apiResponse = data.response || "No response received.";
            this.typeWriterEffect(this.apiResponse);

        } catch(error) {
            console.error("Error calling API:", error);
            this.apiResponse = "An error occurred while fetching the response.";
            this.typeWriterEffect(this.apiResponse);
        }
    },

    typeWriterEffect(text) {
        const outputDiv = document.getElementById("typewriterOutput");
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                outputDiv.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 20); // Adjust typing speed here (in milliseconds)
            } else {
                this.isTyping = false;
                document.getElementById('btnclickai').style.opacity = '100';

            }
        };

        typeWriter();

    },

    async fetchUsers() {
        try {
            const res = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            let users = data
            for (let i = 0; i < users.length; i++) {
                if (users[i].role == "student") {
                    this.students.push(users[i]);
                }
            }
        } catch (error) {
            console.log('Error:', error)
        }
    },

    async fetchProjects() {
        try {
            const res = await fetch('/api/project', {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            this.projects = data
        } catch (error) {
            console.log('Error:', error)
        }
    },

    async fetchMilestones() {
        try {
            const res = await fetch('/api/milestones', {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            this.milestones = data
        } catch (error) {
            console.log('Error:', error)
        }
    },

}
}
