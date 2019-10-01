
//////////////////// 이미지 로드 및 로드 인디케이터 삽입
// 
// 몽타주에 사용되는 이미지를 로드하는 동안,
// 로드된 양을 표기하는 인디케이터를 삽입하여,
// 사용자로 하여금, 로드 사실을 인지하게 한다.
// 

var imagePreloader = (() => {

    var loadCheck = 0; // 이미지 로드 완료를 확인하기 위한 변수
    


    function get (itemURL, itemNumber, itemFileExtension, isRandom, progressElement, textElement, callback) {

        // 이미지 로드 인디케이터 유무에 따른 처리
        if(progressElement)
        progressElement.max = itemNumber;

        if(textElement)
        textElement.textContent = '0%';

        
        
        var itemArray = [];

        for (let i = 0; i < itemNumber; i++){
            
            let src = itemURL + i + itemFileExtension;
            itemArray.push(load(itemArray, src, itemNumber, progressElement, textElement, callback));

        }

        if(isRandom) // 필요 시 아이템 순서 무작위로 변경
        shuffle(itemArray);

        return itemArray
    };
    

    
    function load (itemArray, src, itemNumber, progressElement, textElement, callback) {

        let image = new Image();
    
        image.addEventListener('load', loadChecker);
        image.src = src;
        
        return image;
    


        // 개별 아이템 로드 완료 시 수행될 메소드
        function loadChecker() {

            image.removeEventListener('load', loadChecker); // 이벤트 리스너 삭제

            
            loadCheck += 1;

            if(progressElement)
            progressElement.value = loadCheck;

            if(textElement)
            textElement.textContent = Math.floor(loadCheck / itemNumber  * 100) + '%';

    
            if (loadCheck >= itemArray.length && callback)
            callback(); // 전체 이미지 로드 완료 시 수행할 메소드
        }
    }
    
    
    
    // 배열 순서 무작위 변경을 위한 메소드
    function shuffle (array) {
        let i, j, x;
        
        for (i = array.length - 1; i > 0 ; i--) {
            j = Math.floor(Math.random() * (i + 1));
            
            x = array[j];
            array[j] = array[i];
            array[i] = x;
        }
    }



    return {
        get : 
            (itemURL, itemNumber, itemFileExtension, isRandom, progressElement, textElement, callback) => {
                return get(itemURL, itemNumber, itemFileExtension, isRandom, progressElement, textElement, callback)
            }
    }

})();