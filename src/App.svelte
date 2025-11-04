<script lang="ts">
  import { Router, type RouteConfig } from '@mateothegreat/svelte5-router'
  import Home from './lib/routes/Home.svelte'
  import Builder from './lib/routes/Builder.svelte'


  const routes: RouteConfig[] = [
    {
      component: Home
    },
    {
      path: '/factions/(?<name>.*)',
      component: Builder
    }
  ]
</script>

<main>
  <Router { routes } />
</main>
