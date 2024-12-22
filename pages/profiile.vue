<script setup lang="ts">
definePageMeta({
  middleware: ["hanko-logged-in"],
});
</script>

<template>

  This is the profile ß
  <hanko-profile />
  <LogoutButton />
</template>