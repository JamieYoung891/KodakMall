//////////////////// 텍스트 몽타주 효과
// 
// 텍스트를 단어 단위로 잘라 강렬한 색상의 몽타주 효과를 부여한다.
// 
// 색상 및 글자 크기에 대해 사용자가 개별 설정할 수 있게 하였으며,
// 색상의 경우 프로그램이 자동 지정하게 할 수도 있게 하였다.
// 
// colorMood 옵션을 제공하여 웹 사이트에 일관성을 지키게 했다.
// 
// 간편한 사용을 위해 필요 데이터 오브젝트를 제공한다.
// 

onload = () => {
    
    textMontage.requiredData.containerElement = document.getElementsByClassName('mall-intro-section')[0];
    textMontage.requiredData.textElementArray = document.getElementsByClassName('mall-intro-text');
    textMontage.requiredData.colorArray = ['#e30613', '#fab617'];
    textMontage.requiredData.callback = () => {window.location = 'mall-main.html'};

    textMontage.doIt(textMontage.requiredData);
    
};


var textMontage = (() => {

    return {

        requiredData : {
            containerElement : null,                // 효과를 주려하는 텍스트 엘리먼트의 상위 엘리먼트: 풀스크린으로 스타일링되어 있어야 함
            textElementArray : null,                // 효과를 주려하는 텍스트 엘리먼트 배열
            wordSeperator : " ",                    // 필요에 따라 Seperator를 지정하게 한다

            intervalTime: 1000,                     // word간 부여될 간격 시간
            
            fontSize: [150, 'vw'],                  // 16:9 스크린 기준 150vw
            colorArray: null,                       // colorArray[0]을 어두운 색으로, colorArray[1]을 밝은 색으로 지정한다. null 시 자동 지정
            colorMood: null,                        // 'light' 또는 'dark', null시 'light' 무드

            callback : null                         // 효과 이후 적용할 함수, null시 containerElement에 display: none 지정한다.
        },



        doIt : (requiredData) => { ((data, none) => {

            if(!data || data == none || data == null){
                console.log('requiredData: Missing!')

            } else {
                var messege, ctnElm = data.containerElement, tElmArray = data.textElementArray;
                if (!ctnElm || ctnElm == none || ctnElm == null)
                messege = 'requiredData.containerElement: Missing!';
                else if (!tElmArray || tElmArray == none || tElmArray == null)
                messege = 'requiredData.textElementArray: Missing!';
    
                if (messege) console.log(messege);
                else textContentChanger(data);
            }

        })(requiredData);
        }

    }



    async function textContentChanger(data) {

        let // object 데이터 꺼내기
        containerElement = data.containerElement,
        textElementArray = data.textElementArray,
        wordSeperator = data.wordSeperator,

        intervalTime = data.intervalTime,

        colorArray = data.colorArray,
        colorMood = data.colorMood,
        fontSize = data.fontSize,

        callback;

        if (data.callback == null)
        callback = () => {containerElement.style.display = 'none'};
        else
        callback = data.callback;

        let colorSet = colorSelector(colorArray, colorMood);



        let insertOrderCount = 0;

        for (let textElementArrayIndex = 0; textElementArrayIndex < textElementArray.length; textElementArrayIndex++) {
            let isThisTheEnd = (textElementArrayIndex == textElementArray.length -1);

            let element = textElementArray[textElementArrayIndex];
            
            let textStorage = element.textContent;
            element.textContent = "";

            let textArray = textStorage.split(wordSeperator);
            let insertOrder = await insertOrderCounter(textArray);

            effectSetter(
                containerElement, element, isThisTheEnd,
                textArray, insertOrder, intervalTime,
                fontSize, colorSet
            );

            if(textElementArrayIndex == textElementArray.length - 1)
            setTimeout(() => {
                callback();
            }, ((insertOrder[insertOrder.length - 1] * intervalTime) + intervalTime));
        };



        function insertOrderCounter(textArray) {

            let insertOrder = []
            for (let index = 0; index < textArray.length; index++) {

                if(index % 2 != 0){
                    insertOrderCount += 1/2;
                    insertOrder.push(insertOrderCount);
                    
                }
                else{
                    insertOrder.push(++insertOrderCount);
                }
            }
            
            return insertOrder;
        };
    };


    
    // 컬러 세팅
    function colorSelector(colorArray, colorMood, none) {

        if(colorArray == null || colorArray == none){
            return colorSelector(randomColorSet(), colorMood);
        } else {
            let color1 = colorArray[0], color2 = colorArray[1];

            var colorPreset = {
                0 : [color1, color2],
                1 : [color1, 'black'],
                2 : [color1, 'white'],
                3 : [color2, color1],
                4 : [color2, 'black'],
                5 : [color2, 'white'],
                6 : ['black', color1],
                7 : ['black', color2],
                8 : ['white', color1],
                9 : ['white', color2],
            }

            var moodPreset = {
                'light' : [colorPreset[0], colorPreset[3], colorPreset[2], colorPreset[5]],
                'dark' : [colorPreset[3], colorPreset[0], colorPreset[4], colorPreset[1]]
            }

            switch (colorMood) {
                case 'light':
                    return moodPreset.light;
                case 'dark':
                    return moodPreset.dark;
                default:
                    return moodPreset.light;
            };
        };
    };

    function randomColorSet(){
        let colorType = color2Getter();
        let preSet = [0.5,0.5,0.5];


        let rgbArray = [... preSet];
        rgbArray[colorType[0]] = 9;
        rgbArray[colorType[1]] = 6.5;

        rgbArray = [preSet, rgbArray];
        rgbArray[0][colorType[0]] = 8.5;
        rgbArray[0][colorType[1]] = 0;


        for (let i = 0; i < rgbArray.length; i++)
        rgbArray[i] = toHash(rgbArray[i]);

        console.log(rgbArray);
        

        return rgbArray;



        function color2Getter() {
            let color2 = [getPrimary(), getPrimary()];

            if (color2[0] == color2[1])
            color2 = color2Getter();
            
            return color2;
            


            function getPrimary() {return Math.floor(Math.random() * 3)};
        };



        function toHash(rgbArray) {
            let color = '#';
    
            for (let i in rgbArray)
            color += hex256(rgbArray[i]);
    
            return color;
    
    
    
            function hex256(colorLevel){
    
                let number;
    
                if(0 <= colorLevel <= 9)    
                number = (Math.floor((Math.random() + colorLevel) * 25.6)).toString(16);
    
                else
                number = '00';
    
                if (number.length==1)
                number = 0 + number;
    
                return number;
            };
        };
    };



    function effectSetter(containerElement, element, isThisTheEnd, textArray, insertOrder, intervalTime, fontSize, colorSet, none) {

        for (let index = 0; index < textArray.length; index++) {
            let text = textArray[index];

            textSetter(text, index, textArray.length - 1);
            colorSetter(index);
        }



        function textSetter(text, index, lastIndex) {
            setTimeout(() => {

                element.textContent = text;
                element.style.fontSize = Math.floor(fontSize[0] / text.length) + fontSize[1];

                if(index == lastIndex)
                setTimeout(() => {
                    element.textContent = "";
                }, intervalTime - 1);
                
            }, intervalTime * insertOrder[index]);
        };


        
        function colorSetter(index) {

            let color, subOrderLevel = 1 / 2 /4.01

            let delayTime;
            if(index == 0 || index % 2 != 0)
            delayTime = insertOrder[index] * intervalTime;



            // 텍스트 아이템 별 세팅
            if (index % 2 == 0) {

                if(index == 0){
                    color = colorSet[1];
                    colorInserter(color, delayTime);

                } else {
                    for (let i = subOrderLevel; i < 1 / 2; i+=subOrderLevel) {
                        
                        delayTime = (insertOrder[index] + i - subOrderLevel) * intervalTime;
    
                        if ((i / subOrderLevel) % 2 == 0) color = colorSet[0];
                        else color = colorSet[1];
                        
                        colorInserter(color, delayTime);
                    };
                };

            } else {
                if (index == textArray.length - 1 && isThisTheEnd)
                color = colorSet[3];

                else if(index > 2) color = colorSet[2];
                else color = colorSet[0];
                
                colorInserter(color, delayTime);
            }



            function colorInserter(color, delayTime){
                setTimeout(() => {
                    containerElement.style.color = color[0];
                    containerElement.style.backgroundColor = color[1];
                }, delayTime);
            };
        };
    };
})();