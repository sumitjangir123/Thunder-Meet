var obj=document.querySelectorAll(".zoom");function animateValue(e,n,t,i){var o=t-n,r=n,d=t>n?1:-1,a=Math.abs(Math.floor(i/o)),l=document.getElementById(e),m=setInterval((function(){r+=d,l.innerHTML=r,r==t&&clearInterval(m)}),a)}for(i of obj)i.innerText>0&&animateValue(i.getAttribute("id"),0,i.innerText,1e3);var windowWidth=window.innerWidth;if(windowWidth<=400){var i=document.getElementById("old"),d=document.getElementById("new");d.innerHTML+=i.innerHTML}