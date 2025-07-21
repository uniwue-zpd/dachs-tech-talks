<template>
  <button
      :class="classes"
      :aria-label="ariaLabel"
      :title="title"
      @click="toggleTheme"
      :style="componentStyle"
      type="button"
  >
    <slot />
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        class="theme-toggle__expand"
        viewBox="0 0 24 24"
        v-bind="svgProps"
    >
      <clipPath :id="`${idPrefix || ''}a`">
        <path d="M0-11h19A1 1 0 0 0 36 2v22H0Z" />
      </clipPath>
      <g :clip-path="`url(#${idPrefix || ''}a)`">
        <circle cx="12" cy="12" r="6.4" />
        <path
            d="M13.7 2.7c0 1-.7 1.8-1.7 1.8s-1.8-.8-1.8-1.8S11 1 12 1s1.7.7 1.7 1.7zm-3.5 19.5c0-1 .8-1.7 1.8-1.7s1.6.6 1.6 1.6-.7 1.8-1.7 1.8-1.8-.8-1.8-1.8zm11.5-8c-1 0-1.7-.7-1.7-1.7s.7-1.8 1.7-1.8 1.8.8 1.8 1.8-.9 1.6-1.9 1.6zM2.2 10.7c1 0 1.8.8 1.8 1.8s-.8 1.7-1.8 1.7-1.7-.7-1.7-1.7.7-1.8 1.7-1.8zm4.4-5.3c0 1-.8 1.7-1.7 1.7-1 0-1.8-.7-1.8-1.7s.8-1.8 1.8-1.8 1.7.8 1.7 1.8zm12.5 16c-1 0-1.8-.8-1.8-1.8s.8-1.7 1.8-1.7 1.7.7 1.7 1.7-.8 1.8-1.7 1.8zm1.8-16c0 1-.8 1.7-1.8 1.7s-1.8-.8-1.8-1.7c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8zm-16 12.4c1 0 1.7.8 1.7 1.8s-.7 1.7-1.7 1.7-1.8-.8-1.8-1.7c0-1 .8-1.8 1.8-1.8z"
        />
      </g>
    </svg>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  duration?: number;
  reversed?: boolean;
  title?: string;
  forceMotion?: boolean;
  idPrefix?: string;
  ariaLabel?: string;
  className?: string;
  svgProps?: object;
}>(), {
  duration: 500,
  reversed: false,
  title: 'Toggle theme',
  forceMotion: false,
  idPrefix: 'theme-toggle-expand-',
  ariaLabel: 'Toggle theme',
  className: '',
  svgProps: () => ({}),
});

const colorMode = useColorMode();
const isToggled = computed(() => colorMode.value === 'dark');

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const classes = computed(() => [
  'theme-toggle',
  isToggled.value ? 'theme-toggle--toggled' : 'theme-toggle--untoggled',
  props.forceMotion ? 'theme-toggle--force-motion' : '',
  props.reversed ? 'theme-toggle--reversed' : '',
  props.className,
].join(' ').trim());

const componentStyle = computed(() => ({
  '--theme-toggle__expand--duration': `${props.duration}ms`,
}));
</script>

<style>
.theme-toggle {
  --theme-toggle__expand--duration: 500ms;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 24px; /* Example size, adjust as needed */
  color: var(--color-zinc-800);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dark .theme-toggle {
  color: var(--color-zinc-200);
}

.theme-toggle.theme-toggle--reversed .theme-toggle__expand {
  transform: scale(-1, 1);
}

.theme-toggle__expand g circle,
.theme-toggle__expand g path {
  transform-origin: center;
  transition: transform calc(var(--theme-toggle__expand--duration) * 0.65)
  cubic-bezier(0, 0, 0, 1.25) calc(var(--theme-toggle__expand--duration) * 0.35);
}

.theme-toggle__expand :first-child path {
  transition-property: transform, d;
  transition-duration: calc(var(--theme-toggle__expand--duration) * 0.6);
  transition-timing-function: cubic-bezier(0, 0, 0.5, 1);
}

.theme-toggle--toggled .theme-toggle__expand g circle {
  transform: scale(1.6);
  transition-delay: 0s;
}

.theme-toggle--toggled .theme-toggle__expand g path {
  transform: scale(0.75);
  transition-delay: 0s;
}

.theme-toggle--toggled .theme-toggle__expand :first-child path {
  d: path("M0 0h14A1 1 0 0027 12v12H0Z");
  transition-delay: calc(var(--theme-toggle__expand--duration) * 0.4);
  transition-timing-function: cubic-bezier(0, 0, 0, 1.25);
}

@supports not (d: path("")) {
  .theme-toggle--toggled .theme-toggle__expand :first-child path {
    transform: translate3d(-5px, 11px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle:not(.theme-toggle--force-motion) * {
    transition: none !important;
  }
}
</style>
