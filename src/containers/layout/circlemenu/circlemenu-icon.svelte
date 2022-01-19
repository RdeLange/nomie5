<script lang="ts">
 // import buttonView from "./n-icons/button-view.svelte";
 // import detailView from "./n-icons/detail-view.svelte";
 // import RadioButtonChecked24 from "carbon-icons-svelte/lib/RadioButtonChecked24";
 // import Shuffle24 from "carbon-icons-svelte/lib/Shuffle24";
 // import RadioButton24 from "carbon-icons-svelte/lib/RadioButton24";
  // Hero Icons
  import {
    ArrowCircleUp,
    ArrowLeft,
    Exclamation,
    ArrowUp,
    ArrowsExpand,
    Calendar,
    ChartBar,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ClipboardCopy,
    Clock,
    Cog,
    DotsHorizontal,
    Download,
    FolderAdd,
    LocationMarker,
    Menu,
    MinusCircle,
    PaperAirplane,
    Pencil,
    Plus,
    PlusCircle,
    PresentationChartLine,
    Puzzle,
    Refresh,
    Search,
    Share,
    SortAscending,
    Star,
    SwitchHorizontal,
    Trash,
    User,
    UserAdd,
    UserGroup,
    ViewBoards,
    ViewGrid,
    Home,
    X,
    XCircle,
    DotsVertical,
    ChartPie,
    DotsCircleHorizontal,
    ViewList,
    Eye,
    EyeOff,
    Map,
    Annotation,
    Beaker,
    Bell,
    LockClosed,
    ArrowRight,
    Cake,
    LightBulb,
    PencilAlt,
    BookOpen,
    Upload,
    Library,
    Chip,
    Adjustments,
    Collection,
    SortDescending,
    ChartSquareBar,
    UserCircle,
    Duplicate,
    Play,
    Stop,
    Save,
  } from "svelte-hero-icons";
  import { Link } from "svelte-routing";

  export let name = "add";
  export let size = "";
  export let link: string;
  export let label ="Test";
  export let className = "";

  const icons = {
    add: Plus,
    chip: Chip,
    adjust: Adjustments,
    library: Library,
    alert: Exclamation,
    bell: Bell,
    tab: Collection,
    addFolder: FolderAdd,
    addTab: FolderAdd,
    duplicate: Duplicate,
    sortUp: SortAscending,
    sortDown: SortDescending,
    switch: SwitchHorizontal,
    lock: LockClosed,
    annotation: Annotation,
    expand: ArrowsExpand,
    beaker: Beaker,
    addOutline: PlusCircle,
    arrowBack: ArrowLeft,
    arrowRight: ArrowRight,
    upload: Upload,
    arrowUp: ArrowUp,
    arrowsLeftRight: SwitchHorizontal,
    calendar: Calendar,
    chart: ChartBar,
    chart2: ChartSquareBar,
    play: Play,
    stop: Stop,
    cake: Cake,
    checkmark: Check,
    checkmarkFilled: CheckCircle,
    checkmarkOutline: CheckCircle,
    chevronDown: ChevronDown,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronUp: ChevronUp,
    close: X,
    closeFilled: XCircle,
    closeOutline: XCircle,
    copy: ClipboardCopy,
    home: Home,
    dashboard: ViewBoards,
    delete: Trash,
    download: Download,
    edit: Pencil,
    pieChart: ChartPie,
    grid: ViewGrid,
    list: ViewList,
    bulb: LightBulb,
    map: Map,
    menu: Menu,
    more: DotsHorizontal,
    moreOutline: DotsCircleHorizontal,
    moreVertical: DotsVertical,
    newTab: FolderAdd,
    people: UserGroup,
    pin: LocationMarker,
    userCircle: UserCircle,
    refresh: Refresh,
    remove: MinusCircle,
    report: PresentationChartLine,
    search: Search,
    sendFilled: ArrowCircleUp,
    airplane: PaperAirplane,
    settings: Cog,
    share: Share,
    sort: SortAscending,
    star: Star,
    time: Clock,
    tracker: ViewGrid,
    userAdd: UserAdd,
    user: User,
    eye: Eye,
    eyeOff: EyeOff,
    compose: PencilAlt,
    book: BookOpen,
    puzzle: Puzzle,
    save: Save,
  };
</script>

<style global lang="scss">
  .nc-icon {
    display: flex;
    //flex-direction: column;
    //align-items: center;
    justify-content: center;
    //position: relative;
    padding-top: 2px;
    //margin-top: 10px;
    font-size: 0.35em;
    height: 100%;
    text-decoration: none;
    flex-grow: 1;
    flex-shrink: 1;
    // opacity: 0.6;
    transition: all 0.2s ease-in-out;
    min-width: 30px;
    width: 100%;
    color: var(--color-primary);
    //color:orange;
    label {
      pointer-events: none;
      margin-bottom: 0;
      padding-top: 0px;
      font-family: "Helvetica Neue", "Arial", sans-serif;
      font-weight: normal;
      font-stretch: 100%;
      //color:var(--color-primary);
      color:grey;
    }
  }

  
</style>

{#if icons[name]}

  <span class="nc-icon {className}">
    <Link to={link}>
      <svelte:component this={icons[name]} size={`${size || 24}`}/>
      <br>
      <label>{label}</label>
    </Link>
    
  </span>
{/if}
