export default{
    props:['userType'],
    data(){
        return{
            isPopupVisible:false,
            message:'',
            formData:{
                title:'',
                description:'',
            }
        }
    },
    template:`

    <div v-if="isPopupVisible" id="addnewNotification" class="popup_2">

          <span class="close-button" @click="closePopup()">
            &times;
          </span>

          <div class="container mt-5">


                <h3>Add New Notification</h3><br>
             

                <form v-if="userType=='instructor' || userType=='admin'" @submit.prevent="registerNotifications()">
                  <!-- Notification Title -->
                  <div class="mb-3">
                    <label for="notificationTitle" class="form-label">Notification Title</label>
                    <input type="text" class="form-control" id="notificationTitle" v-model="formData.title" placeholder="Enter title">
                  </div>

                  <!-- Notification Details -->
                  <div class="mb-3">
                    <label for="notificationDetails" class="form-label">Notification Details</label>
                    <textarea class="form-control" id="notificationDetails" v-model="formData.description" rows="3" placeholder="Enter details"></textarea>
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn btn-primary">Submit</button>
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
        },
        clearForm() {
            this.formData.title='';
            this.formData.description='';
        },
        async registerNotifications() {
            try {
                const formData = new FormData();
                formData.append('notification_title', this.formData.title);
                formData.append('notification_details', this.formData.description);
                formData.append('created_by', JSON.parse(localStorage.getItem('user')).id);
                
                const formDataJSON = {};
                formData.forEach((value, key) => {
                    formDataJSON[key] = value;
                });

                const response = await fetch('/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token':localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify(formDataJSON),
                });
        
                if (response.ok) {
                    this.message = "Notification added successfully!";
                    this.closePopup();
                    this.$emit('callFetch2');
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