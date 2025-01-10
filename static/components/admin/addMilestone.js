export default{
    props:['userType'],
    data(){
        return{
            isPopupVisible:false,
            message:'',
            project:'',
            formData:{
                name:'',
                start_date:'',
                due_date:'',
                description:'',
            },
            project_id: null
        }
    },
    template:`
        <div v-if="isPopupVisible" class="popup_2">
            <div class="container mt-5">
                <button @click="closePopup" class="close-button">&times;</button>
                <div class="card" style="max-height: 60vh; overflow-y: auto;">
                    <div v-if="message">{{message}}</div>
                    <div class="card-body">
                        <form @submit.prevent="registerMilestone">
                            <div class="row g-3 align-items-center">
                                <h4>Add Milestone</h4>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <label for="milestoneName-1" class="form-label">Milestone Name</label>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Enter milestone name" required>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <label for="startDate-1" class="form-label">Start Date</label>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <input type="date" class="form-control" id="start_date" v-model="formData.start_date" required>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <label for="endDate-1" class="form-label">End Date</label>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <input type="date" class="form-control" id="due_date" v-model="formData.due_date" required>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <label for="milestoneDetails-1" class="form-label">Milestone Details</label>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <textarea class="form-control" id="description" v-model="formData.description" rows="3" placeholder="Enter milestone details" required></textarea>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <button type="submit" value="Upload" class="btn btn-primary">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    async mounted(){
        // this.fetch_project(this.project_id)
    },
    methods:{
        showPopup(project_id) {
            this.project_id=project_id
            this.isPopupVisible = true;
        },
        closePopup() {
            this.clearForm();
            this.isPopupVisible = false;
        },
        clearForm() {
            this.formData.name='';
            this.formData.start_date='';
            this.formData.due_date='';
            this.formData.description='';
        },
        async registerMilestone() {
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('start_date', this.formData.start_date);
                formData.append('due_date', this.formData.due_date);
                formData.append('description', this.formData.description);
                formData.append('project_id', this.project_id);
                formData.append('created_by', JSON.parse(localStorage.getItem('user')).id);

                const formDataJSON = {};
                formData.forEach((value, key) => {
                    formDataJSON[key] = value;
                });

                const response = await fetch('/api/milestones', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataJSON),
                });
        
                if (response.ok) {
                    this.message = "Milestone created successfully!";
                    alert(this.message)
                    this.closePopup();
                    this.$emit('callFetch');
                } else if (response.status === 400) {
                    this.message = "An error occurred. Please try again later.";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
        async fetch_project(project_id){
            try{
                const res=await fetch(`/api/project/${project_id}`,{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data= await res.json()
                this.project=data
            }catch(error){
                console.log('Error:',error)
            }
        }  
    }
}