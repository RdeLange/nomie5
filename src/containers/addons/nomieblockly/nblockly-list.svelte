<script>
import VirtualList from 'svelte-tiny-virtual-list';
import { createEventDispatcher } from "svelte";
import Text from "../../../components/text/text.svelte";

const dispatch = createEventDispatcher();
let itemSize = 30;
export let height = 120;
let width = "auto";
export let items = ["test1", "test2", "test3", "test4"];
export let selectedindex = 0;

function itemclicked(index){
	console.log(index);
	selectedindex = index;
}
</script>
<style>
    :global(.virtual-list-wrapper) {
	/*margin: 20px;*/
	background: #fff;
	border-radius: 7px;
	/*box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);*/
	box-shadow: 0 1px 1px 0 rgba(0,0,0,.14),0 1px 1px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.12);
	background: #fafafa;
	/*font-family: -apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;*/
	color: #333;
	-webkit-font-smoothing: antialiased;
	width:200px;
}

.row {
	padding: 5px 10px;
	margin-left: 0px;
	border-bottom: 1px solid #eee;
	box-sizing: border-box;
	line-height: 50px;
	font-weight: 500;
	background: #fff;
}

.row.highlighted {
	background: var(--color-primary);
}
</style>

<div class="list">
	<VirtualList
		height={height}
		width={width}
		itemCount={items.length}
		{itemSize}>
		
		<div slot="item" let:index let:style {style} class="row" class:highlighted={index == selectedindex} on:click={itemclicked(index)}>
			<Text size="sm">{items[index]}</Text>
		</div>
	</VirtualList>
</div>