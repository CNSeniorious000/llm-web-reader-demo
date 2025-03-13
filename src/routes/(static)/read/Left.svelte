<script lang="ts">
  import type { Props } from "./types"

  import ToggleGroup from "./ToggleGroup.svelte"
  import Article from "$lib/Article.svelte"
  import Highlight from "$lib/Highlight.svelte"
  import { getBody } from "$lib/utils/html"
  import { queryParameters, ssp } from "sveltekit-search-params"

  const { url, html }: Props = $props()

  const q = queryParameters({ preview: ssp.string("iframe") }, { pushHistory: false })
  const type = $derived(q.preview as "iframe" | "prose" | "code")
</script>

<section class="relative overflow-hidden">

  {#if type === "iframe"}

    <iframe class="h-full w-full bg-white" srcdoc={html.replace("<head>", `<head><base href="${url}">`)} title="preview"></iframe>

  {:else if type === "prose"}

    <Article>
      {@html getBody(html)}
    </Article>

  {:else if type === "code"}

    <div class="h-full w-full overflow-scroll px-3.5 py-3">
      <Highlight source={getBody(html)} lang="html" />
    </div>

  {/if}

  <div class="absolute bottom-5 z-1 flex flex-row gap-1.5 md:right-5 <md:(w-full justify-center)">
    <ToggleGroup values={["iframe", "prose", "code"]} bind:choice={q.preview} />
  </div>

</section>
