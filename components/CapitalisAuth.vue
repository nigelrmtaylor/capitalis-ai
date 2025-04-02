<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useHanko } from '#imports'

const router = useRouter();
const config = useRuntimeConfig();
const hanko = useHanko()
const hankoApi = ref(config.public.hankoApiUrl);

console.log('=== Hanko Configuration (CapitalisAuth) ===')
console.log('Runtime Config:', config.public)
console.log('Hanko Hook API:', hanko?.api)
console.log('Config hankoApiUrl:', hankoApi.value)
console.log('Environment:', process.env.NODE_ENV)
console.log('========================')

const redirectAfterLogin = () => {
  // successfully logged in, redirect to a page in your application
  router.push("/dashboard");
};

onMounted(async () => {
  if (process.client) {
    const { register } = await import('@teamhanko/hanko-elements');
    console.log('Registering Hanko with API URL:', hankoApi.value)
    register(hankoApi.value)
      .catch((error) => {
        console.log('register(hankoApi) error', error)
        // handle error
      });
  }
});
</script>

<template>
  <hanko-auth />
</template>