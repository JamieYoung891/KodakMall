var bgimgInserter = (() => {

    function doIt (element, imagesArray, intervalTime) {

        for (let i = 0; i < imagesArray.length - 1; i++) {
            
            let url = 'url(' + imagesArray[i].src +')';

            insert(element, url, intervalTime, i)

            if(intervalTime > intervalTime / 2)
            intervalTime -= (intervalTime * 0.023).toFixed(0);
        };
    };
    
    function insert(element, url, intervalTime, i){
        (function(element, url, intervalTime, i){
            setTimeout( function() {
            element.style.backgroundImage = url;
            }, intervalTime * i);
        })(element, url, intervalTime, i);
    };

    return {
        doIt : (element, imagesArray, intervalTime) =>
        {doIt (element, imagesArray, intervalTime)}}
})();