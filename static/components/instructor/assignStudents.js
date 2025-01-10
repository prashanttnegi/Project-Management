export default{
    props:
        ['userType']
    ,
    data(){
        return{
            isPopupVisible:false,
            message:'',
            project_id:'',
            team_id:'',
            students:[],
            all_teams:[],
            all_students:[],
        }
    },
    template:
        `
            <div v-if="isPopupVisible" class="popup_2" id="assignPopup">
                <div class="container mt-5">
                    <button class="close-button" @click="closePopup">&times;</button>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Unassigned Students</h3><br>
                            <ul v-if="students && students.length > 0">
                                <li v-for="student in students" :key="student.id" class="student-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px;">
                                        <span>{{ student.name }}</span>
                                        <button @click="assignStudent(student.id)" class="btn btn-success">Assign</button>
                                    </div>
                                </li>
                            </ul>
                            <div v-else>
                                <p>No students found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    ,
    async mounted(){
        this.project_id=this.$route.params.project_id;
        this.team_id=this.$route.params.team_id;
        this.fetch_project(this.project_id);
        this.fetchStudents();
    },
    methods:{
        showPopup() {
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
            this.students = [];
            this.fetch_project(this.project_id);
            this.fetchStudents();
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
                this.all_teams=data.teams;
            }
        },
        async fetchStudents() {
            try{
                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'X-Request-Source': 'all',
                        "Authentication-Token": this.token,
                    },
                });
                const data = await response.json();
                
                if (response.ok) {
                    for (let i = 0; i < data.length; i++) {
                        let found = false;
                        if (data[i].role == "student") {
                            for (let j = 0; j < this.all_teams.length; j++) {
                                for (let k=0; k < this.all_teams[j].students.length; k++) {
                                    if (this.all_teams[j].students[k].id == data[i].id) {
                                        found = true;
                                    }
                                }
                            }
                            if (!found) {
                                this.students.push(data[i]);
                            }
                        }
                    }
                    this.$emit('callFetch');
                }
            }catch(error){
                console.log(error);
            }
        },
        async assignStudent(student_id){
            try{
                const response = await fetch(`/api/assignstudent`, {
                    method: 'POST',
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
                    this.message = "Student assigned successfully!";
                    this.closePopup();
                    this.$emit('callFetch3');
                    alert(this.message);
                }
            }catch(error){
                console.log(error);
            }
        },
        async editProject(project_id){
            try {
                const formData = new FormData();
                formData.append('project_subtitle', this.formData.subtitle);
                formData.append('description', this.formData.description);
                formData.append('marks', this.formData.marks);
                formData.append('subject_id', this.formData.subject_id);
                formData.append('instructor_id', JSON.parse(localStorage.getItem('user')).id);

                const formDataJSON = {};
                formData.forEach((value, key) => {
                    formDataJSON[key] = value === '' || value === 'null' ? null : value;
                });

                const response = await fetch(`/api/project/${project_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify(formDataJSON),
                });
        
                if (response.ok) {
                    this.message = "Project updated successfully!";
                    this.closePopup();
                    this.$emit('callFetch3');
                    alert(this.message);
                } else if (response.status === 400) {
                    this.message = "Wrong data inputs!";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
        async editCategoryRequest(categoryId){
            const datas=JSON.parse(localStorage.getItem('user'))
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('image', this.formData.image);
                formData.append('json_data', JSON.stringify({
                    'user_id': datas.id,
                    'category_id': categoryId,
                    'method': 'PUT',
                  }));

                const response = await fetch('/api/manager_requests', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Updation request generated!";
                    this.closePopup();
                    this.$emit('callFetch4');
                    alert(this.message);
                } else if (response.status === 400) {
                    this.message = "Wrong data inputs!";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
    }
}