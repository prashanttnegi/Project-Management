import store from './store.js'
import login from './components/login.js'
import view_milestone from './components/instructor/view_milestones.js'
import adminDashboard from './components/admin/adminDashboard.js'
import admincontrolDashboard from './components/admin/admincontrolDashboard.js'
import register from './components/register.js'
import project_details from './components/student/project_details.js'
import instructorDashboard from './components/instructor/instructorDashboard.js'
import studentDashboard from './components/student/studentDashboard.js'
import GitHubCommits from './components/instructor/github.js'
import team_details from './components/instructor/team_details.js'

const routes=[
    { path: '/', component: login, name: 'login' },
    { path: '/admin_dashboard', component: adminDashboard, name: 'admin_dashboard' },
    { path: '/student_dashboard', component: studentDashboard, name: 'student_dashboard' },
    { path: '/admin_control_dashboard', component: admincontrolDashboard, name: 'admin_control_dashboard' },
    { path: '/login', component: login, name: 'Login' },
    { path: '/register', component: register, name: 'register' },
    { path: '/project_details/:project_id', component: project_details, name: 'project_details' ,props: true},
    { path: '/instructor_dashboard', component: instructorDashboard, name: 'instructor_dashboard' },
    { path: '/view_milestone', component: view_milestone, name: 'view_milestone' },
    { path: '/github/commits', component: GitHubCommits, name: 'github_commits' },
    { path: '/team_details/:team_id/:project_id', component: team_details, name: 'team_details', props: true},
   
]

const router= VueRouter.createRouter({
    history:VueRouter.createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.name!=='register' && to.name!=='Login' &&to.name!=='about') {
        if (!store.state.isAuthenticated){
            next({ name: 'login' })
        } 
        else if (to.name =='admin_control_dashboard'){

            if (store.state.role !== 'admin'){
                next({name:'login'})
            } else{
                next()
            }
        }
        else if (to.name=='instructor_dashboard'){

            if (store.state.role !== 'instructor' && store.state.role !== 'admin'){
                next({name:'login'})
            } else{
                next()
            }

        }else if (to.name=='student_dashboard'){

            if (store.state.role !== 'student'){
                next({name:'login'})
            } else{
                next()
            }
        }else{
            next()
        }
    } else {
        next()
    }
})

export default router
