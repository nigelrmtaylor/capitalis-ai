<template>
  <div class="hanko-auth">
    <hanko-auth />
  </div>
</template>

<style>
.hanko-auth {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
}

:root {
  --hanko-primary-color: rgb(var(--v-theme-primary));
  --hanko-primary-button-background: rgb(var(--v-theme-primary));
  --hanko-primary-button-hover-background: rgb(var(--v-theme-primary-darken-1));
  --hanko-primary-button-text-color: rgb(var(--v-theme-on-primary));
  --hanko-font-family: var(--font-family);
}
</style>
