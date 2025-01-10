export default{
    props:['userType'],
    data(){
        return{
            isPopupVisible:false,
            message:'',
            formData:{
                subtitle:'',
                description:'',
                marks:null,
                subject_id:0,
                due_date:'',
            }
        }
    },
    template:`

    <div v-if="isPopupVisible" id="addnewproject" class="popup_2">

        <span class="close-button" @click="closePopup()">
            &times;
        </span>

        <div class="container mt-5">
            <h3>Add New Project</h3>

            <!-- Project Section -->
            <form id="projectForm" v-if="userType=='instructor' || userType=='admin'" @submit.prevent="registerProject()">
                <div class="row">
                    
                    <div class="col-md-12">
                        <div class="mb-3">
                            <label for="projectSubtitle" class="form-label">Project Title</label>
                            <input type="text" class="form-control" id="project_subtitle" v-model="formData.subtitle" placeholder="Enter project title" required>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="mb-3">
                            <label for="projectDetails" class="form-label">Project Description</label>
                            <textarea class="form-control" id="description" rows="3" v-model="formData.description" placeholder="Enter project details" required></textarea>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="projectMarks" class="form-label">Project Marks</label>
                            <input type="number" class="form-control" id="marks" v-model="formData.marks" placeholder="Enter project marks" required>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dueDate" class="form-label">Due Date</label>
                            <input type="date" class="form-control" id="due_date" v-model="formData.due_date" required>
                        </div>
                    </div>

                </div>

                <hr>

                <!-- Button to Submit the Project -->
                <button type="submit" class="btn btn-primary">Add New Project</button>
            </form>
        </div>
    </div>
    `,
    methods:{
        showPopup() {
            this.isPopupVisible = true;
        },
        closePopup() {
            this.clearForm();
            this.isPopupVisible = false;
        },clearForm() {
            this.formData = {
                name:'',
                subtitle:'',
                description:'',
                marks:null,
                subject_id:0,
            };
        },
        async registerProject() {
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
                    formDataJSON[key] = value;
                });

                const response = await fetch('/api/project', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token':localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify(formDataJSON),
                });
        
                if (response.ok) {
                    this.message = "Project added successfully!";
                    this.closePopup();
                    this.$emit('callFetch');
                    this.clearForm();
                    alert(this.message)
                } else if (response.status === 400) {
                    console.log(response.statusText);
                    console.log(await response.text());
                    alert(this.message)
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
        // async registerCategoryRequest() {
        //     const datas=JSON.parse(localStorage.getItem('user'))
        //     try {
        //         const formData = new FormData();
        //         formData.append('name', this.formData.name);
        //         formData.append('description', this.formData.description);
        //         formData.append('image', this.formData.image);
        //         formData.append('readCheckbox',"on")
        //         formData.append('json_data', JSON.stringify({
        //             'user_id': datas.id,
        //             'category_id':null,
        //             'method': 'POST',
        //           }));

        //         const response = await fetch('/api/manager_requests', {
        //             method: 'POST',
        //             headers: {
        //                 'Authentication-Token':localStorage.getItem('auth-token')
        //             },
        //             body: formData,
        //         });
        
        //         if (response.ok) {
        //             this.message = "Category addition request generated!";
        //             this.closePopup();
        //             this.$emit('callFetch');
        //             alert(this.message)
        //         } else if (response.status === 400) {
        //             this.message = "Category already exists!";
        //             console.log(response.statusText); // Should provide additional details about the error
        //             console.log(await response.text());
        //             alert(this.message)
        //         }
        //     } catch (err) {
        //         // Handle network or other errors
        //         this.message = "An error occurred. Please try again later.";
        //         console.error(err);
        //     }
        // },  
    }
}