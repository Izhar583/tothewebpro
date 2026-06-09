/* Run FooBox FREE (v2.7.35) */
var FOOBOX = window.FOOBOX = {
	ready: true,
	disableOthers: false,
	o: {wordpress: { enabled: true }, countMessage:'image %index of %total', captions: { dataTitle: ["captionTitle","title"], dataDesc: ["captionDesc","description"] }, rel: '', excludes:'.fbx-link,.nofoobox,.nolightbox,a[href*="pinterest.com/pin/create/button/"]', affiliate : { enabled: false }},
	selectors: [
		".gallery", ".wp-block-gallery", ".wp-caption", ".wp-block-image", "a:has(img[class*=wp-image-])", ".foobox"
	],
	pre: function( $ ){
		// Custom JavaScript (Pre)
		
	},
	post: function( $ ){
		// Custom JavaScript (Post)
		
		// Custom Captions Code
		
	},
	custom: function( $ ){
		// Custom Extra JS
		
	}
};