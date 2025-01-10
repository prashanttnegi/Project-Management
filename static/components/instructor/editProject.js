export default{
    props:
        ['userType']
    ,
    data(){
        return{
            isPopupVisible:false,
            message:'',
            project_id:'',
            project:[],
            formData:{
                subtitle:'',
                description:'',
                marks:null,
                subject_id:null,
                due_date:null,
            }
        }
    },
    template:
        `
            <div v-if="isPopupVisible" class="popup_2">
                <div class="container mt-5">
                    <button @click="closePopup" class="close-button">&times;</button>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Update Project</h3>
                            <form v-if="userType=='admin'" @submit.prevent="editProject(project_id)">
                                <div class="row">
                
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label for="projectSubtitle" class="form-label">Project Title</label>
                                            <input type="text" class="form-control" id="project_subtitle" v-model="formData.subtitle" :placeholder="project.project_subtitle">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label for="projectDetails" class="form-label">Project Description</label>
                                            <textarea class="form-control" id="description" rows="3" v-model="formData.description" :placeholder="project.description"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="projectMarks" class="form-label">Project Marks</label>
                                            <input type="number" class="form-control" id="marks" v-model="formData.marks" :placeholder="project.marks">
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dueDate" class="form-label">Due Date</label>
                                            <input type="date" class="form-control" id="due_date" v-model="formData.due_date">
                                        </div>
                                    </div>

                                </div>
                                <button type="submit" value="Upload" class="btn btn-primary">Update</button>
                            </form>
                            <form v-else-if="userType=='instructor'" @submit.prevent="editProject(project_id)">
                                <div class="row">                    

                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label for="projectSubtitle" class="form-label">Project Title</label>
                                            <input type="text" class="form-control" id="project_subtitle" v-model="formData.subtitle" :placeholder="project.project_subtitle">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label for="projectDetails" class="form-label">Project Description</label>
                                            <textarea class="form-control" id="description" rows="3" v-model="formData.description" :placeholder="project.description"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="projectMarks" class="form-label">Project Marks</label>
                                            <input type="number" class="form-control" id="marks" v-model="formData.marks" :placeholder="project.marks">
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dueDate" class="form-label">Due Date</label>
                                            <input type="date" class="form-control" id="due_date" v-model="formData.due_date">
                                        </div>
                                    </div>

                                </div>
                                <button type="submit" value="Upload" class="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `
    ,
    methods:{
        showPopup(project_id) {
            this.fetch_project(project_id)
            this.project_id=project_id
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
            this.clearForm();
        },
        clearForm() {
            this.formData = {
                subtitle:'',
                description:'',
                marks:null,
                subject_id:null,
                due_date:null,
            };
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
            }
        },
        async editProject(project_id){
            try {
                const formData = new FormData();
                formData.append('project_subtitle', this.formData.subtitle);
                formData.append('description', this.formData.description);
                formData.append('marks', this.formData.marks);
                formData.append('subject_id', this.formData.subject_id);
                formData.append('due_date', this.formData.due_date);
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