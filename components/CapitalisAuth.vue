<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { register } from "@teamhanko/hanko-elements";
const config = useRuntimeConfig()
const hankoApi = config.public.hankoApiUrl;

process.stdout.write('\n=== Hanko Configuration ===\n')
process.stdout.write(`Initializing Hanko with API URL: ${hankoApi}\n`)
process.stdout.write(`Environment: ${process.env.NODE_ENV}\n`)
process.stdout.write('========================\n')

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