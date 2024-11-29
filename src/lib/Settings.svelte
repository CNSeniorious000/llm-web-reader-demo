<script context="module">
  import { writable } from "svelte/store"

  export const open = writable(false)
</script>

<script lang="ts">
  import { Combobox, Dialog, Label } from "bits-ui"
  import { fade, fly } from "svelte/transition"

  const baseURLs = [
    "https://api.openai.com/v1",
    "https://api.groq.com/openai/v1",
    "https://demo.promplate.dev",
  ]

  let baseURL: string
</script>

<Dialog.Root preventScroll={false} bind:open={$open}>
  <Dialog.Portal class="pointer-events-none fixed inset-0 center *:pointer-events-auto">
    <Dialog.Overlay transition={fade} transitionConfig={{ duration: 300 }} class="absolute inset-0 bg-neutral-950/20" />

    <Dialog.Content transition={fly} transitionConfig={{ duration: 300, y: 8 }} class="m-10 max-h-lg max-w-md flex flex-col gap-2.5 overflow-scroll rounded bg-neutral-9 p-4 ring-(1.2 neutral-8 inset) backdrop-blur-lg">
      <div class="flex flex-row items-center justify-between">
        <Dialog.Title class="text-lg text-white">LLM Settings</Dialog.Title>
        <Dialog.Close class="rounded p-1.5 outline-none transition hover:(bg-red-4/15 text-red-4/90) focus-visible:ring-(1.2 red-4/90)"><div class="i-ic-round-close" /></Dialog.Close>
      </div>
      <Dialog.Description class="mb-2 text-sm text-neutral-5">
        Use your own OpenAI API for LLM calls, or use the default API provided by us.
      </Dialog.Description>

      <div class="flex flex-col gap-2 overflow-y-scroll text-sm [&>label]:(mt-1.5 ws-nowrap text-neutral-1) [&>input]:(w-full rounded-sm bg-transparent px-2.5 py-1.5 outline-none ring-1.2 ring-neutral-8 ring-inset transition-shadow placeholder-neutral-6) [&>input:hover]:ring-neutral-7 [&>input:focus]:!ring-neutral-5">

        <Label.Root for="password">API Key</Label.Root>
        <input id="password" type="password" placeholder="sk-">

        <Combobox.Root bind:inputValue={baseURL} preventScroll={false} portal="body">
          <Label.Root for="baseurl">Base URL</Label.Root>
          <Combobox.Input id="baseurl" type="url" placeholder="https://api.openai.com/v1" />
          <Combobox.Content side="bottom" sideOffset={1.2} transition={fly} transitionConfig={{ y: 3, duration: 200 }} class="rounded-sm bg-neutral-8 text-sm">
            {#each baseURLs.includes(baseURL) ? baseURLs : baseURLs.filter(url => url.includes(baseURL)) as url}
              <Combobox.Item value={url} label={url} class="cursor-pointer px-2.5 py-1 text-sm [&[data-highlighted]]:bg-neutral-7/50">
                {url}
              </Combobox.Item>
            {/each}
          </Combobox.Content>
        </Combobox.Root>

        <Label.Root for="model">Model</Label.Root>
        <input id="model" type="text" placeholder="gpt-4o-mini">

      </div>

    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
