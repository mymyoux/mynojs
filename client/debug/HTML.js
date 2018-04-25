export  function getAllScroll() {
    
    return Array.from(document.getElementsByTagName("*"))
    .filter((item)=>item.scrollTop)
    .map((item)=>
    {
        return {html:item, scroll:item.scrollTop}
    });
}
