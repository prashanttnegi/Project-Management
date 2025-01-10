export default{
    props:['userType'],
    data(){
        return{
            isPopupVisible:false,
            message:'',
            milestone:'',
            formData:{
                name:'',
                start_date:'',
                due_date:'',
                description:'',
            },
            milestone_id: null
        }
    },
    template:`
        <div v-if="isPopupVisible" class="popup_edit">
            <div class="container mt-5">
                <button @click="closePopup" class="close-button">&times;</button>
                <div class="card" style="overflow-y: auto; padding: 20px; border-radius: 10px; margin: 10px;">
                    <div v-if="message">{{message}}</div>
                    <div class="card-body">
                        <form @submit.prevent="editMilestone">
                            <div class="row g-3 align-items-center">
                                <h4>Edit Milestone</h4>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <label for="milestoneName-1" class="form-label">Milestone Name</label>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="name" v-model="formData.name" :placeholder="milestone.name">
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
                                        <input type="date" class="form-control" id="start_date" v-model="formData.start_date" :placeholder="milestone.start_date">
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
                                        <input type="date" class="form-control" id="due_date" v-model="formData.due_date" :placeholder="milestone.due_date">
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
                                        <textarea class="form-control" id="description" v-model="formData.description" rows="3" :placeholder="milestone.description"></textarea>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <button type="submit" value="Upload" class="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods:{
        showPopup(milestone_id) {
            this.fetch_milestone(milestone_id)
            this.milestone_id=milestone_id
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
        async editMilestone() {
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

                const response = await fetch(`/api/milestones/${this.milestone_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataJSON),
                });
        
                if (response.ok) {
                    this.message = "Milestone updated successfully!";
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
        async fetch_milestone(milestone_id){
            try{
                const res=await fetch(`/api/milestones/${milestone_id}`,{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data= await res.json()
                this.milestone=data
            }catch(error){
                console.log('Error:',error)
            }
        }  
    }
}