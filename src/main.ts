import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'


const app = mount(App, {
  // The 'app' should always exist; fallback to 'document.body' as a safeguard
  target: document.getElementById('app') ?? document.body,
})

export default app
