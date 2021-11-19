<script>
    export let linefill = "none";
    export let d = "";
    export let height = "24";
    export let width = "24";
    export let leftmargin ="0px";
    export let topmargin ="0px";

    const style = "margin: "+topmargin+" "+leftmargin;
    
    </script>
    
    <svg class="icon" width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d={d} stroke={linefill} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    <style>
    .icon{
        position: relative;
        display:inline-block;
    }
    </style>