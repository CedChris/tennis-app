<template>
  <svg
    width="320"
    height="100"
    viewBox="0 0 320 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Logo Tennis Club Evin Malmaison"
  >
    <defs>
      <radialGradient id="ballGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#d4f06f" />
        <stop offset="100%" stop-color="#7bb92f" />
      </radialGradient>
    </defs>

    <!-- Balle de tennis stylisée -->
    <circle cx="40" cy="50" r="30" fill="url(#ballGradient)" stroke="#5a7d1a" stroke-width="3" />
    <path d="M15 35 Q40 40 65 35" stroke="#5a7d1a" stroke-width="3" fill="none" />
    <path d="M15 65 Q40 60 65 65" stroke="#5a7d1a" stroke-width="3" fill="none" />

    <!-- Texte du logo -->
    <text
      x="90"
      y="45"
      font-family="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      font-weight="700"
      font-size="28"
      fill="#2c3e50"
      letter-spacing="2"
    >
      Tennis Club
    </text>
    <text
      x="90"
      y="75"
      font-family="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      font-weight="600"
      font-size="18"
      fill="#7bb92f"
      letter-spacing="1.5"
    >
      Évin Malmaison
    </text>
  </svg>
</template>

<script>
export default {
  name: "Logo",
};
</script>

<style scoped>
svg {
  display: block;
}
</style>