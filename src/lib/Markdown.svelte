<script lang="ts">
  import Article from "./Article.svelte"
  import image from "./markdown/Image.svelte"
  import link from "./markdown/Link.svelte"
  import SvelteMarkdown from "@humanspeak/svelte-markdown"
  import { setContext } from "svelte"

  const { text, base }: { text: string, base: string } = $props()
  setContext("base", base)
</script>

<Article>
  <SvelteMarkdown source={text} renderers={{ link, image }} />
</Article>
