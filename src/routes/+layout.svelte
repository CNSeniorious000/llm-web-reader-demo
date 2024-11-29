<script>
  import "@fontsource-variable/jetbrains-mono"
  import "@unocss/reset/tailwind.css"
  import "uno.css"

  import Settings from "$lib/Settings.svelte"
  import Seo from "sk-seo"
  import { Toaster } from "svelte-sonner"
</script>

<Seo
  title="LLM Web Reader Demo"
  description="A demo for using LLM to extract information from web pages"
/>

<Settings />

<Toaster theme="dark" toastOptions={{ class: "text-xs font-mono" }} />

<slot />

<style>
  :global(html) {
    --uno: bg-neutral-9 text-neutral-3 overflow-x-hidden font-sans;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }

  :global(body) {
    --uno: relative flex flex-col items-center items-stretch;
  }

  :global(body)::-webkit-scrollbar {
    --uno: bg-neutral-9 w-1 sm:w-1.5 md:w-2 lg:w-2.5 xl:w-3 2xl:w-3.5;
  }

  :global(body)::-webkit-scrollbar-thumb {
    --uno: rounded-l-sm bg-neutral-7/30 hover:bg-neutral-7/70;
  }

  :global(body *)::-webkit-scrollbar {
    --uno: hidden;
  }
</style>
