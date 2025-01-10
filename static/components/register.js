export default{
    data(){
        return{
            error:null,
            credential:{
                name: null,
                email:null,
                password:null,
                role:"student",
            },
            isLoading:true,
            confirmPassword:'',
        }
    },
    template:`
        <div class="container main-body">
            <div class="row justify-content-center">

                <div class="col-md-6" style="margin-top:-20px">
                    <div class="card">
                        <div class="card-body">
                            <p v-if="error" class="warning" style="color:red">{{error}}</p>
                            <h3 class="card-title">Register</h3>
                            <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" v-model="credential.role" value="student" class="btn-check btn-warning" name="role" id="role_student" autocomplete="off" checked>
                                <label class="btn btn-outline-success" for="role_student">Student Registration</label>
                                <input type="radio" v-model="credential.role" value="instructor" class="btn-check" name="role" id="role_instructor" autocomplete="off">
                                <label class="btn btn-outline-success" for="role_instructor">Instructor Registration</label>
                            </div>
                            <form id="register-form" @submit.prevent="registerUser()" style="margin-top:10px">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="name" v-model='credential.name' class="form-control" name="name" id="name" placeholder="Enter your name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" v-model='credential.email' class="form-control" name="email" id="email" placeholder="Enter your email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" v-model='credential.password' class="form-control" name="password" id="password" placeholder="Enter your password" required>
                                </div>
                                <div class="mb-3">                                          
                                    <label for="Confirm-password" class="form-label">Repeat-Password</label>
                                    <input type="password" class="form-control" name="re-password" id="re-password" placeholder="Enter your password again" required>
                                    <div class="input-container">
                                        <div class="errorPopup" id="popup">
                                            <p>Passwords do not match</p>
                                        </div> 
                                    </div>
                                </div>
                                <div id="button-container">
                                    <button type="submit" class="btn btn-primary" id="submit" style="margin-bottom:10px" >Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,mounted() {
        const passInput = document.getElementById('password');
        const repassInput = document.getElementById('re-password');
        const submitButton = document.getElementById('submit');
        const popup = document.getElementById('popup');
      
        passInput.addEventListener('keyup', this.confirmPass);
        repassInput.addEventListener('keyup', this.confirmPass);
      
        repassInput.addEventListener('keyup', () => {
          if (passInput.value === repassInput.value) {
            popup.style.display = 'none';
            submitButton.disabled=false;
          } else {
            popup.style.display = 'block';
            submitButton.disabled=true;
          }
        });
    },
    computed:{
        error(){
            return this.error;
        },
    },
    methods:{        
        async registerUser() {
        
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.credential),
                });
                
                if (response.ok) {
                    this.$router.push('/login');
                } else if (response.status === 400 || response.status === 402) {
                    const data = await response.json();
                    this.error = data.error;
                    console.error('Error:', data.error);
                }
            } catch (err) {
                this.error = "An error occurred. Please try again later.";
                console.error(err);
            }
        },         
    },
    beforeDestroy() {
        const passInput = document.getElementById('password');
        const repassInput = document.getElementById('re-password');
      
        passInput.removeEventListener('keyup', this.confirmPass);
        repassInput.removeEventListener('keyup', this.confirmPass);
    }
}