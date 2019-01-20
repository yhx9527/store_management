
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
                this.loading = true
                let data = await this.$apis.user_login(form)
                this.loading = false
                if (data) {
                    this.$store.commit('setUser', data)
                    this.$router.replace({path: 'product'})                    
                }
                console.log('login', data)
            }
        }
    }
</script>
