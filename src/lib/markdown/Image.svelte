<script lang="ts">
  import { getContext } from "svelte"

  const { href = "", title = undefined, text = "" }: { href?: string, title?: string, text?: string } = $props()
  const base: string = getContext("base")
</script>

<img src={new URL(href, base).toString()} {title} alt={text} />
