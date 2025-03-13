<script lang="ts">
  import type { Props } from "./types"

  import ToggleGroup from "./ToggleGroup.svelte"
  import Highlight from "$lib/Highlight.svelte"
  import Markdown from "$lib/Markdown.svelte"
  import { copy } from "$lib/utils/copy"
  import { toMarkdown } from "$lib/utils/html2md"
  import { responseToTextStream } from "$lib/utils/iter"
  import { read } from "$lib/utils/reader"
  import { queryParameters, ssp } from "sveltekit-search-params"

  const { url, html }: Props = $props()
  const cleanedHtml = $derived(read(html, url))

  let llmResult = $state<string>()

  async function fetchLLMResult() {
    llmResult = ""
    const res = await fetch("/api/extract", { body: cleanedHtml, method: "POST" })
    for await (const delta of responseToTextStream(res))
      llmResult += delta
  }

  const q = queryParameters({ result: ssp.string("rendered"), engine: ssp.string("llm") }, { pushHistory: false })
  const type = $derived(q.result as "rendered" | "raw")
  const engine = $derived(q.engine as "llm" | "readability")

  const readabilityResult = $derived(cleanedHtml && toMarkdown(cleanedHtml))
  $effect(() => {
    cleanedHtml && fetchLLMResult()
  })
  const displayMarkdown = $derived(engine === "readability" ? readabilityResult! : llmResult!)
</script>

<section class="relative overflow-hidden">

  {#if !cleanedHtml}
    <div class="h-full w-full center text-neutral-6">
      empty :(
    </div>
  {:else}
    {#if type === "rendered"}

      <Markdown text={displayMarkdown} />

    {:else if type === "raw"}

      <div class="h-full w-full overflow-scroll px-3.5 py-3">
        <Highlight source={displayMarkdown} lang="markdown" />
      </div>

    {/if}
  {/if}

  <div class="absolute bottom-5 z-1 flex flex-row gap-1.5 md:left-5 <md:(w-full justify-center)">
    <ToggleGroup values={["llm", "readability"]} bind:choice={q.engine} />
    <ToggleGroup values={["rendered", "raw"]} bind:choice={q.result} />
    <button onclick={() => copy(displayMarkdown)} class="rounded-md bg-neutral-8 p-2 shadow-(md neutral-9/15) transition hover:bg-neutral-7" aria-label="Copy to clipboard">
      <div class="i-ri-file-copy-line"></div>
    </button>
  </div>

</section>
