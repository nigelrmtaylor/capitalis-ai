<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { register } from "@teamhanko/hanko-elements";
const config = useRuntimeConfig()
const hankoApi = config.public.hankoApiUrl;


const router = useRouter();

const redirectAfterLogin = () => {
  // successfully logged in, redirect to a page in your application
  router.push("/dashboard");
};

onMounted(() => {
  register(hankoApi)
    .catch((error) => {
      console.log('register(hankoApi) error',error)

      // handle error
    });
});
</script>

<template>
 ddd {{ hankoApi }}ddd
 <hr/>
  www<hanko-auth />www
</template>