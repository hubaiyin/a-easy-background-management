import VueRouter from "vue-router";

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import('../components/register.vue')
        },
        {
            name: 'login',
            path: '/login',
            component: () => import('../components/login.vue')
        },
        {
            name: 'manage',
            path: '/manage',
            component: () => import('../pages/manage.vue'),
            children: [
                {
                    name: 'regist',
                    path: 'revise',
                    component: () => import('../pages/regist.vue'),
                    props({ params: { obj, change } }) {
                        return {
                            obj,
                            change
                        }
                    }
                }
            ]
        }
    ]
})