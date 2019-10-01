onload = () => {

    ////////// ////////// 헤더 타이핑

    const mainHeader = document.getElementsByClassName('mall-main-header-section')[0];
    textTyper.doIt(mainHeader, 2, null, null, 2, 300);



    ////////// ////////// ////////// 네비게이션 효과

    const mainNav = document.getElementsByClassName('mall-nav')[0];



    (function() { // nav에 sticky 부여

        let viewHeight = window.innerHeight;
        let viewWidth = window.innerWidth;

        let targetHeight;

        if(viewHeight<=viewWidth)
        targetHeight = viewHeight / 100 * 60;
        else
        targetHeight = viewWidth  / 100 * 60;



        document.addEventListener('scroll', navSet);
    
        function navSet() {
            if (window.pageYOffset >= targetHeight) {
                mainNav.classList.add('fixed-top');
                iconSet(true);
                
                document.removeEventListener('scroll', navSet);
                document.addEventListener('scroll', navReset);
            }
        }
    
        function navReset() {
            if(window.pageYOffset <= targetHeight) {
                mainNav.classList.remove('fixed-top');
                iconSet(false);

                document.removeEventListener('scroll', navReset);
                document.addEventListener('scroll', navSet);
            };
        };



        function iconSet(boolean) {
            const iconNames = ['nav-logo', 'nav-sitemap']

            let iconTriggerNames = [];
            for (let i = 0; i < iconNames.length; i++) {
                iconTriggerNames.push(iconNames[i] + '-trigger');
            }


            if (boolean)
            iconChanger(iconTriggerNames, iconNames);

            else if (!boolean)
            iconChanger(iconNames, iconTriggerNames);


            function iconChanger(iconNames_from, iconNames_to) {
                for (let i = 0; i < iconNames_from.length; i++) {
                    const iconElement = mainNav.getElementsByClassName(iconNames_from[i])[0];
                    iconElement.classList.replace(iconNames_from[i], iconNames_to[i]);
                }
            }

        }
    })();



    const mainNavMain_toSub = document.getElementsByClassName('to-sub'); // 메인 to-Sub버튼
    
    const mainNavSub = document.getElementsByClassName('mall-nav-sub-area')[0]; // to-Sub 버튼 클릭 시 display되는 서브 섹션
    const mainNavSubLists = mainNavSub.getElementsByClassName('mall-nav-sub-list');

    const navButtonTriggerClassName = "display-none";



    buttonSetter(mainNavMain_toSub, mainNavSubLists, navButtonTriggerClassName, 'mall-nav-sub-list', 'mall-nav-further-list');

    function buttonSetter(buttonArray, targetArray, triggerClassName, targetClassName, furtherTargetClassName) {
        
        for (let index = 0; index < targetArray.length; index++) {
    
            const target = targetArray[index];
    
            if (target.classList.contains(targetClassName)) {
                const mainNavSub_toFurther = target.getElementsByClassName('to-further');
                const mainNavFurtherLists = target.parentElement.getElementsByClassName(furtherTargetClassName);

                buttonSetter(mainNavSub_toFurther, mainNavFurtherLists, triggerClassName, null, furtherTargetClassName);
            };



            const button = buttonArray[index];
            button.addEventListener('click', buttonFunction);


            function buttonFunction() {
                indicatorProgramSetter(target, button);
                buttonProgram(triggerClassName, targetArray, target);
            };

            function indicatorProgramSetter (target, button) {
                
                if (target.classList.contains(targetClassName)) {
                    
                    const toFurtherArray = mainNav.getElementsByClassName('to-further');

                    indicatorProgram(target, button, toFurtherArray);
                    indicatorProgram(target, button, mainNavMain_toSub);
                    
                } else if (target.classList.contains(furtherTargetClassName)) {

                    const toFurtherArray = button.parentElement.getElementsByClassName('to-further');

                    indicatorProgram(target, button, toFurtherArray);
                };
                

                function indicatorProgram (target, button, buttonArray) {
                    
                    if (target.classList.contains(triggerClassName)){
                        
                        otherIndicatorSetter(buttonArray, true);
                        indicatorSetter(button, false);
                        
                    } else {
                        
                        otherIndicatorSetter(buttonArray, true);
                        indicatorSetter(button, true);

                    };
                };


                function indicatorSetter(button, boolean) {
                    const indicator = button.getElementsByClassName('sub-list-indicator')[0];

                    if (boolean) {
                        
                        if(indicator.classList.contains('indicator-minus'))
                        indicator.classList.replace('indicator-minus', 'indicator-plus');

                        if(button.classList.contains('nav-button-after'))
                        button.classList.replace('nav-button-after', 'nav-button');
                        
                    } else if (!boolean) {

                        if(indicator.classList.contains('indicator-plus'))
                        indicator.classList.replace('indicator-plus', 'indicator-minus');

                        if(button.classList.contains('nav-button'))
                        button.classList.replace('nav-button', 'nav-button-after');
                    };
                };

                function otherIndicatorSetter(buttonArray, boolean) {
                    
                    for (let index = 0; index < buttonArray.length; index++) {
                        const button = buttonArray[index];

                        indicatorSetter(button, boolean);
                    };
                };
            };
            
            function buttonProgram(triggerClassName, targetArray, target){
                
                if (target.classList.contains(triggerClassName)) {
                    otherTarget_toTrigger(targetArray, triggerClassName);
                    furtherTarget_toTrigger(target, triggerClassName);

                    subSectionDisplay(true);
                    target.classList.remove(triggerClassName);

                } else {
                    furtherTarget_toTrigger(target, triggerClassName);

                    target.classList.add(triggerClassName);
                    subSectionDisplay(false);
                };
            };


            function otherTarget_toTrigger(targetArray, triggerClassName) {
                
                for (let index = 0; index < targetArray.length; index++) {

                    const target = targetArray[index];
    
                    if(!target.classList.contains(triggerClassName))
                    target.classList.add(triggerClassName);
                };
            };


            function furtherTarget_toTrigger(target, triggerClassName) {
                
                if (target.classList.contains(targetClassName)){

                    const furtherTargets = target.parentElement.parentElement.getElementsByClassName(furtherTargetClassName);
                    otherTarget_toTrigger(furtherTargets, triggerClassName);
                };
            };

            function subSectionDisplay(boolean) {

                if (target.classList.contains(targetClassName)){

                    if (boolean){
                        if(mainNavSub.classList.contains(triggerClassName))
                        mainNavSub.classList.remove(triggerClassName);
    
                    } else if(!boolean) {
                        if(!mainNavSub.classList.contains(triggerClassName))
                        mainNavSub.classList.add(triggerClassName);
                    };
                };
            };
        };
    };
};