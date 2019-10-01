
//////////////////// 인트로 효과 시각화를 위한 엘리먼트 매니저
// 
// DOM의 엘리먼트를 가져와 클론 후 DOM에서 삭제한다.
//
// 저장된 엘리먼트는 DOMNodeInserted 이벤트 리스너가 추가되어 선언되며,
// DOM 삽입 시 동적효과를 구현하는 function이 실행된다.
// 
// 엘리먼트는 하단 삽입 자동화 메소드에 의해 자동 삽입된다.
// 

var elementManager = (function() {
    
    // 삽입 자동화를 위해 기록하는 배열변수 선언
    var elementsArray = [];
    var functionsArray = []; // 이벤트 함수 삭제를 위한 배열

    

    // DOM body의 child 엘리먼트를 storage 엘리먼트 객체로 이동
    function backupAndReset(element){
        
        let backupElement = element.cloneNode(true);
        element.innerHTML = "";
    
        return backupElement;
    }
    
    
    
    // 엘리먼트 선언과 이벤트 리스너 추가를 위한 메소드
    function declare (className, elementStorage, eventFunction, eventNum, eventString) {
        let event = 'DOMNodeInserted'
        if(eventNum) event = eventSelector(eventNum);
        if(eventString) event = eventString;
        
        let element = elementStorage.getElementsByClassName(className)[0];
        element.addEventListener(event, eventFunction) // 이벤트리스너 삽입
    
        elementsArray.push(element);
        functionsArray.push(eventFunction);
    
        return element
    }
    
    // 엘리먼트 삽입과 이벤트 리스너 삭제를 위한 메소드
    function insert (parentElement, childElement, eventFunction, eventNum, eventString) {
        let event = 'DOMNodeInserted'
        if(eventNum) event = eventSelector(eventNum);
        if(eventString) event = eventString;
    
        parentElement.appendChild(childElement);
        childElement.removeEventListener(event, eventFunction); // 이벤트리스너 삭제
    }
    
    // 이벤트 번호에 따른 이벤트명 선택을 위한 메소드
    function eventSelector(eventNum) {
        switch (eventNum) {
            case 0: return 'DOMNodeInserted'
            case 1: return 'mouseenter'
            case 2: return 'click'
        };
    }
    


    
    
    //////////////////// 엘리먼트 삽입 자동화
    // 
    // 개별 엘리먼트의 이벤트 함수에는 이펙트 종료 시기에,
    // class명을 부여하여 fade-out 애니메이션이 적용되게 하였다.
    // 
    // 옵저버를 사용해 상기 class명의 변겅으로 인한 attributes에서의
    // 변화를 감지하여, 다음 순서의 엘리먼트가 자동으로 삽입되게 하였다.
    //

    function insertAutomation(containerElement, delayTime) {

        for (let elementIndex = 0; elementIndex < elementsArray.length -1; elementIndex++) {
            
            let element = elementsArray[elementIndex];
    
            let nextElement = elementsArray[elementIndex + 1];
            let nextElementFunction = functionsArray[elementIndex + 1]; // 이벤트 함수 삭제를 위한 변수 선언

            

            let observer = new MutationObserver(observerFunction);
    
            function observerFunction(){
                if (delayTime) { // 지연시간 설정 시 지연 삽입

                    ((containerElement, nextElement, nextElementFunction) => {
                        setTimeout(() => {
                            insert(containerElement, nextElement, nextElementFunction);
                        }, delayTime);
                    })(containerElement, nextElement, nextElementFunction);

                } else {
                    
                    insert(containerElement, nextElement, nextElementFunction);
                };
            };

            let observerOption = {attributes: true};
            observer.observe(element, observerOption);
        };
    };

    return {

        backupAndReset :
            function (element) {return backupAndReset(element)},

        declare :
            function (className, elementStorage, eventFunction, eventNum, eventString)
            {return declare(className, elementStorage, eventFunction, eventNum, eventString)},
        
        insert :
            function (parentElement, childElement, eventFunction, eventNum, eventString)
            {insert(parentElement, childElement, eventFunction, eventNum, eventString)},
        
        insertAutomation :
            function (containerElement, delayTime)
            {insertAutomation(containerElement, delayTime)}
    }
})();