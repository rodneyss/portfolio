/*global jQuery */
/*!
* Lettering.JS 0.7.0
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
!function(a){function b(b,c,d,e){var f=b.text(),g=f.split(c),h="";g.length&&(a(g).each(function(a,b){h+='<span class="'+d+(a+1)+'" aria-hidden="true">'+b+"</span>"+e}),b.attr("aria-label",f).empty().append(h))}var c={init:function(){return this.each(function(){b(a(this),"","char","")})},words:function(){return this.each(function(){b(a(this)," ","word"," ")})},lines:function(){return this.each(function(){var c="eefec303079ad17405c889e092e105b0";b(a(this).children("br").replaceWith(c).end(),c,"line","")})}};a.fn.lettering=function(b){return b&&c[b]?c[b].apply(this,[].slice.call(arguments,1)):"letters"!==b&&b?(a.error("Method "+b+" does not exist on jQuery.lettering"),this):c.init.apply(this,[].slice.call(arguments,0))}}(jQuery);