var textTyper = ((none)=>{

    return {
        doIt : (effectElementContainer, effectElementDepth, passItemClassName, intervalTime, cursorNum, cursorTime, opacityTime) =>
        {doIt (effectElementContainer, effectElementDepth, passItemClassName, intervalTime, cursorNum, cursorTime, opacityTime)}
    };
    
    function doIt (effectElementContainer, effectElementDepth, passItemClassName, intervalTime, cursorNum, cursorTime, opacityTime) {
        
        if(intervalTime == none || intervalTime == null || intervalTime>100 || intervalTime < 10)
        intervalTime = 50;

        if(cursorNum>5 || cursorNum <= 0)
        cursorNum = 3;

        if(cursorNum)
        if(cursorTime == null || cursorTime == none)
        cursorTime = 500;

        if(opacityTime > 1000 || opacityTime < 100)
        opacityTime = 500;



        // 엘리먼트 깊이에 따른 로직 다변화 스위치
        switch (effectElementDepth) {
    
            case 0: // item
                typingEffectSetter();
                break;
    
            case 1: // row
                inRowTypingEffectSetter(effectElementContainer);
                break;
    
            case 2: // paragraph
                inParagraphTypingEffectSetter(effectElementContainer);
                break;
    
        };
    
        
    
        async function typingEffectSetter(effectElementLocation) {

            if (effectElementLocation == null)
            effectElementLocation = [0, 0];
    
            let totalOrderNumber =
            await typingOrderNumberFinder(effectElementContainer, effectElementDepth, effectElementLocation, cursorNum, passItemClassName);
    
            typingEffectInserter(effectElementContainer, effectElementDepth, effectElementLocation, totalOrderNumber, intervalTime, cursorNum, cursorTime, opacityTime);
        }
    
        function inRowTypingEffectSetter(row, rowIndex) {
    
            for (let itemIndex = 0; itemIndex < row.children.length; itemIndex++) {
    
                let item = row.children[itemIndex];
    
                // 패스 아이템 체크
                if (passItemClassName)
                if (item.classList.contains(passItemClassName))
                continue;
    
                let effectElementLocation = [itemIndex, rowIndex];
    
                typingEffectSetter(effectElementLocation);
            };
        };
    
        function inParagraphTypingEffectSetter(paragraph) {
    
            for (let rowIndex = 0; rowIndex < paragraph.children.length; rowIndex++) {
    
                let row = paragraph.children[rowIndex];
    
                inRowTypingEffectSetter(row, rowIndex);
    
            };
        }
    };
    
    




    // 타이핑 효과 순서 확인
    async function typingOrderNumberFinder(effectElementContainer, effectElementDepth, effectElementLocation, cursorNum, passItemClassName) {
    
        // 타이핑 효과 지연 순서 변수
        let totalOrderNumber = [], typingOrderNumber = 0, cursorOrderNumber = null;
        

        // 엘리먼트 위치 변수
        let itemIndex = null, rowIndex = null;

        if (effectElementLocation) {
            itemIndex = effectElementLocation[0];
            
            if(effectElementLocation.length > 1)
            rowIndex = effectElementLocation[1];
        };
        
    
        let preItemCount = itemIndex; // 아이템 간 간격 처리를 위한 변수
        let passItemCount = 0; // 패스 아이템에 대한 커서 효과 지연 순서 처리를 위한 변수
    

    
        // 엘리먼트 깊이에 따른 로직 다변화 스위치
        switch (effectElementDepth) {
    
            case 0: // item
                cursorOrderNumber += cursorNum;
                totalOrderNumberSetter();
                return totalOrderNumber;
    
            case 1: // row
                inRowOrderNumberFinder(effectElementContainer, itemIndex);
                additionalOrderNumFinder();
    
                totalOrderNumberSetter();
                return totalOrderNumber;
    
            case 2: // paragraph
                inParagraphOrderNumberFinder(effectElementContainer, itemIndex, rowIndex);
                additionalOrderNumFinder();
    
                totalOrderNumberSetter();
                return totalOrderNumber;
    
            default:
                totalOrderNumberSetter();
                return totalOrderNumber;
        };
    
    
    
        function totalOrderNumberSetter(){
            totalOrderNumber = [typingOrderNumber, cursorOrderNumber];
        };
    
        function inRowOrderNumberFinder(effectElementContainer, itemIndex) {
            if (itemIndex > 0) {
                for (let preItemIndex = 0; preItemIndex < itemIndex; preItemIndex++) {
                    let preItem = effectElementContainer.children[preItemIndex];
    
                    typingOrderNumberCalculator(preItem, preItemIndex);
                };
            };
        };
    
        function inParagraphOrderNumberFinder(effectElementContainer, itemIndex, rowIndex) {
            if (rowIndex > 0) {
                for (let preRowIndex = 0; preRowIndex < rowIndex; preRowIndex++) {
                    let preRow = effectElementContainer.children[preRowIndex]
                    
                    preItemCount += preRow.children.length;
    
                    for (let preItemIndex = 0; preItemIndex < preRow.children.length; preItemIndex++) {
                        let preItem = preRow.children[preItemIndex];
                        
                        typingOrderNumberCalculator(preItem, preItemIndex);
                    };
                };
            };
            
            let rowElement = effectElementContainer.children[rowIndex];
            inRowOrderNumberFinder(rowElement, itemIndex);
        }
    
    
    
        function typingOrderNumberCalculator(item, itemIndex) {
            
            if (passItemClassName == null){ // 패스 아이템 클래스명 미지정 시
                typingOrderNumber += item.textContent.length;
                
            } else { // 패스 아이템 클래스명 지정 시
    
                // 패스 아이템이 아닐 시
                if(!item.classList.contains(passItemClassName))
                typingOrderNumber += item.textContent.length;
    
                // 패스 아이템이 맞을 시 커서 효과를 위한 처리
                else if (cursorNum) {
                    if (itemIndex == 0) passItemCount += 2;
                    else passItemCount += 1;
                };
            };
        };

    
    
        function additionalOrderNumFinder() {

            if (!cursorNum) { // 커서 효과 미부여 시 아이템 간, 줄 간 "지연 순서" 생성
            
                typingOrderNumber += preItemCount * 5 // 아이템 간 "지연 순서" 부여
                typingOrderNumber += rowIndex * 5 // 줄 간 "지연 순서" 부여
    
            } else { // 커서 효과 지연 순서 확인

                cursorOrderNumber = 0; // 초기화
    
                if (itemIndex == 0) cursorOrderNumber += cursorNum; // row 내 지연 순서
                else cursorOrderNumber += ((itemIndex + 1) * cursorNum);
                
                if (rowIndex && rowIndex > 0) // paragraph 내 지연 순서
                cursorOrderNumber += (rowIndex * cursorNum) + ((preItemCount - itemIndex) * cursorNum);
                
                if (passItemClassName) // 패스 아이템에 대한 처리
                cursorOrderNumber -= (passItemCount * cursorNum);
            };
        };
    
    };
    
    
    



    // 타이핑 효과 삽입
    async function typingEffectInserter(effectElementContainer, effectElementDepth, effectElementLocation, totalOrderNumber, intervalTime, cursorNum, cursorTime, opacityTime) {
    
        // 타이핑 효과 순서 선언
        let typingOrderNumber = totalOrderNumber[0];
        let cursorOrderNumber = null;
        if (cursorNum) cursorOrderNumber = totalOrderNumber[1];
    
    
        // 효과 엘리먼트 위치 선언
        let itemIndex = null;
        let rowIndex = null;
        
        if (effectElementLocation) {
            itemIndex = effectElementLocation[0];
            
            if(effectElementLocation.length > 1)
            rowIndex = effectElementLocation[1];
        };
    
        let item = null;
        let textStorage = null;
    
    
    
        // 엘리먼트 깊이에 따른 로직 다변화 스위치
        switch (effectElementDepth) {
    
            case 0: // item
                
                item = effectElementContainer;
                textStorage = textContentSetter(item);
    
                totalEffects(item, textStorage);
                break;
    
            case 1: // row
                item = effectElementContainer.children[itemIndex];
                textStorage = textContentSetter(item);
    
                totalEffects(item, textStorage);
                break;
    
            case 2: // paragraph
                item = effectElementContainer.children[rowIndex].children[itemIndex];
                textStorage = textContentSetter(item);
    
                totalEffects(item, textStorage);
                break;
    
            default:
                item = effectElementContainer;
                textStorage = textContentSetter(item);
    
                totalEffects(item, textStorage);
                break;
    
        }
    


        function textContentSetter(item) {
            let textStorage = item.textContent;
            item.textContent = " ";
            return textStorage
        }
    
        function totalEffects(item, textStorage){
            typingEffects(item, textStorage);
    
            if (cursorNum) cursorEffects(item, textStorage);
            if (opacityTime) opacityEffects(item, textStorage);
            if (opacityTime) displayEffects(item, textStorage);
        }
    
    
    
        // 커서 효과
        function cursorEffects(item, textStorage) { // 커서 효과 삽입을 위한 메소드 호출
            
            if (itemIndex == 0) {
                let cursorOrderNumber_beforeTyping = cursorOrderNumber - cursorNum;
                cursorEffectInserter(item, cursorNum, typingOrderNumber, intervalTime, cursorOrderNumber_beforeTyping, cursorTime, true);
            };
    
            let typingOrderNumber_afterTyping = typingOrderNumber + textStorage.length;
            cursorEffectInserter(item, cursorNum, typingOrderNumber_afterTyping, intervalTime, cursorOrderNumber, cursorTime);
        };
    
        function cursorEffectInserter(item, cursorNum, typingOrderNumber, intervalTime, cursorOrderNumber, cursorTime, isItBefore) {
            for (let cursorIndex = 0; cursorIndex < cursorNum * 2; cursorIndex++) {
                (function(item, typingOrderNumber, intervalTime, cursorOrderNumber, cursorNum, cursorTime, cursorIndex){
    
                    setTimeout( function() {
    
                        if ((cursorIndex % 2) == 0) {
                            item.textContent =
                                item.textContent.slice(0, -1)
                                + "_"
                                + item.textContent[item.textContent.length -1]
                            ;
                        };
    
                        if ((cursorIndex % 2) != 0) {
                            item.textContent =
                                item.textContent.slice(0, -2)
                                + item.textContent[item.textContent.length -1]
                            ;
                        };
    
                        if (cursorIndex == cursorNum * 2 - 1 && !isItBefore) item.textContent = item.textContent.slice(0, -1);
                        
                    }, (typingOrderNumber * intervalTime) + (cursorOrderNumber * cursorTime) + (cursorIndex * (cursorTime / 2)) );
    
                })(item, typingOrderNumber, intervalTime, cursorOrderNumber, cursorNum, cursorTime, cursorIndex);
            };
        };
    
    
    
        // 타이핑 효과
        function typingEffects (item, textStorage) {
            for (let charNum = 0; charNum < textStorage.length; charNum++) {
                (function(item, textStorage, charNum, typingOrderNumber, intervalTime, cursorOrderNumber, cursorTime){
                    
                    setTimeout( function() {
                        
                        item.textContent =
                        item.textContent.slice(0, -1)
                        + textStorage[charNum]
                        + "_";
                        
                        if(charNum == textStorage.length - 1) {
                            item.textContent = item.textContent.slice(0, -1) + " ";
                            if(!cursorTime) item.textContent = item.textContent.slice(0, -1);
                        };
    
                    }, delayTimeCalculator(intervalTime, typingOrderNumber, charNum, cursorOrderNumber, cursorTime));
    
                })(item, textStorage, charNum, typingOrderNumber, intervalTime, cursorOrderNumber, cursorTime);
            };
        };
    
    
    
        // opacity-zero 효과
        function opacityEffects (item, textStorage) {
            if (itemIndex == item.parentElement.childElementCount - 1){
                let typingOrderNumber_afterTyping = typingOrderNumber + textStorage.length;
    
                let cursorOrderNumber_afterCursor = null;
                if (cursorNum) cursorOrderNumber_afterCursor = cursorOrderNumber + cursorNum;
    
                for (let childNum = 0; childNum < itemIndex; childNum++) {
                    
                    (function(item, childNum, opacityTime, typingOrderNumber, intervalTime, cursorOrderNumber, cursorTime){
    
                        setTimeout( function() {
                            item.parentElement.children[childNum].classList.add('opacity-zero-animation');
                        }, delayTimeCalculator(intervalTime, typingOrderNumber, childNum, cursorOrderNumber, cursorTime, opacityTime));
    
                    })(item, childNum, opacityTime, typingOrderNumber_afterTyping, intervalTime, cursorOrderNumber_afterCursor, cursorTime);
                }
    
                setTimeout( function() {
                    item.parentElement.children[itemIndex].classList.add('opacity-zero-animation');
                }, delayTimeCalculator(intervalTime, typingOrderNumber_afterTyping, itemIndex + 2, cursorOrderNumber_afterCursor, cursorTime, opacityTime));
    
            }
        }
    
    
    
        // display-none 효과
        function displayEffects (item, textStorage) {
            if (item == item.parentElement.parentElement.lastElementChild.lastElementChild
                && itemIndex == item.parentElement.childElementCount - 1) {
                
                let typingOrderNumber_afterTyping = typingOrderNumber + textStorage.length;
                let cursorOrderNumber_afterCursor = cursorOrderNumber + cursorNum;
    
                setTimeout( function() {
                    item.parentElement.parentElement.classList.add('display-none-animation');
                }, delayTimeCalculator(intervalTime, typingOrderNumber_afterTyping, itemIndex + 5, cursorOrderNumber_afterCursor, cursorTime, opacityTime));
            };
        }
    
    
    
        // 효과 지연 시간 계산
        function delayTimeCalculator(intervalTime, typingOrderNumber, arrayNum, cursorOrderNumber, cursorTime, opacityTime){
            if (opacityTime) {
                if (cursorTime && cursorOrderNumber)
                return (intervalTime * typingOrderNumber) + (cursorOrderNumber * cursorTime) + (opacityTime * (arrayNum + 1))
    
                else
                return (intervalTime * typingOrderNumber) + (opacityTime * (arrayNum + 1))
    
            } else {
    
                if(cursorTime && cursorOrderNumber)
                return (intervalTime * (typingOrderNumber + arrayNum)) + (cursorOrderNumber * cursorTime)
    
                else
                return (intervalTime * (typingOrderNumber + arrayNum))
            };
        };
    };
})();