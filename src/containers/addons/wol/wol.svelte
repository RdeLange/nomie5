<script>
export let data = {
  cat1:{label:"Label1",scale:0.1},
  cat2:{label:"Label2",scale:0.2},
  cat3:{label:"Label3",scale:0.3},
  cat4:{label:"Label4",scale:0.4},
  cat5:{label:"Label5",scale:0.5},
  cat6:{label:"Label6",scale:0.6},
  cat7:{label:"Label7",scale:0.7},
  cat8:{label:"Label8",scale:0.8}}


</script>

  
<div id="wheelOfLife">
  <img id="wheelOfLife-background" src="./images/addons/wol/Wheel-Of-Life.png" alt="Wheel Of Life">
  {#if data.cat1.calculated}
  <div id="category-1" class="triangle" style = "transform: rotate(0deg) scale({data.cat1.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-1" class="triangle" style = "transform: rotate(0deg) scale({data.cat1.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}  
  <div id="category-label" class="triangle" style = "transform: rotate(0deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label1"/>
      <style>
        text { 
            font-size: 10px;
            font-family: Franklin Gothic, sans-serif;
            font-weight: 900; 
            text-transform: uppercase;
            letter-spacing: 10px;
            fill: white;}
    </style>
    <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
        <textPath xlink:href="#label1" textLength="106" lengthAdjust="spacing">
          {data.cat1.label}
        </textPath>
    </text>
    </svg>
  </div>

  {#if data.cat2.calculated}
  <div id="category-2" class="triangle" style = "transform: rotate(45deg) scale({data.cat2.calculatedscale};">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-2" class="triangle" style = "transform: rotate(45deg) scale({data.cat2.scale};">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(45deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label2"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label2" textLength="106" lengthAdjust="spacing">
            {data.cat2.label}
          </textPath>
      </text>
    </svg>
  </div>

  {#if data.cat3.calculated}
  <div id="category-3" class="triangle" style = "transform: rotate(90deg) scale({data.cat3.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-3" class="triangle" style = "transform: rotate(90deg) scale({data.cat3.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(90deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label3"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label3" textLength="106" lengthAdjust="spacing">
            {data.cat3.label}
          </textPath>
      </text>
    </svg>
  </div>
  {#if data.cat4.calculated}
  <div id="category-4" class="triangle" style = "transform: rotate(135deg) scale({data.cat4.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-4" class="triangle" style = "transform: rotate(135deg) scale({data.cat4.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(135deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label4"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label4" textLength="106" lengthAdjust="spacing">
            {data.cat4.label}
          </textPath>
      </text>
    </svg>
  </div>
  {#if data.cat5.calculated}
  <div id="category-5" class="triangle" style = "transform: rotate(180deg) scale({data.cat5.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-5" class="triangle" style = "transform: rotate(180deg) scale({data.cat5.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(180deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label5"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label5" textLength="106" lengthAdjust="spacing">
            {data.cat5.label}
          </textPath>
      </text>
    </svg>
  </div>
  {#if data.cat6.calculated}
  <div id="category-6" class="triangle" style = "transform: rotate(225deg) scale({data.cat6.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {:else}
  <div id="category-6" class="triangle" style = "transform: rotate(225deg) scale({data.cat6.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(225deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label6"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label6" textLength="106" lengthAdjust="spacing">
            {data.cat6.label}
          </textPath>
      </text>
    </svg>
  </div>
  {#if data.cat7.calculated}
  <div id="category-7" class="triangle" style = "transform: rotate(270deg) scale({data.cat7.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z" id="texttest1"/>
    </svg>
  </div>
  {:else}
  <div id="category-7" class="triangle" style = "transform: rotate(270deg) scale({data.cat7.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z" id="texttest1"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(270deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label7"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label7" textLength="106" lengthAdjust="spacing">
            {data.cat7.label}
          </textPath>
      </text>
    </svg>
  </div>
  {#if data.cat8.calculated}
  <div id="category-8" class="triangle" style = "transform: rotate(315deg) scale({data.cat8.calculatedscale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z" id="texttest"/>
    </svg>
  </div>
  {:else}
  <div id="category-8" class="triangle" style = "transform: rotate(315deg) scale({data.cat8.scale});">
    <svg viewBox="0 0 110.5 155.5">
      <path d="M 0 45.5 A 155 155 0 0 1 110 0 v 155 Z" id="texttest"/>
    </svg>
  </div>
  {/if}
  <div id="category-label" class="triangle" style = "transform: rotate(315deg) scale(1.2);">
    <svg viewBox="-8 -8 110.5 155.5">
      <path fill="transparent" d="M 0 45.5 A 155 155 0 0 1 109 0 v 155 Z" id="label8"/>
      <text dx ="6" dy="-1" textLength="106" lengthAdjust="spacing">
          <textPath xlink:href="#label8" textLength="106" lengthAdjust="spacing">
            {data.cat8.label}
          </textPath>
      </text>
    </svg>
  </div>


</div>
  


<style>
#wheelOfLife {
position: relative;
display: block;
width: 100%;
height: 100%;
max-width: 400px;
margin: auto;
}

#wheelOfLife-background {
width: 100%;
}

.triangle {
position: absolute;
top: 0;
width: 50%;
height: 50%;
display: flex;
align-items: flex-end;
justify-content: flex-end;
transform-origin: bottom right;
}

.triangle svg{
/* Default height */
height: 79%;
fill-opacity: 0.8;
}

#category-1 {
fill: #ED2527;
}

#category-2{
fill: #3DB549;
/* overwritten in js */
transform: rotate(45deg);
}

#category-3 {
fill: #2289B4;
/* overwritten in js */
transform: rotate(90deg);
}

#category-4 {
fill: #F79321;
/* overwritten in js */
transform: rotate(135deg);
}

#category-5 {
fill: #94AFDC;
/* overwritten in js */
transform: rotate(180deg);
}

#category-6 {
fill: #FF5F75;
/* overwritten in js */
transform: rotate(225deg);
}

#category-7 {
fill: #00ADEF;
/* overwritten in js */
transform: rotate(270deg);
}

#category-8 {
fill: #935FA7;
/* overwritten in js */
transform: rotate(315deg);}

#category-label {
fill: transparent;
/* overwritten in js */
transform: rotate(315deg);  
}


</style>