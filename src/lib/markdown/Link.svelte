<script lang="ts">
  import type { Snippet } from "svelte"

  import { getContext } from "svelte"

  const { href = "", title = undefined, children }: { href?: string, title?: string, children?: Snippet } = $props()
  const base: string = getContext("base")
</script>

<a href={new URL(href, base).toString()} {title} target="_blank">{@render children?.()}</a>
