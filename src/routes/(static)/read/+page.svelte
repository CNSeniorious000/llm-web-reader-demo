<script lang="ts">
  import Left from "./Left.svelte"
  import Right from "./Right.svelte"
  import { browser } from "$app/environment"
  import { toast } from "svelte-sonner"
  import { queryParam } from "sveltekit-search-params"

  // @ts-ignore
  const url = queryParam("url", { defaultValue: "" }, { showDefaults: false })
</script>

<div class="m-4 flex flex-col items-center gap-3">
  <section class="max-w-lg w-full flex flex-row items-center gap-2 rounded bg-neutral-8/50 px-2.5 py-2 ring-(neutral-5 inset) transition-shadow focus-within:ring-1.2">
    <div class="i-mingcute-search-line text-neutral-5" />
    <input class="w-full bg-transparent text-sm font-mono outline-none placeholder-neutral-6" type="url" bind:value={$url} placeholder="any http url" data-sveltekit-keepfocus>
  </section>

  <div class="h-[calc(100vh-5.25rem)] w-full flex flex-col gap-3 [&>*]:(h-full w-full rounded bg-neutral-8/50) md:flex-row">
    {#if $url && browser}

      {#await fetch(`/api/proxy?url=${$url}`).then(res => {
        if (!res.ok)
          toast.warning(`${res.status} ${res.statusText}`)
        return res.text()
      })}
        <section class="center">
          <div class="i-svg-spinners-90-ring-with-bg" />
        </section>
        <section class="center">
          <div class="i-svg-spinners-90-ring-with-bg" />
        </section>
      {:then html}
        <Left url={$url} {html} />
        <Right url={$url} {html} />
      {:catch error}
        <!-- eslint-disable-next-line no-unused-vars -->
        {@const _ = toast.error(String(error))}
        <div class="center text-red">
          {error.message}
        </div>
      {/await}

    {:else}

      <section class="center text-neutral-6">
        Original Preview
      </section>
      <section class="center text-neutral-6">
        Extraction Result
      </section>

    {/if}
  </div>

</div>
