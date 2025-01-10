export default{
    data(){
        return{
            role:localStorage.getItem('role')
        }
    },
    template:`
        <li class="nav-item" v-if="role=='admin'">
            <router-link to="/instructor_dashboard" class="nav-link" exact-active-class="active" style="color: white;"> Instructor Dashboard </router-link>
        </li>
        <li class="nav-item">
            <button @click="logout" class="nav-link" style="color: white;"> Logout </button>
        </li>
    `,
    methods:{
        logout(){
            localStorage.removeItem('user')
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$store.state.isAuthenticated=false
            this.$store.state.user=null
            this.$store.state.role=null
            fetch('/logout').then((res)=>{
                if (res.ok){
                    this.$router.push({name:'login'})
                }
            })
        },
        async downloadReport(){
            const res= await fetch('/download_csv',{
                method:'GET',
                headers:{
                    'Authentication-Token':localStorage.getItem('auth-token')
                }
            })
            const data=await res.json()
            if (res.ok){
                const taskId=data['task_id']
                const intv=setInterval(async()=>{
                    const csv_res=await fetch(`/get_csv/${taskId}`)
                    if (csv_res.ok){
                        clearInterval(intv)
                        window.location.href=`/get_csv/${taskId}`
                        alert("Report downloaded successfully")
                    }
                },1000)
            }else{
                console.log(data)
                alert('You are not authorized!')
            }
        }
    }
}