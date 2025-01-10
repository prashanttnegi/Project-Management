import NotLoggedIn  from "./NotLoggedIn.js"
import LoggedIn from "./LoggedIn.js"

const Header={
    data(){
      return{
        
      }
    },
    template:`
      <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div class="container-fluid">
          
          <router-link to="/admin_dashboard" v-if="role" class="navbar-brand fst-italic">
            <img src="/static/images/IITM.png" style="width: 55px; " alt="logo" />
          </router-link>

          <router-link to="/instructor_dashboard" v-else-if="instructor_role" class="navbar-brand fst-italic">
            <img src="/static/images/IITM.png" style=" width: 55px; " alt="logo" />
          </router-link>
          <router-link to="/" v-else class="navbar-brand">
            <img src="/static/images/IITM.png" style=" width: 55px; " alt="logo"/>
          </router-link>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="offcanvas offcanvas-end" tabindex="-1" style="width:70%" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

            <div class="offcanvas-body">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">  
                          
                <li class="nav-item" v-if="student_role">
                  <router-link to="/student_dashboard" class="nav-link"  exact-active-class="active" style="color: white;"> Dashboard </router-link>
                </li>
                <li class="nav-item" v-else-if="role">
                  <router-link to="/admin_control_dashboard" class="nav-link"  exact-active-class="active" style="color: white;"> Dashboard </router-link>
                </li>
                <li class="nav-item" v-else-if="instructor_role">
                  <router-link to="/instructor_dashboard" class="nav-link"  exact-active-class="active" style="color: white;"> Dashboard </router-link>
                </li>
                <li class="nav-item" v-else>
                  <router-link to="/" class="nav-link"  exact-active-class="active" style="color: white;"> Home </router-link>
                </li>

                <LoggedIn v-if="isLoggedIn"/>
              
                <NotLoggedIn v-else/>
                
                
              </ul>

              <!-- Search Bar

              <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" v-model="searchBar" aria-label="Search">
                <button class="btn btn-outline-success" @click='searching' type="submit">Search</button>
              </form>

              -->



              <div class="d-flex"  >
                <span id="role" style="background-color: #713f3f; padding: 8px; color: white; border-top-left-radius: 31px; border-bottom-right-radius: 31px; padding-left: 50px; padding-right: 50px; float: right;">
                  <div v-if="role">Admin</div>
                  <div v-else-if="instructor_role">Instructor</div>
                  <div v-else-if="student_role">Student</div>
                  <div v-else>Login First</div>
                </span>
              </div>



            </div>
          </div>
        </div>
      </nav>
    `,  
    components:{
        LoggedIn,
        NotLoggedIn,
    },
    computed:{
      isLoggedIn() {
        return this.$store.state.isAuthenticated;
      },
      role(){
        return this.$store.state.role=='admin';
      },
      instructor_role(){
        return this.$store.state.role=='instructor';
      },
      student_role(){
        return this.$store.state.role=='student';
      }
    },
    methods:{
      
    }

}

export default Header
