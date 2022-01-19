<script>
	import { onMount } from 'svelte';
	export let initialview = "main";
	export let addonname = "template"
	
	let Addon;
	const sleep = ms => new Promise(f => setTimeout(f, ms));

	async function loadAddon(){
		if (addonname == "template") {
			Addon = (await import('./template/addon-template.svelte')).default;
		}
		else if (addonname == "wol") {
			Addon = (await import('./wol/addon-wol.svelte')).default;
		}
		
		else if (addonname == "nscheduler") {
			Addon = (await import('./nomiescheduler/addon-nscheduler.svelte')).default;
		}
		else if (addonname == "nblockly") {
			Addon = (await import('./nomieblockly/addon-nblockly.svelte')).default;
		}
		else {
			Addon = (await import('./template/addon-template.svelte')).default;
		}
	}
	
	onMount(async () => {
		await sleep(1000); // simulate network delay
		loadAddon();
    });
</script>

<svelte:component this={Addon} initialview={initialview}>
    
</svelte:component>
