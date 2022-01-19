<script>
import CIcon from "./circlemenu-icon.svelte";
import Icon from "../../../components/icon/icon.svelte";
import NPaths from "../../../paths";
import { Lang } from "../../../store/lang";
function testing(number) {
    console.log("test");
}

</script>

<style>
* { margin: 0; padding: 0; }

/* generic styles for button & circular menu */
.ctrl {
	position: relative;
	bottom: 25%; left: 49.5%;
	font: 2em/1.13 Verdana, sans-serif;
	transition: .5s;
}

/* generic link styles */
a.ctrl, .ctrl div {
	display: block;
	opacity: .98;
	background: #c9c9c9;
	color: #7a8092;
	text-align: center;
	text-decoration: none;
	/*text-shadow: 0 -1px dimgrey;*/
  cursor: pointer;
}
a.ctrl:hover, .ctrl div:hover, a.ctrl:focus { opacity: 1; }
a.ctrl:focus { outline: none; }
.button {
	z-index: 2;
	margin: -.625em;
	width: 1.25em; height: 1.25em;
	border-radius: 50%;
	box-shadow: 0 0 3px 1px white;
}

/* circular menu */
.tip {
	z-index: 1;
	/**outline: dotted 1px white;/**/
	margin: -5em;
	width: 10em; height: 10em;
	transform: scale(0.001);
	list-style: none;
	opacity: 1;
}

/* the ends of the menu */
.tip:before, .tip:after {
	position: absolute;
	top: 34.3%;
	width: .5em; height: 14%;
	opacity: .56;
	background: #c9c9c9;
	content: '';
}
.tip:before {
	left: 5.4%;
	border-radius: .25em 0 0 .25em;
	box-shadow: -1px 0 1px dimgrey, inset 1px 0 1px white, inset -1px 0 1px grey, 
				inset 0 1px 1px white, inset 0 -1px 1px white;
	transform: rotate(-75deg);
}
.tip:after {
	right: 5.4%;
	border-radius: 0 .25em .25em 0;
	box-shadow: 1px 0 1px dimgrey, inset -1px 0 1px white, inset 1px 0 1px grey,
				inset 0 1px 1px white, inset 0 -1px 1px white;
	transform: rotate(75deg);
}

/* make the menu appear on click */
.button:focus + .tip {
	transform: scale(1);
	opacity: 1;
}

/* slices of the circular menu */
.slice {
	overflow: hidden;
	position: absolute;
	/**outline: dotted 1px yellow;/**/
	width: 50%; height: 50%;
	transform-origin: 100% 100%;
	
}

/* 
 * rotate each slice at the right angle = (A/2)° + (k - (n+1)/2)*A°
 * where A is the angle of 1 slice (30° in this case)
 * k is the number of the slice (in {1,2,3,4,5} here)
 * and n is the number of slices (5 in this case)
 * formula works for odd number of slices (n odd)
 * for even number of slices (n even) the rotation angle is (k - n/2)*A°
 * 
 * after rotating, skew on Y by 90°-A°; here A° = the angle for 1 slice = 30° 
 */
 /* RDL> last-childe rotate 75deg. deduct (150/childs), starting from 75*/
.slice:first-of-type { transform: rotate(-37.3deg) skewY(52.5deg); }
.slice:nth-of-type(2) { transform: rotate(0.1deg) skewY(52.5deg); }
.slice:nth-of-type(3) { transform: rotate(37.5deg) skewY(52.5deg);}
.slice:last-of-type { transform: rotate(74.9deg) skewY(52.5deg); }

/* covers for the inner part of the links so there's no hover trigger between
   star button & menu links; give them a red background to see them */
.slice:after {
	position: absolute;
	top: 32%; left: 32%;
	width: 136%; height: 136%;
	border-radius: 50%;
	/* "unskew" = skew by minus the same angle by which parent was skewed */
	transform: skewY(-52.5deg); /*RDL => change*/
	content: '';
}

/* menu links */
.slice div {
	width: 200%; height: 200%;
	border-radius: 50%;
	box-shadow: 0 0 3px dimgrey, inset 0 0 4px white;
	/* "unskew" & rotate by -A°/2 */
	transform: skewY(-52.5deg) rotate(-18.75deg); /*RDL => CHANGE*/
	background: linear-gradient(70deg, transparent, transparent 50%, transparent 50%, transparent 51%, transparent 51%) no-repeat 0% 0 , linear-gradient(-70deg, transparent, transparent 50%, transparent 50%, transparent 51%, transparent 51%) no-repeat 100% 0,
		/* make sure inner part is transparent */
		radial-gradient(rgba(127,127,127,0) 49%, 
					rgba(255,255,255,0.7) 51%, #c9c9c9 52%);
	/*background-size: 17% 17%, 17% 17%, cover;*/
	background-size: 100%,100%;

	line-height: 1.4;
}

/* arrow for middle link */
/*.slice:nth-child(1) div:after {
	position: absolute;
	top: 13%; left: 50%;
	margin: -.25em;
	width: .5em; height: .5em;
	box-shadow: 2px 2px 2px white;
	transform: rotate(45deg);
	background: linear-gradient(-45deg, #c9c9c9 50%, transparent 50%);
	content: ''; 
}*/

.slice div:after {
	position: absolute;
	top: 0%; 
	right: 85px;
	
	width: 2px; height: 38px;
	transform: rotate(18.75deg);
	/*background: linear-gradient(-18deg, grey 50%, grey 50%);*/
	background: grey;
	content: '';
}
.slice div:before {
	position: absolute;
	top: 11px; 
	left: 47.5px;
	
	width: 41px; height: 33px;
	transform: rotate(-18.75deg);
	/*background: linear-gradient(-18deg, grey 50%, grey 50%);*/
	background: grey;
	content: '';
}
       
</style>

<a class='button ctrl' tabindex='1'><Icon name="menu" className="fill-primary" size="24"/></a>
<ul class='tip ctrl'>
	<li class='slice'><div><CIcon label="Journals" link={NPaths.routes.journals()} name="book" className="fill-primary" size="24" /></div></li>
	<li class='slice'><div><CIcon label="People" link={NPaths.routes.people()} name="user" className="fill-primary" size="24"/></div></li>
	<li class='slice'><div><CIcon label="Addons" link={NPaths.routes.addons()} name="puzzle" className="fill-primary" size="24"/></div></li>
	<li class='slice'><div><CIcon label="Periods" link={NPaths.routes.periods()} name="eye" className="fill-primary" size="24"/></div></li>
	
</ul>
  