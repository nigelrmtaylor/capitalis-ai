<script setup lang="ts">
definePageMeta({
  middleware: ["hanko-logged-in"],
});
</script>

<template>
Dashboard
  <LogoutButton />
</template>