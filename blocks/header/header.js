/*
 * header — site chrome rebuilt from the authored /nav fragment (stardust:deploy, template-slotted).
 * Section contract (stardust/eds-conversion-log.md → /nav): 1 brand · 2 primary nav · 3 tools · 4
 * utility bar ·
 * 5 mobile promo card · 6… one section per mega-menu column (a column section starting with <h2>
 * opens a panel) ·
 * last: the language-selector panel. Authored nodes are MOVED into the live markup (nothing rebuilt
 * from text).
 * Behaviours mirror the observed live state machine (stardust/replica/motion/home.json): scroll pin
 * + `overlapping`,
 * utility-bar language menu, desktop mega menu (hover/click, triangle geometry), mobile menu +
 * sub-panels + Back,
 * Products accordion. The search overlay is static (no open behaviour was observed).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import SEARCH_HTML from './search-overlay.js';

/* eslint-disable max-len */
const SVG = {
  synopsys: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276.32 60.13" role="img" aria-label="Synopsys"> <g data-name="logo"> <path d="M19.24 7c0-1.84-.92-3.23-5-3.23s-5 1.39-5 3.23v5a5.43 5.43 0 0 0 2 4.28L25 28.18A7.75 7.75 0 0 1 28.2 34v7.52c0 4.48-5.27 7-14 7C4.61 48.47 0 46.3 0 41.49V35h8.7v6.26c0 2.25 1.71 3.56 5.53 3.56 3.56 0 5.27-1.31 5.27-3.56v-6.69c0-1.65-.66-2.9-2.51-4.55L4.22 18.88c-2.37-2-3.69-3.62-3.69-6.06V7.09c0-4.68 4.88-7 13.7-7C24 .1 27.94 2.41 27.94 6.76v6.06h-8.7ZM103.13 8c0-4.68 3.55-8 15.29-8s15.28 3.36 15.28 8v32.33c0 4.68-3.56 8-15.29 8s-15.29-3.36-15.29-8Zm8.69 32.15c0 2.64 1.06 4.49 6.59 4.49s6.59-1.81 6.59-4.45v-32c0-2.64-1-4.48-6.58-4.48s-6.6 1.84-6.6 4.48ZM138.51.39h13.84c11.21 0 14.5 1.85 14.5 7.25v11.67c0 5.4-3.3 7.25-14.5 7.25h-5.14V48h-8.7Zm12.92 22.47c3.95 0 6.72-.52 6.72-3V7.05c0-2.44-2.77-3-6.72-3h-4.22v18.81ZM188.57 6.92c0-1.85-.92-3.23-5-3.23s-5 1.38-5 3.23v5a5.45 5.45 0 0 0 2 4.28l13.84 11.86a7.8 7.8 0 0 1 3.16 5.8v7.51c0 4.49-5.27 7-14 7-9.62 0-14.23-2.18-14.23-7v-6.51H178v6.26c0 2.24 1.71 3.56 5.53 3.56 3.56 0 5.27-1.32 5.27-3.56v-6.66c0-1.64-.65-2.9-2.5-4.54l-12.75-11.14c-2.38-2-3.69-3.62-3.69-6.06V7c0-4.68 4.87-7 13.71-7 9.75 0 13.7 2.3 13.7 6.66v6.06h-8.7ZM252.76 6.92c0-1.85-.92-3.23-5-3.23s-5 1.38-5 3.23v5a5.45 5.45 0 0 0 2 4.28l13.84 11.86a7.77 7.77 0 0 1 3.16 5.8v7.51c0 4.49-5.27 7-14 7-9.62 0-14.24-2.18-14.24-7v-6.51h8.71v6.26c0 2.24 1.72 3.56 5.54 3.56 3.56 0 5.27-1.32 5.27-3.56v-6.66c0-1.64-.66-2.9-2.5-4.54l-12.81-11.14c-2.37-2-3.69-3.62-3.69-6.06V7c0-4.67 4.88-7 13.71-7 9.75 0 13.71 2.31 13.71 6.66v6.06h-8.7ZM55.12.4h8.71L44.77 60.13h-8.71L55.12.4zM41.38 37.5 29.6.5h8.71l7.42 23.33-4.35 13.67zM224.35.4h8.71L214 60.13h-8.71L224.35.4zM210.66 37.39 198.87.4h8.71l7.43 23.32-4.35 13.67zM97.76 48V7.65c0-5.4-3.3-7.25-14.5-7.25H66.54V48h8.7V4.1h7.16c4 0 6.72.52 6.72 3V48ZM265.1 6.27a5.61 5.61 0 1 1 5.63 5.56 5.53 5.53 0 0 1-5.63-5.56Zm5.63 4.63a4.47 4.47 0 0 0 4.48-4.63 4.5 4.5 0 1 0-9 0 4.48 4.48 0 0 0 4.52 4.63Zm-1.18-1.42h-1V3.09H271c1.51 0 2.26.56 2.26 1.82a1.67 1.67 0 0 1-1.66 1.76l1.82 2.81h-1.08l-1.69-2.77h-1.12Zm1.16-3.59c.82 0 1.56-.06 1.56-1 0-.79-.72-.94-1.39-.94h-1.33v2Z"> </path> </g> </svg>',
  ansys: '<svg xmlns="http://www.w3.org/2000/svg" width="51" height="16" viewBox="0 0 51 16" fill="none"> <path d="M23.3035 4.56832C23.8231 5.1848 24.075 6.11744 24.075 7.35041V12.6617H21.3825V7.47687C21.3825 6.87619 21.2723 6.44939 21.0518 6.16486C20.8314 5.89613 20.485 5.75387 20.0284 5.75387C19.4615 5.75387 19.0207 5.92775 18.6743 6.29132C18.3279 6.65489 18.1704 7.12911 18.1704 7.72979V12.6617H15.4779V3.87279H18.0917V5.12157C18.4066 4.64735 18.8002 4.28378 19.3041 4.03087C19.7922 3.77795 20.359 3.65149 20.9731 3.65149C22.0123 3.65149 22.7996 3.96764 23.3035 4.56832Z" fill="white"></path> <path d="M27.0351 12.5352C26.3581 12.3455 25.7755 12.0767 25.2874 11.7448L25.9959 9.87952C26.4683 10.1957 27.0036 10.4486 27.5705 10.6383C28.1373 10.8122 28.7199 10.907 29.3025 10.907C29.7119 10.907 30.0425 10.8438 30.2787 10.7015C30.5149 10.5592 30.6251 10.3696 30.6251 10.1324C30.6251 9.91114 30.5464 9.75307 30.3889 9.62661C30.2315 9.50015 29.9323 9.4053 29.4914 9.31046L28.0586 8.99431C27.2083 8.80463 26.5942 8.50429 26.1849 8.1091C25.7912 7.71392 25.5865 7.16066 25.5865 6.46514C25.5865 5.91188 25.744 5.43766 26.0589 5.01086C26.3738 4.59987 26.8147 4.26792 27.3973 4.03081C27.9799 3.7937 28.6254 3.66724 29.3655 3.66724C29.9953 3.66724 30.6094 3.76208 31.2077 3.95177C31.806 4.14146 32.3414 4.41018 32.8137 4.75794L32.1052 6.54417C31.1762 5.89607 30.263 5.57993 29.3497 5.57993C28.9403 5.57993 28.6097 5.65896 28.3735 5.80123C28.1373 5.94349 28.0113 6.14899 28.0113 6.41771C28.0113 6.6074 28.0901 6.76548 28.2318 6.86032C28.3735 6.97097 28.6254 7.06582 28.9876 7.16066L30.4677 7.50842C31.3652 7.71392 32.0107 8.01426 32.4201 8.42525C32.8295 8.83624 33.0342 9.3895 33.0342 10.1008C33.0342 10.9544 32.7035 11.6183 32.0265 12.0926C31.3494 12.5826 30.4204 12.8197 29.2552 12.8197C28.4522 12.8197 27.7122 12.7248 27.0351 12.5352Z" fill="white"></path> <path d="M45.0009 12.5352C44.3239 12.3455 43.7413 12.0767 43.2532 11.7448L43.9617 9.87952C44.4341 10.1957 44.9694 10.4486 45.5363 10.6383C46.1031 10.8122 46.6857 10.907 47.2683 10.907C47.6777 10.907 48.0083 10.8438 48.2445 10.7015C48.4807 10.5592 48.5909 10.3696 48.5909 10.1324C48.5909 9.91114 48.5122 9.75307 48.3547 9.62661C48.1973 9.50015 47.8981 9.4053 47.4572 9.31046L46.0244 8.99431C45.1741 8.80463 44.5601 8.50429 44.1507 8.1091C43.757 7.71392 43.5523 7.16066 43.5523 6.46514C43.5523 5.91188 43.7098 5.43766 44.0247 5.01086C44.3396 4.59987 44.7805 4.26792 45.3631 4.03081C45.9457 3.7937 46.5912 3.66724 47.3313 3.66724C47.9611 3.66724 48.5752 3.76208 49.1735 3.95177C49.7718 4.14146 50.3072 4.41018 50.7796 4.75794L50.071 6.54417C49.142 5.89607 48.2288 5.57993 47.3155 5.57993C46.9062 5.57993 46.5755 5.65896 46.3393 5.80123C46.1031 5.94349 45.9772 6.14899 45.9772 6.41771C45.9772 6.6074 46.0559 6.76548 46.1976 6.86032C46.3393 6.97097 46.5912 7.06582 46.9534 7.16066L48.4335 7.50842C49.331 7.71392 49.9765 8.01426 50.3859 8.42525C50.7953 8.83624 51 9.3895 51 10.1008C51 10.9544 50.6693 11.6183 49.9923 12.0926C49.3152 12.5826 48.3862 12.8197 47.2211 12.8197C46.418 12.8197 45.678 12.7248 45.0009 12.5352Z" fill="white"></path> <path d="M5.3535 0L0 12.6617H3.65298L8.81754 0H5.3535Z" fill="white"></path> <path d="M9.44735 0.411011L7.71533 4.66319L10.9747 12.6617H14.6434L9.44735 0.411011Z" fill="white"></path> <path d="M40.5449 3.8728L38.3405 9.07342L36.1361 3.8728H33.4751L37.0179 12.2033L35.4433 15.9022H38.1043L43.2059 3.8728H40.5449Z" fill="white"></path> </svg>',
  logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276.32 60.13" class="d-block" width="166" role="img" aria-label="Synopsys"><g data-name="logo"><path d="M19.24 7c0-1.84-.92-3.23-5-3.23s-5 1.39-5 3.23v5a5.43 5.43 0 0 0 2 4.28L25 28.18A7.75 7.75 0 0 1 28.2 34v7.52c0 4.48-5.27 7-14 7C4.61 48.47 0 46.3 0 41.49V35h8.7v6.26c0 2.25 1.71 3.56 5.53 3.56 3.56 0 5.27-1.31 5.27-3.56v-6.69c0-1.65-.66-2.9-2.51-4.55L4.22 18.88c-2.37-2-3.69-3.62-3.69-6.06V7.09c0-4.68 4.88-7 13.7-7C24 .1 27.94 2.41 27.94 6.76v6.06h-8.7ZM103.13 8c0-4.68 3.55-8 15.29-8s15.28 3.36 15.28 8v32.33c0 4.68-3.56 8-15.29 8s-15.29-3.36-15.29-8Zm8.69 32.15c0 2.64 1.06 4.49 6.59 4.49s6.59-1.81 6.59-4.45v-32c0-2.64-1-4.48-6.58-4.48s-6.6 1.84-6.6 4.48ZM138.51.39h13.84c11.21 0 14.5 1.85 14.5 7.25v11.67c0 5.4-3.3 7.25-14.5 7.25h-5.14V48h-8.7Zm12.92 22.47c3.95 0 6.72-.52 6.72-3V7.05c0-2.44-2.77-3-6.72-3h-4.22v18.81ZM188.57 6.92c0-1.85-.92-3.23-5-3.23s-5 1.38-5 3.23v5a5.45 5.45 0 0 0 2 4.28l13.84 11.86a7.8 7.8 0 0 1 3.16 5.8v7.51c0 4.49-5.27 7-14 7-9.62 0-14.23-2.18-14.23-7v-6.51H178v6.26c0 2.24 1.71 3.56 5.53 3.56 3.56 0 5.27-1.32 5.27-3.56v-6.66c0-1.64-.65-2.9-2.5-4.54l-12.75-11.14c-2.38-2-3.69-3.62-3.69-6.06V7c0-4.68 4.87-7 13.71-7 9.75 0 13.7 2.3 13.7 6.66v6.06h-8.7ZM252.76 6.92c0-1.85-.92-3.23-5-3.23s-5 1.38-5 3.23v5a5.45 5.45 0 0 0 2 4.28l13.84 11.86a7.77 7.77 0 0 1 3.16 5.8v7.51c0 4.49-5.27 7-14 7-9.62 0-14.24-2.18-14.24-7v-6.51h8.71v6.26c0 2.24 1.72 3.56 5.54 3.56 3.56 0 5.27-1.32 5.27-3.56v-6.66c0-1.64-.66-2.9-2.5-4.54l-12.81-11.14c-2.37-2-3.69-3.62-3.69-6.06V7c0-4.67 4.88-7 13.71-7 9.75 0 13.71 2.31 13.71 6.66v6.06h-8.7ZM55.12.4h8.71L44.77 60.13h-8.71L55.12.4zM41.38 37.5 29.6.5h8.71l7.42 23.33-4.35 13.67zM224.35.4h8.71L214 60.13h-8.71L224.35.4zM210.66 37.39 198.87.4h8.71l7.43 23.32-4.35 13.67zM97.76 48V7.65c0-5.4-3.3-7.25-14.5-7.25H66.54V48h8.7V4.1h7.16c4 0 6.72.52 6.72 3V48ZM265.1 6.27a5.61 5.61 0 1 1 5.63 5.56 5.53 5.53 0 0 1-5.63-5.56Zm5.63 4.63a4.47 4.47 0 0 0 4.48-4.63 4.5 4.5 0 1 0-9 0 4.48 4.48 0 0 0 4.52 4.63Zm-1.18-1.42h-1V3.09H271c1.51 0 2.26.56 2.26 1.82a1.67 1.67 0 0 1-1.66 1.76l1.82 2.81h-1.08l-1.69-2.77h-1.12Zm1.16-3.59c.82 0 1.56-.06 1.56-1 0-.79-.72-.94-1.39-.94h-1.33v2Z"></path></g></svg>',
  search: '<svg class="svg-inline--fa fa-magnifying-glass" aria-hidden="true" focusable="false" data-prefix="far" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"></path></svg>',
  togglerOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none" class="svg-open"> <path d="M0 2.75C0 2.33437 0.334375 2 0.75 2H13.25C13.6656 2 14 2.33437 14 2.75C14 3.16562 13.6656 3.5 13.25 3.5H0.75C0.334375 3.5 0 3.16562 0 2.75ZM0 7.75C0 7.33437 0.334375 7 0.75 7H13.25C13.6656 7 14 7.33437 14 7.75C14 8.16563 13.6656 8.5 13.25 8.5H0.75C0.334375 8.5 0 8.16563 0 7.75ZM14 12.75C14 13.1656 13.6656 13.5 13.25 13.5H0.75C0.334375 13.5 0 13.1656 0 12.75C0 12.3344 0.334375 12 0.75 12H13.25C13.6656 12 14 12.3344 14 12.75Z" fill="white"></path> </svg>',
  togglerClose: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="svg-close"> <path d="M9.14062 9.84688C9.33438 10.0406 9.65312 10.0406 9.84688 9.84688C10.0406 9.65312 10.0406 9.33438 9.84688 9.14062L5.70625 5L9.84688 0.859375C10.0406 0.665625 10.0406 0.346875 9.84688 0.153125C9.65312 -0.040625 9.33438 -0.040625 9.14062 0.153125L5 4.29375L0.859375 0.153125C0.665625 -0.040625 0.346875 -0.040625 0.153125 0.153125C-0.040625 0.346875 -0.040625 0.665625 0.153125 0.859375L4.29375 5L0.153125 9.14062C-0.040625 9.33438 -0.040625 9.65312 0.153125 9.84688C0.346875 10.0406 0.665625 10.0406 0.859375 9.84688L5 5.70625L9.14062 9.84688Z" fill="black"></path> </svg>',
  external: '<svg class="svg-inline--fa fa-arrow-up-right-from-square external-link-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right-from-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 24c0 13.3 10.7 24 24 24H430.1L207 271c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l223-223V184c0 13.3 10.7 24 24 24s24-10.7 24-24V24c0-13.3-10.7-24-24-24H328c-13.3 0-24 10.7-24 24zM72 32C32.2 32 0 64.2 0 104V440c0 39.8 32.2 72 72 72H408c39.8 0 72-32.2 72-72V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V440c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z"></path></svg>',
  chevron: '<svg class="svg-inline--fa fa-chevron-right arrow-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>',
  play: '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>',
  promoArrow: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960" fill="currentColor" stroke="none" aria-hidden="true" class="utility-nav__promo-arrow"><path d="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z"></path></svg>',
  triangle: '<svg width="100%" height="100%" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg" class="triangle main"><path d="M9.46 0.66 C10.26 -0.22 11.65 -0.22 12.44 0.66 L21.39 10.66 L0.51 10.66 L9.46 0.66 Z" fill="white"></path></svg>',
  triangleShadow: '<svg width="100%" height="100%" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg" class="triangle triangle_shadow"><path d="M9.46 0.66 C10.26 -0.22 11.65 -0.22 12.44 0.66 L21.39 10.66 L0.51 10.66 L9.46 0.66 Z" fill="white"></path></svg>',
  ask: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path class="star star-1" d="M19.5 8.66667L20.8542 5.6875L23.8333 4.33333L20.8542 2.97917L19.5 0L18.1458 2.97917L15.1667 4.33333L18.1458 5.6875L19.5 8.66667Z" fill="white"></path> <path class="star star-2" d="M19.5 15.1667L18.1458 18.1458L15.1667 19.5L18.1458 20.8542L19.5 23.8333L20.8542 20.8542L23.8333 19.5L20.8542 18.1458L19.5 15.1667Z" fill="white"></path> <path class="star star-3" d="M11.375 9.20833L8.66667 3.25L5.95833 9.20833L0 11.9167L5.95833 14.625L8.66667 20.5833L11.375 14.625L17.3333 11.9167L11.375 9.20833ZM9.73917 12.9892L8.66667 15.3508L7.59417 12.9892L5.2325 11.9167L7.59417 10.8442L8.66667 8.4825L9.73917 10.8442L12.1008 11.9167L9.73917 12.9892Z" fill="white"></path> </svg>',
};

const DESK = window.matchMedia('(min-width: 1130px)');

function el(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs || {}).forEach(([k, v]) => { if (v != null) node.setAttribute(k, v); });
  return node;
}

function svg(markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  return tpl.content.firstElementChild;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index],[data-image-index],[data-block-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
    n.removeAttribute('data-block-index');
  });
  return node;
}

/** children of a fragment section (the runtime wraps default content in .default-content-wrapper)
 * */
function kids(section) {
  const wrap = section.querySelector(':scope > .default-content-wrapper') || section;
  return [...wrap.children];
}

const text = (node) => (node ? node.textContent.trim() : '');
const media = (node) => (node ? node.querySelector('picture, img') : null);
const isImageOnly = (p) => p && p.tagName === 'P' && media(p) && !text(p);
/** authored `<p><strong><a>`: raw in the workspace, buttonized (p.button-wrapper > a.button) on the
 * published page */
const isStrongLink = (p) => !!p.querySelector('strong a, a.button') || p.classList.contains('button-wrapper');
const linkIn = (node) => (node ? node.querySelector('a') : null);

/** authored `<p><strong><a>` arrives buttonized (p.button-wrapper > a.button); lift the bare anchor
 * out */
function liftLink(node, className) {
  const a = linkIn(node) || node;
  a.className = className || '';
  return a;
}

function hidden(label) {
  const span = el('span', 'visually-hidden');
  span.textContent = label;
  return span;
}

/* ------------------------------------------------------------------ utility bar (in flow, ≥730
 * only) */
function buildUtilityBar(section, labels) {
  const [brands, langs] = section.querySelectorAll('ul');
  const ask = section.querySelector('p');
  const bar = el('div', 'container-fluid pre-header m-0 align-items-center', { id: 'utility-nav-bar' });
  const left = el('div', 'd-flex');
  const [synA, ansA] = [...(brands ? brands.querySelectorAll('li') : [])].map((li) => linkIn(li));
  [[synA, SVG.synopsys, 'Synopsys'], [ansA, SVG.ansys, 'Ansys']].forEach(([a, glyph, title], i) => {
    if (!a) return;
    a.className = 'd-flex';
    a.title = title;
    const label = a.textContent;
    a.textContent = '';
    a.append(svg(glyph), hidden(label));
    if (i === 1) left.append(el('div', 'vr opacity-100 align-self-center'));
    left.append(a);
  });
  const right = el('div', 'ms-auto d-flex');
  const dd = el('div', 'dropdown d-flex align-items-center');
  const toggle = el('button', 'btn btn-default dropdown-toggle topbar-lang d-flex', { type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
  const menu = el('ul', 'dropdown-menu global-nav-link-list');
  [...(langs ? langs.querySelectorAll('li') : [])].forEach((li) => {
    const a = linkIn(li);
    if (!a) {
      li.className = 'title';
      menu.append(li);
      return;
    }
    const active = !!li.querySelector('strong');
    a.className = 'dropdown-item global-nav-link';
    li.textContent = '';
    li.className = active ? 'active' : '';
    li.append(a);
    if (active) toggle.textContent = a.textContent;
    menu.append(li);
  });
  dd.append(toggle, menu);
  const askBtn = el('button', 'd-flex align-items-center position-relative', { id: 'askSynopsys', type: 'button' });
  const askSpan = el('span');
  askSpan.textContent = text(ask) || labels.ask;
  askBtn.append(askSpan);
  right.append(dd, askBtn);
  bar.append(left, right);
  return bar;
}

/* ------------------------------------------------------------------ mega-menu panels */
function navItem(li) {
  const a = linkIn(li);
  const item = el('li');
  if (!a) {
    item.append(...li.childNodes);
    return item;
  }
  const logo = media(li);
  const sub = li.querySelector('em');
  const title = el('div', 'nav-item-title');
  title.append(...[...a.childNodes].filter((n) => n !== logo && !(n.nodeType === 1 && n.contains(logo))));
  if (a.target === '_blank') {
    title.append(' ', svg(SVG.external));
    if (!a.rel) a.rel = 'noopener noreferrer';
  }
  a.textContent = '';
  if (logo) {
    const img = logo.querySelector('img') || logo;
    img.classList.add('nav-item-logo');
    img.loading = 'lazy';
    a.append(logo);
  }
  a.append(title);
  if (sub) {
    const span = el('span', 'nav-item-subtitle');
    span.append(...sub.childNodes);
    a.append(' ', span);
    a.classList.add('hasSubtitle');
    item.className = 'hasSubtitle';
  }
  item.append(a);
  return item;
}

function navListBlock(state) {
  const wrap = el('div', 'navList');
  const list = el('div', 'component-nav-list');
  const { heading, desc, items } = state;
  const link = heading ? linkIn(heading) : null;
  if (link) {
    link.className = 'header-item';
    const logo = media(link);
    if (logo) {
      const img = logo.querySelector('img') || logo;
      img.classList.add('nav-header-logo');
      img.loading = 'lazy';
    }
    if (desc) {
      const sub = el('span', 'nav-list-header-subtitle');
      sub.append(...desc.childNodes);
      link.append(' ', sub);
    }
    list.append(link);
  } else {
    const span = el('span', 'header-item');
    if (heading) span.append(...heading.childNodes);
    list.append(span);
  }
  if (items) {
    items.className = 'nav-list';
    [...items.children].forEach((li) => li.replaceWith(navItem(li)));
    list.append(items);
  }
  wrap.append(list);
  return wrap;
}

function textcompBlock(heading, ctaP) {
  const wrap = el('div', 'text');
  const container = el('div', 'container');
  const section = el('section', 'component-textcomp text-align-left');
  const title = el('h2', 'title text-size-normal');
  if (heading) title.append(...heading.childNodes);
  section.append(title);
  if (ctaP) {
    const buttons = el('div', 'buttons align-left');
    const a = liftLink(ctaP, 'cta-link');
    const label = el('span', 'cta-text');
    label.append(...a.childNodes);
    a.append(label, svg(SVG.chevron));
    buttons.append(a);
    section.append(buttons);
  }
  container.append(section);
  wrap.append(container);
  return wrap;
}

function topNavAdBlock(ad) {
  const wrap = el('div', 'topNavAd');
  const video = !!linkIn(ad.poster);
  const section = el('section', `component-topNavAd${video ? '' : ' hideOnMobile'}`);
  const pic = media(ad.poster);
  const img = pic ? (pic.querySelector('img') || pic) : null;
  if (video && img) {
    const v = el('div', 'cmp-video', { 'data-provider': 'Brightcove', 'data-mode': 'modal' });
    const player = el('div', 'cmp-video__player-container embed-responsive embed-responsive-16by9');
    const thumb = el('div', 'cmp-video__thumbnail');
    thumb.style.backgroundImage = `url('${img.currentSrc || img.src}')`;
    const btn = el('div', 'video-button-container video-button');
    btn.append(svg(SVG.play));
    thumb.append(btn);
    // keep the authored poster in the DOM (hidden) so the image stays editable in the workspace
    pic.classList.add('visually-hidden');
    thumb.append(pic);
    player.append(thumb);
    v.append(player);
    section.append(v);
  } else if (img) {
    img.classList.add('img-responsive');
    const ci = el('div', 'component-image');
    const ci2 = el('div', 'cmp-image');
    ci2.append(pic);
    ci.append(ci2);
    section.append(ci);
  }
  const a = liftLink(ad.cta, '');
  const title = el('div', 'title');
  if (ad.title) title.append(...(ad.title.querySelector('strong') || ad.title).childNodes);
  const desc = el('div', 'description m-0 p-0');
  if (ad.text) desc.append(ad.text);
  const cta = el('div', 'cta');
  cta.append(...a.childNodes);
  a.append(title, ' ', desc, ' ', cta);
  section.append(a);
  wrap.append(section);
  return wrap;
}

function footerCtaBlock(p) {
  const wrap = el('div');
  wrap.append(liftLink(p, 'sub-nav-footer cta'));
  return wrap;
}

/** one column section → its blocks (nav lists, text CTA, ad, footer CTA) */
function columnBlocks(nodes) {
  const out = [];
  let list = null;
  let ad = null;
  const flushList = () => { if (list) { out.push(navListBlock(list)); list = null; } };
  const flushAd = () => { if (ad) { out.push(topNavAdBlock(ad)); ad = null; } };
  nodes.forEach((node, i) => {
    const tag = node.tagName;
    const next = nodes[i + 1];
    if (tag === 'H2') return; // panel name, consumed by the caller
    if (tag === 'H3') {
      flushList(); flushAd();
      list = { heading: node, desc: null, items: null };
      if (next && next.tagName === 'P' && !linkIn(next) && !media(next)) list.desc = next;
      return;
    }
    if (tag === 'UL') {
      if (!list) list = { heading: null, desc: null, items: null };
      list.items = node;
      flushList();
      return;
    }
    if (tag === 'H4') {
      flushList(); flushAd();
      const ctaP = next && next.tagName === 'P' && linkIn(next) ? next : null;
      out.push(textcompBlock(node, ctaP));
      if (ctaP) ctaP.dataset.consumed = '1';
      return;
    }
    if (tag === 'P') {
      if (node.dataset.consumed) return;
      if (list && list.desc === node) return;
      if (isImageOnly(node)) {
        flushList(); flushAd();
        ad = {
          poster: node, title: null, text: null, cta: null,
        };
        return;
      }
      if (ad) {
        if (!ad.title && node.querySelector('strong') && !linkIn(node)) { ad.title = node; return; }
        if (linkIn(node)) { ad.cta = node; flushAd(); return; }
        ad.text = node;
        return;
      }
      flushList();
      if (isStrongLink(node)) out.push(footerCtaBlock(node));
      else if (linkIn(node)) out.push(textcompBlock(null, node));
    }
  });
  flushList(); flushAd();
  return out;
}

const COL3 = ['one', 'two', 'three'];
function columnClass(n, i, isAd) {
  if (n === 2) return `col col-sm-6${isAd ? ' m-0 light-grey-bg align-items-center' : ''}`;
  if (n === 3) return `col col-xs-12 col-sm-4${i === 2 ? ' light-grey-bg' : ''} ${COL3[i]}`;
  if (n === 5) return `col col-sm-3${i === 0 ? ' left-col' : ''}`;
  return 'col';
}

function panel(menu, columns) {
  const n = columns.length;
  const cols = columns.map((nodes, i) => {
    const blocks = columnBlocks(nodes);
    const isAd = blocks.length === 1 && blocks[0].classList.contains('topNavAd');
    const col = el('div', columnClass(n, i, isAd));
    col.append(...blocks);
    return { col, isAd };
  });
  let type = `${n}-column`;
  if (n === 2) type = cols.some((c) => c.isAd) ? 'two-column' : 'two-column-simple';
  else if (n === 3) type = 'three-column';
  else if (n === 5) type = 'five-column';
  const dd = el('div', 'dropdown', { 'data-menu': menu });
  const sub = el('div', 'subNavLinks');
  const subnav = el('div', `component-subnav d-flex ${type}`, { 'data-total-columns': type });
  const row = el('div', 'w-100 d-flex');
  if (n === 5) {
    row.append(cols[0].col);
    const mid = el('div', 'light-grey-bg middle-right-col');
    mid.append(...cols.slice(1).map((c) => c.col));
    row.append(mid);
  } else {
    row.append(...cols.map((c) => c.col));
  }
  subnav.append(row);
  sub.append(subnav);
  dd.append(sub);
  return dd;
}

function languagePanel(menu, nodes) {
  const dd = el('div', 'dropdown global-nav-link-list', { 'data-menu': menu });
  const heading = nodes.find((n) => n.tagName === 'H3');
  const ul = nodes.find((n) => n.tagName === 'UL');
  const head = el('span', 'header-item', { 'data-submenu-mobile': menu });
  if (heading) head.append(...heading.childNodes);
  dd.append(head);
  if (ul) {
    ul.className = 'm-0 p-0';
    [...ul.children].forEach((li) => {
      const a = linkIn(li);
      if (!a) return;
      const active = !!li.querySelector('strong');
      a.className = 'dropdown-item global-nav-link';
      a.dataset.link = a.getAttribute('href');
      li.textContent = '';
      li.className = active ? 'active' : '';
      li.append(a);
    });
    dd.append(ul);
  }
  return dd;
}

/* ------------------------------------------------------------------ mobile CTA holder + promo card
 * */
function promoCard(section) {
  if (!section) return null;
  const ps = kids(section).filter((n) => n.tagName === 'P');
  const logoP = ps.find((p) => media(p));
  const label = ps.find((p) => p !== logoP && !p.querySelector('strong'));
  const copy = ps.find((p) => p !== logoP && p !== label);
  const link = logoP ? linkIn(logoP) : null;
  const a = el('a', 'utility-nav__promo-card-link', { href: link ? link.href : '#', target: '_blank', rel: 'noopener noreferrer' });
  const card = el('div', 'utility-nav__promo-card w-100 flex-column d-flex');
  const row = el('div', 'utility-nav__promo-row d-flex flex-row align-items-center');
  const logo = el('div', 'utility-nav__promo-logo', { 'aria-label': 'Ansys' });
  const ci = el('div', 'component-image');
  const ci2 = el('div', 'cmp-image');
  const pic = media(logoP);
  if (pic) {
    const img = pic.querySelector('img') || pic;
    img.className = 'img-responsive _none_ svg';
    img.loading = 'lazy';
    ci2.append(pic);
  }
  ci.append(ci2);
  logo.append(ci);
  const divider = el('span', 'utility-nav__promo-divider');
  const linkText = el('div', 'utility-nav__promo-link-text d-flex align-items-center flex-row4');
  if (label) linkText.append(' ', ...label.childNodes, ' ');
  linkText.append(svg(SVG.promoArrow));
  row.append(logo, divider, linkText);
  const textWrap = el('div', 'utility-nav__promo-text');
  if (copy) textWrap.append(copy);
  card.append(row, textWrap);
  a.append(card);
  return a;
}

function ctaHolder(cta, promo) {
  const holder = el('div', 'cta-mobile-holder flex-column');
  if (cta) holder.append(cta);
  if (promo) holder.append(promo);
  return holder;
}

/* ------------------------------------------------------------------ behaviours (ported from the
 * gated prototype) */
function wireBehaviours(block) {
  const nav = block.querySelector('#topNav');
  const bar = block.querySelector('#utility-nav-bar');
  if (!nav) return;
  /* 1 — scroll pin: the nav sits under the utility bar, pins to the top once the bar scrolls off,
   * `overlapping` past its own height */
  const scrollState = () => {
    const barH = bar && getComputedStyle(bar).display !== 'none' ? bar.offsetHeight : 0;
    nav.style.top = `${Math.max(0, barH - window.scrollY)}px`;
    nav.classList.toggle('overlapping', window.scrollY > nav.offsetHeight);
  };
  window.addEventListener('scroll', scrollState, { passive: true });
  window.addEventListener('resize', scrollState);
  scrollState();
  /* 2 — utility bar language menu */
  const dd = bar && bar.querySelector('.dropdown');
  const ddBtn = dd && dd.querySelector('.dropdown-toggle');
  if (ddBtn) {
    const setOpen = (open) => { dd.classList.toggle('open', open); ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    ddBtn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!dd.classList.contains('open')); });
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }
  /* 3 + 4 — mega menu */
  const wrapper = nav.querySelector('#morph-dropdown-wrapper');
  const list = wrapper.querySelector('.dropdown-list');
  const items = [...nav.querySelectorAll('.main-nav > ul > li.main-nav-item')];
  const panels = [...wrapper.querySelectorAll('.dropdown-list > .dropdown')];
  const tris = [...wrapper.querySelectorAll('svg.triangle')];
  const panelFor = (li) => panels.find((p) => p.dataset.menu === li.dataset.menu) || null;
  const closeDesktop = () => {
    items.forEach((l) => l.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    wrapper.classList.remove('active');
    list.classList.remove('active');
  };
  const openDesktop = (li) => {
    const pnl = panelFor(li);
    if (!pnl) return;
    items.forEach((l) => l.classList.toggle('active', l === li));
    panels.forEach((p) => p.classList.toggle('active', p === pnl));
    const w = pnl.offsetWidth;
    const hgt = pnl.offsetHeight;
    const liRect = li.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const triX = liRect.left + liRect.width / 2 - 11;
    let left = Math.round(vw / 2 - w / 2);
    if (triX < left + 49) left = triX - 49;
    if (triX + 22 > left + w - 49) left = triX + 22 + 49 - w;
    list.style.left = `${left}px`;
    list.style.width = `${w}px`;
    list.style.height = `${hgt}px`;
    tris.forEach((t) => { t.style.left = `${triX}px`; });
    // observed: the pointer takes the grey fill only over a .light-grey-bg column that reaches the
    // panel's top edge
    const grey = pnl.querySelector('.light-grey-bg');
    let overGrey = false;
    if (grey) {
      const gr = grey.getBoundingClientRect();
      const pr = pnl.getBoundingClientRect();
      const gx0 = left + (gr.left - pr.left);
      const cx = triX + 11;
      overGrey = cx >= gx0 && cx <= gx0 + gr.width && (gr.top - pr.top) <= 1;
    }
    tris.forEach((t) => t.classList.toggle('light-grey-fill', overGrey));
    wrapper.classList.add('active');
    list.classList.add('active');
  };
  const openMobilePanel = (li) => {
    const pnl = panelFor(li);
    if (!pnl) return;
    items.forEach((l) => l.classList.toggle('active', l === li));
    panels.forEach((p) => p.classList.toggle('active', p === pnl));
    nav.classList.add('active-dropdown');
    wrapper.classList.add('active');
  };
  const closeMobilePanel = (clearPanels) => {
    items.forEach((l) => l.classList.remove('active'));
    if (clearPanels) panels.forEach((p) => p.classList.remove('active'));
    nav.classList.remove('active-dropdown');
    wrapper.classList.remove('active');
  };
  const setMobileOpen = (open) => {
    ['mobile-menu-opened', 'removeScroll'].forEach((c) => {
      document.documentElement.classList.toggle(c, open);
      nav.classList.toggle(c, open);
    });
    if (!open) closeMobilePanel(true);
  };
  let hoverTimer = null;
  items.forEach((li) => {
    li.addEventListener('mouseenter', () => { if (!DESK.matches) return; clearTimeout(hoverTimer); openDesktop(li); });
    li.addEventListener('click', (e) => {
      if (DESK.matches) { e.preventDefault(); openDesktop(li); return; }
      openMobilePanel(li);
    });
  });
  wrapper.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
  [nav, wrapper].forEach((node) => node.addEventListener('mouseleave', () => {
    if (!DESK.matches) return;
    hoverTimer = setTimeout(() => { if (!nav.matches(':hover') && !wrapper.matches(':hover')) closeDesktop(); }, 150);
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && DESK.matches) closeDesktop(); });
  const toggler = nav.querySelector('.navbar-toggler');
  const back = wrapper.querySelector('.header .back');
  if (toggler) toggler.addEventListener('click', () => setMobileOpen(!nav.classList.contains('mobile-menu-opened')));
  if (back) back.addEventListener('click', () => closeMobilePanel(false));
  const langLi = nav.querySelector('.main-nav .utility-nav li.language');
  if (langLi) langLi.addEventListener('click', () => openMobilePanel(langLi));
  wrapper.querySelectorAll('.component-subnav.five-column .component-nav-list .header-item').forEach((head) => {
    head.addEventListener('click', (e) => {
      if (DESK.matches) return;
      e.preventDefault();
      head.closest('.component-nav-list').classList.toggle('active');
    });
  });
  DESK.addEventListener('change', () => { closeDesktop(); setMobileOpen(false); });
}

/* ------------------------------------------------------------------ decorate */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;
  const pageType = getMetadata('page-type');
  if (pageType) document.body.dataset.pageType = pageType;

  const sections = [...fragment.querySelectorAll(':scope > .section, :scope > div')];
  const [brandS, primaryS, toolsS, utilityS, promoS, ...rest] = sections;

  // tools: plain paragraphs (search label, toggler label, back label), the CTA link, the mobile
  // utility labels
  const toolPs = kids(toolsS).filter((n) => n.tagName === 'P' && !linkIn(n));
  const labels = {
    search: text(toolPs[0]) || 'Search',
    toggler: text(toolPs[1]) || 'Toggle navigation',
    back: text(toolPs[2]) || 'Back',
    language: text(toolsS.querySelector('ul li')) || 'Language Selector',
    ask: text(toolsS.querySelector('ul li:nth-child(2)')) || 'Ask',
  };
  const ctaA = linkIn(toolsS);

  // brand
  const logo = liftLink(brandS, 'logo d-block');
  const brandLabel = logo.textContent;
  logo.textContent = '';
  logo.append(svg(SVG.logo), hidden(brandLabel));

  // primary nav
  const primary = primaryS.querySelector('ul');
  primary.className = 'utility-nav-enabled';
  [...primary.children].forEach((li) => {
    const label = el('span', 'main-nav-item-header');
    label.append(...li.childNodes);
    li.className = 'main-nav-item has-dropdown';
    li.dataset.menu = label.textContent.trim();
    li.append(label);
  });
  const utility = el('ul', 'utility-nav');
  const langLi = el('li', 'main-nav-item has-dropdown language', { 'data-menu': labels.language });
  const langLabel = el('span', 'main-nav-item-header', { tabindex: '0' });
  langLabel.textContent = labels.language;
  langLi.append(langLabel);
  const askLi = el('li', '', { 'data-menu': 'AI Assistant' });
  const askBtn = el('button', '', { id: 'ai-assistant-chatbot-mob', type: 'button' });
  const askSpan = el('span');
  askSpan.textContent = labels.ask;
  askBtn.append(' ', askSpan, ' ');
  askLi.append(askBtn);
  utility.append(langLi, askLi);
  const mainNav = el('nav', 'main-nav', { 'aria-label': 'Main' });
  mainNav.append(primary, utility);

  // right tools
  const right = el('div', 'nav-items-right d-flex');
  const searchBtn = el('button', 'icon-search', { id: 'nav-coveo-search-btn', type: 'button' });
  searchBtn.append(hidden(labels.search), svg(SVG.search));
  right.append(searchBtn);
  let ctaMobile = null;
  if (ctaA) {
    ctaMobile = stripInstrumentation(ctaA.cloneNode(true));
    ctaMobile.className = 'component-button d-flex cta cta-mobile darkButtonRollover';
    ctaA.className = 'component-button m-0 cta darkButtonRollover';
    right.append(ctaA);
  }
  const toggler = el('button', 'navbar-toggler border-0', { type: 'button', 'aria-label': labels.toggler });
  toggler.append(svg(SVG.togglerOpen), svg(SVG.togglerClose));
  right.append(toggler);

  const top = el('div', 'nav-top-wrapper d-flex');
  top.append(logo, mainNav, right);

  // panels: a section starting with <h2> opens a panel; following h2-less sections are its columns
  const menus = new Set([...primary.children].map((li) => li.dataset.menu));
  const groups = [];
  rest.forEach((section) => {
    const nodes = kids(section);
    const h2 = nodes.find((n) => n.tagName === 'H2');
    if (h2) groups.push({ menu: text(h2), columns: [nodes] });
    else if (groups.length) groups[groups.length - 1].columns.push(nodes);
  });
  const dropdownList = el('div', 'dropdown-list');
  groups.forEach((g) => {
    if (menus.has(g.menu)) dropdownList.append(panel(g.menu, g.columns));
    else dropdownList.append(languagePanel(g.menu, g.columns.flat()));
  });

  const promo = promoCard(promoS);
  const holder1 = ctaHolder(ctaMobile, promo);
  const holder2 = ctaHolder(
    ctaMobile ? stripInstrumentation(ctaMobile.cloneNode(true)) : null,
    promo ? stripInstrumentation(promo.cloneNode(true)) : null,
  );

  const search = el('div', '', { id: 'search-wrapper' });
  search.innerHTML = SEARCH_HTML;

  const morph = el('div', '', { id: 'morph-dropdown-wrapper' });
  const backWrap = el('div', 'header w-100');
  const backBtn = el('button', 'back', { type: 'button' });
  backBtn.textContent = labels.back;
  backWrap.append(backBtn);
  morph.append(svg(SVG.triangle), svg(SVG.triangleShadow), backWrap, dropdownList, holder2);

  const nav = el('div', 'component-nav-top', { id: 'topNav', 'data-color-theme': 'dark' });
  nav.append(top, holder1, search, morph);

  const floating = el('button', 'border-gradient-ask spin sparkleAnim', { id: 'floating-icon', type: 'button', 'aria-label': labels.ask });
  const floatingSpan = el('span');
  floatingSpan.textContent = labels.ask;
  floating.append(svg(SVG.ask), floatingSpan);

  block.append(buildUtilityBar(utilityS, labels), nav, floating);
  wireBehaviours(block);
}
