<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
const config = useRuntimeConfig()
const hankoApi = config.public.hankoApiUrl;

console.log('=== Hanko Configuration ===')
console.log('Initializing Hanko with API URL:', hankoApi)
console.log('Environment:', process.env.NODE_ENV)
console.log('========================')

const router = useRouter();

const redirectAfterLogin = () => {
  // successfully logged in, redirect to a page in your application
  router.push("/dashboard");
};

onMounted(async () => {
  if (process.client) {
    const { register } = await import('@teamhanko/hanko-elements');
    register(hankoApi)
      .catch((error) => {
        console.log('register(hankoApi) error',error)
        // handle error
      });
  }
});
</script>

<template>
 ddd {{ hankoApi }}ddd
 <hr/>
  www<hanko-auth />www
</template>