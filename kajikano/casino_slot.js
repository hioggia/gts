function tp(s){$(s).trigger('tap')};function tz(s){var _=$('div',s),__=_.size()-1,___=0;_.each(function(i,____){___+=~~____.className.split('_')[1]*Math.pow(10,__-i)});return ___}function m(p,g){if(tz('.prt-medal')<=p || tz('.prt-medal')>=g){console.info('end');return}if(tz('.prt-bet')==0){o=0;var r=tz('.prt-won');l.push(r);console.info(r);tp('.prt-bet-max')}else if(o++>30){location.reload()}setTimeout(m,1000*2)}Object.defineProperty(window,'v',{get:function(){var t=0;l.forEach(function(v){t+=v;});return t-l.length*b}});var l=[],o=0,b=300;m(1000000,10000000)