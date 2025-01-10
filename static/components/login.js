export default {
    template:`
        <div class="container main-body">
            <div class="row justify-content-center">
            <div class="col-md-6" >
            <img src="/static/images/trackingimage.png" style=" width:85%;text-align: center;" alt="logo" />
            </div>
                <div class="col-md-6" >
                    <div class="card" style="    background-color: #d1d21e26;    border: 1px solid white;">
                        <div class="card-body"    style="text-align: center;"> 
                            <p v-if="error" class="warning" style="color:red">{{error}}</p>
                            <h3 class="card-title" style="font-size: 41px;    font-weight: 700;    color: #713f3f;">ProTrackr</h3>
                            <h3 class="card-title">Login</h3>
                            <form>
                                <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" style="float: left;">Email address</label>
                                <input type="email" v-model='credential.email' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label" style="float: left;">Password</label>
                                <input type="password" v-model='credential.password' class="form-control" id="exampleInputPassword1">
                                </div>
                                <button @click='loginUser' class="btn btn-primary" style="width: 90%; border: 2px solid #533636; background-color: #533636;">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            credential:{
                email:null,
                password:null
            },
            error:null
        }
    },
    methods:{
        async loginUser(){
            try{
                const res=await fetch('/user_login',{
                    method:'POST',
                    body:JSON.stringify(this.credential),
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                const data=await res.json()
                if(res.ok){
                    localStorage.setItem('auth-token',data.token)
                    localStorage.setItem('role',data.role)
                    localStorage.setItem('user',JSON.stringify(data))
                    this.$store.state.isAuthenticated=true
                    this.$store.state.role=data.role
                    this.$store.state.user=data
                    const datas= this.$store.state.user
                    if (datas.role.includes('admin')){
                        this.$router.push({name:'admin_control_dashboard'})
                    }else if (datas.role.includes('instructor')){
                        this.$router.push({name:'instructor_dashboard'})
                    }else{
                        this.$router.push({name:'student_dashboard'})
                    }
                }else{
                    this.error=data.error
                    console.log(data)
                }
            }catch(error){
                console.log(error)
            }
        },
    }
}
