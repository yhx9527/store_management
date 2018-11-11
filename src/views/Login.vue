
<style scoped>
    .loginContainer{
        height: 100vh;
    }
    .middle{
        position: absolute;
        top:40%;
        left:50%;
        transform: translate(-50%,-50%);
    }
</style>
<template>
    <login-form @login="submit" class="middle" :loading="loading"></login-form>
</template>

<script>
    import LoginForm from '../components/LoginForm.vue'

    export default {
        components: {
            LoginForm
        },
        data: function () {
            return {
                loading: false
            }
        },
        methods: {
            async submit(form){
                console.log(form)
                this.loading = true
                let data = await this.$apis.user_login(form)
                this.loading = false
                if (data) {
                    this.$store.commit('setToken', data.token)
                    this.$store.commit({
                        type: 'setUserInfo',
                        userInfo: data.userInfo
                    })
                    this.$cookie.set('token', data.token, 0.5)
                    this.$router.replace({path: 'product'})
                }
                console.log('login', data)
            }
        }
    }
</script>
