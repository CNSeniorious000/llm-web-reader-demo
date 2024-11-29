<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte"
  import Highlight from "$lib/Highlight.svelte"
  import Markdown from "$lib/Markdown.svelte"
  import { copy } from "$lib/utils/copy"
  import { toMarkdown } from "$lib/utils/html2md"
  import { responseToTextStream } from "$lib/utils/iter"
  import { read } from "$lib/utils/reader"
  import { queryParam } from "sveltekit-search-params"

  export let html: string

  $: cleanedHtml = read(html)
  $: readabilityResult = cleanedHtml && toMarkdown(cleanedHtml)

  $: cleanedHtml && fetchLLMResult()

  let llmResult: string

  async function fetchLLMResult() {
    llmResult = ""
    const res = await fetch("/api/extract", { body: JSON.stringify({ html, markdown: readabilityResult }), method: "POST" })
    for await (const delta of responseToTextStream(res))
      llmResult += delta
  }

  // @ts-ignore
  const type = queryParam<"rendered" | "raw">("result", { defaultValue: "rendered" })

  // @ts-ignore
  const engine = queryParam <"readability" | "llm">("engine", { defaultValue: "llm" })

  $: displayMarkdown = $engine === "readability" ? readabilityResult! : llmResult
</script>

<section class="relative overflow-hidden">

  {#if !cleanedHtml}
    <div class="h-full w-full center text-neutral-6">
      empty :(
    </div>
  {:else}
    {#if $type === "rendered"}

      <Markdown text={displayMarkdown} />

    {:else if $type === "raw"}

      <div class="h-full w-full overflow-scroll px-3.5 py-3">
        <Highlight source={displayMarkdown} lang="markdown" />
      </div>

    {/if}
  {/if}

  <div class="absolute bottom-5 z-1 flex flex-row gap-1.5 md:left-5 <md:(w-full justify-center)">
    <ToggleGroup values={["llm", "readability"]} bind:choice={$engine} />
    <ToggleGroup values={["rendered", "raw"]} bind:choice={$type} />
    <button on:click={() => copy(displayMarkdown)} class="rounded-md bg-neutral-8 p-2 shadow-(md neutral-9/15) transition hover:bg-neutral-7">
      <div class="i-ri-file-copy-line" />
    </button>
  </div>

</section>
