
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
    .img {
        height: 60vh;
        align-self: center;
        box-shadow: 0px 2px 50px 1px #3d4a6a;
    }
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        background:  #EAEEFA;
        height: 100%;
    }
    .form {
        margin-left: 0px;   
        height: 80vh;
        width: 25vw;
    }
</style>
<template>
    <div class="login">
        <img src="../static/images/sky.jpg" class="img">
        <login-form @login="submit" class="form" :loading="loading"></login-form>
    </div>
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
