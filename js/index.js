onload = () => {

    //////////////////// DOM에서 엘리먼트를 JS에 클론 및 제거
    // 
    // DOM에서 엘리먼트를 JS에 클론 후 DOM에서 삭제한다.
    //
    // 저장된 엘리먼트는 DOMNodeInserted 이벤트 리스너가 추가되어 선언되며,
    // DOM 삽입 시 동적효과를 구현하는 function이 실행된다.
    // 
    
    const DOMBody = document.getElementsByTagName('body')[0];
    const backupBody = elementManager.backupAndReset(DOMBody);

    const indexLoading = elementManager.declare('index-loading', backupBody);
    const indexMontage = elementManager.declare('index-montage', backupBody, indexMontageEffect);
    const indexGreeting = elementManager.declare('index-greeting', backupBody, indexGreetingEffect);
    const indexLink = elementManager.declare('index-link', backupBody, indexLinkEffect);

    const disabler = 'display-none-animation'; // fade-out 효과를 위한 CSS가 적용된 클래스명
    const delayTime = 3000; // 상기 효과의 종료 시간
    


    //////////////////// 이미지 로드 및 로드 인디케이터 삽입
    // 
    // 몽타주에 사용되는 이미지를 로드하는 동안,
    // 로드된 양을 표기하는 인디케이터를 삽입하여,
    // 사용자로 하여금, 로드 사실을 인지하게 한다.
    // 

    DOMBody.appendChild(indexLoading);
    
    var indexMontageImagesArray = imagePreloader.get(
        'resources/img/index-intro/intro-', 60, '.jpg', true, // src 주소 생성을 위한 변수 및 배열 순서 셔플 유무 boolean
        indexLoading.querySelector('.index-loading-progress'), // 로딩 progress 인디케이터
        indexLoading.querySelector('.index-loading-text'), // 로딩 text 인디케이터
        () => {indexLoading.classList.add(disabler)} // 이미지 로드 완료 시 실행될 함수
    );



    //////////////////// 몽타주 이벤트 function
    // 
    // 로직에 필요한 엘리먼트 변수 선언 및 로직 수행한다.
    // 

    function indexMontageEffect() {
        const indexMontageFrame = document.getElementsByClassName('index-montage-frame')[0];

        bgimgInserter.doIt(indexMontageFrame, indexMontageImagesArray, 1000); // 동적 효과 구현
        setTimeout(() => {indexMontage.classList.add(disabler)}, (1000 * 25) - delayTime ); // 몽타주 섹션 비가시화
    };



    //////////////////// 그리팅 이벤트 function
    // 
    // 타이핑 이펙트를 부여한다.
    // elementManager.insert(DOMBody, indexGreeting, indexGreetingEffect); // 테스트를 위한 코드
    // 

    function indexGreetingEffect() {textTyper.doIt(indexGreeting, 2, null, null, 3, null, 750)};



    //////////////////// 링크 이벤트 function
    // 
    // 타이핑 이펙트 및 링크 버튼 활성화
    // elementManager.insert(DOMBody, indexLink, indexLinkEffect); // 테스트를 위한 코드
    // 

    function indexLinkEffect() {
        let name = 'index-link-term-'; // 버튼 클래스명
        
        for (let i = 1; i <= 2; i++) {
            elementManager.declare(name + i, DOMBody, indexLinkTermMouseEnter, 1); // 마우스 진입 이벤트
            elementManager.declare(name + i, DOMBody, indexLinkClick, 2); // 마우스 클릭 이벤트
        }


        let passElmClassName = 'opacity-zero'; // 타이핑 효과 부여를 통과할 엘리먼트의 클래스명;
        textTyper.doIt(indexLink.children[0].children[0], 2, passElmClassName, null, 2, 300); // 타이핑 효과 부여



        function indexLinkTermMouseEnter() { // 마우스 진입 시 형제 엘리먼트에 타이핑 효과 부여
    
            this.removeEventListener('mouseenter', indexLinkTermMouseEnter); // 재진입으로 인한 오작동 방지를 위한 이벤트삭제
    

            let effectElement = this.nextElementSibling;
    
            effectElement.classList.remove(passElmClassName);
            textTyper.doIt(effectElement, 0, null, null, 2, 300);
        };
    
        function indexLinkClick(){
            indexLink.classList.add(disabler); // fade-out 효과 부여
    
            if (this.classList.contains(name + 1)) {
                
                let url = 'brand.html';
                move(url);
                
            } else {
                
                let url = 'mall/mall-intro.html'
                move(url);
            };
    
            function move(url) {setTimeout(() => {window.location = url}, delayTime)}; // fade-out 효과가 끝난 시점에 이동
        };
    };



    //////////////////// 엘리먼트 삽입 자동화
    // 
    // 개별 엘리먼트의 이벤트 함수에는 이펙트 종료 시기에,
    // class명을 부여하여 fade-out 애니메이션이 적용되게 하였다.
    // 
    // 옵저버를 사용해 상기 class명의 변겅으로 인한 attributes에서의
    // 변화를 감지하여, 다음 순서의 엘리먼트가 자동으로 삽입되게 하였다.
    //

    elementManager.insertAutomation(DOMBody, delayTime); // fade-out 효과가 끝난 시점에 이동
}