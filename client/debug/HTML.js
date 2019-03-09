export  function getAllScroll() {
    
    return Array.from(document.getElementsByTagName("*"))
    .filter((item)=>item.scrollTop || item.scrollLeft)
    .map((item)=>
    {
        return {
            html: item,
            top: item.scrollTop,
            left: item.scrollLeft,
        }
    });
}
