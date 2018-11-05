$(function(){
    var mapBlock = $('.mapBlock');
    var dataSize = mapBlock.attr('data-size');
    var cityDataModule = 'taipei';
    var cusDropdown = $('.cusDropdown');
    var sizeLevel = 0;

    /*========================================= 
    draggable / zoom in / zoom out/ 
    ========================================= */
    $('.mapBox').draggable({
        drag:function(){
            $descriptionPin.removeClass('active');
            $description.removeClass('active');
        }
    });
    //zoom
    $('.zoom-In').click(function(){
        sizeLevel++;
        sizeRule();
    });
    $('.zoom-Out').click(function(){
        sizeLevel--;
        sizeRule();
    });

    
    function sizeRule(){
        if(sizeLevel === 1) {
            mapBlock.attr('data-size','level_1');
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }else if(sizeLevel === 2){
            mapBlock.attr('data-size','level_2');
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }else if(sizeLevel === 3){
            mapBlock.attr('data-size','level_3');
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }else if(sizeLevel === 4){
            mapBlock.attr('data-size','level_4');
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }else if(sizeLevel === 5){
            mapBlock.attr('data-size','level_5');
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').addClass('prohibit');
        }else if(sizeLevel >= 5){
            $('.zoom-Out').removeClass('prohibit');
            $('.zoom-In').addClass('prohibit');
        }else if(sizeLevel === 0){
            mapBlock.attr('data-size','level_origin');
            $('.zoom-Out').addClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }else if(sizeLevel <= 0){
            sizeLevel = 0
            $('.zoom-Out').addClass('prohibit');
            $('.zoom-In').removeClass('prohibit');
        }
        console.log(sizeLevel);
    }


    //changeYear
    $('.changeYear a').each(function(){
        $(this).click(function(){
            $(this).addClass('active');
            $(this).siblings('a').removeClass('active');
        });
    });


    /*========================================= 
    Dropdown
    ========================================= */
    $('.dropOption.current').click(function(){
        if(cusDropdown.hasClass('open')){
            cusDropdown.removeClass('open');
        }else{
            cusDropdown.addClass('open');
        }
    });
    $('.dropItem').each(function(index){
        $(this).click(function(){
            sizeLevel = 0;
            sizeRule();
            var CurrenText = $(this).text();
            var moduleID= $(this).attr('id');
            $('.dropOption.current').text(CurrenText);
            $(this).addClass('hideCurrent');
            $(this).siblings().removeClass('hideCurrent');
            $('.mapBlock').removeClass('kaohsiung2010status');
            cusDropdown.removeClass('open');
            $('.mapBox').css({'top':'0','left':'0'});
            if(moduleID === 'taipeiBtn'){
                mapChange('taipei','.taipei2006','2006','2010','2014');
                $('.mapBlock').attr('data-legendG','open');
            }else if(moduleID === 'newtaipeiBtn'){
                mapChange('newtaipei','.newtaipei2005','2005','2010','2014');
                $('.mapBlock').attr('data-legendG','open');
            }else if(moduleID === 'taoyuanBtn'){
                mapChange('taoyuan','.taoyuan2005','2005','2009','2014');
                $('.mapBlock').attr('data-legendG','open');
            }else if(moduleID === 'taichungBtn'){
                mapChange('taichung','.taichung2005','2005','2010','2014');
                $('.mapBlock').attr('data-legendG','close');
            }else if(moduleID === 'tainanBtn'){
                mapChange('tainan','.tainan2005','2005','2010','2014');
                $('.mapBlock').attr('data-legendG','open');
            }else if(moduleID === 'kaohsiungBtn'){
                mapChange('kaohsiung','.kaohsiung2005','2005','2010','2014');
                $('.mapBlock').attr('data-legendG','close');
            }
        });
    });

    function mapChange(dataCity,mapbox,year1,year2,year3){
        sizeLevel=0;
        sizeRule();
        cityDataModule = dataCity;
        mapBlock.attr('data-city',dataCity);
        $(mapbox).addClass('show');
        $(mapbox).siblings().removeClass('show');
        $('.yearMap1').addClass('active');
        $('.yearMap1').siblings().removeClass('active');

        $('.yearMap1').text(year1);
        $('.yearMap2').text(year2);
        $('.yearMap3').text(year3);
    }


    /*========================================= 
    map data
    ========================================= */
    var $description = $(".description.outer");
    var $descriptionPin = $(".description.pin");
    var baseFunction = function(callback){
        $.when(
            $.ajax("api/taipei_2014.json"),
            $.ajax("api/taipei_2010.json"),
            $.ajax("api/taipei_2006.json"),
            $.ajax("api/newtaipei_2014.json"),
            $.ajax("api/newtaipei_2010.json"),
            $.ajax("api/newtaipei_2005.json"),
            $.ajax("api/taoyuan_2014.json"),
            $.ajax("api/taoyuan_2009.json"),
            $.ajax("api/taoyuan_2005.json"),
            $.ajax("api/taichung_2014.json"),
            $.ajax("api/taichung_2010.json"),
            $.ajax("api/taichung_2005.json"),
            $.ajax("api/tainan_2014.json"),
            $.ajax("api/tainan_2010.json"),
            $.ajax("api/tainan_2005.json"),
            $.ajax("api/kaoshiung_2014.json"),
            $.ajax("api/kaoshiung_2010.json"),
            $.ajax("api/kaoshiung_2005_2006.json")
        ).done(function(r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,r13,r14,r15,r16,r17,r18){

            //doReplace
            function doReplace(repl, str) {
                var regexStr = Object.keys(repl).map(function(s) {
                    return s.replace(/([^\w\s])/g, '\\$1');
                }).join('|');
                return str.replace(new RegExp(regexStr, 'g'), function(m) {
                    return repl[m];//it changed to "repl"  
                });
            }
            var reData, newData, result;
            var returnArray = [];
            function candidateReFunc(dataArray,elected,lost){
                var txtData = JSON.stringify(dataArray);
                var replacements = {
                    "行政區別": "district",
                    "里別": "village",
                    "得票率差": "vote_percentage",
                    "投票數的SUM": "vote_sum",
                    "得票數差":"vote_disparity",
                }
                reData = doReplace(replacements, txtData);

                var reElected = new RegExp(elected, 'g');
                var stringData = reData.replace(reElected,"candidate_elected");

                var reLost = new RegExp(lost, 'g');
                var stringData2 = stringData.replace(reLost,"candidate_lost");

                newData = JSON.parse(stringData2);
                returnArray.push(newData);
            }

            function candidateReFuncOld(dataArray){//2005縣市合併前
                var txtData = JSON.stringify(dataArray);
                var replacements = {
                    "縣市別":"county",
                    "行政區別": "district",
                    "里別": "village",
                    "得票率差": "vote_percentage",
                    "投票數的SUM": "vote_sum",
                    "得票數差":"vote_disparity",
                    "民進黨候選人得票率":"DPP_vote",
                    "國民黨候選人得票率":"KMT_vote",
                    "無黨籍候選人得票率":"FREE_vote",
                    "民進黨候選人":"DPP",
                    "國民黨候選人":"KMT",
                    "無黨籍候選人":"FREE",
                    "選舉年份":"year",
                    "第一高票得票率":"most_vote",
                    "第一高票候選人":"most_candidate"
                }
                reData = doReplace(replacements, txtData);
                newData = JSON.parse(reData);
                returnArray.push(newData);
            }


            candidateReFunc(r1,"柯文哲得票率","連勝文得票率");
            candidateReFunc(r2,"郝龍斌得票率","蘇貞昌得票率");
            candidateReFunc(r3,"郝龍斌得票率","謝長廷得票率");

            candidateReFunc(r4,"朱立倫得票率","游錫堃得票率");
            candidateReFunc(r5,"朱立倫得票率","蔡英文得票率");
            candidateReFunc(r6,"周錫瑋得票率","羅文嘉得票率");

            candidateReFunc(r7,"鄭文燦得票率","吳志揚得票率");
            candidateReFunc(r8,"吳志揚得票率","鄭文燦得票率");
            candidateReFunc(r9,"朱立倫得票率","鄭寶清得票率");

            candidateReFunc(r10,"林佳龍得票率","胡志強得票率");
            candidateReFunc(r11,"胡志強得票率","蘇嘉全得票率");
            candidateReFuncOld(r12);

            candidateReFunc(r13,"賴清德得票率","黃秀霜得票率");
            candidateReFunc(r14,"賴清德得票率","郭添財得票率");
            candidateReFuncOld(r15);

            candidateReFuncOld(r16);
            candidateReFuncOld(r17);
            candidateReFuncOld(r18);

            callback(returnArray); 

        })
    } 


    baseFunction(function(returnArray){
        // console.log(returnArray);
        var taipei_2014 = returnArray[0][2].responseJSON;
        var taipei_2010 = returnArray[1][2].responseJSON;
        var taipei_2006 = returnArray[2][2].responseJSON;
        var newtaipei_2014 = returnArray[3][2].responseJSON;
        var newtaipei_2010 = returnArray[4][2].responseJSON;
        var newtaipei_2005 = returnArray[5][2].responseJSON;
        var taoyuan_2014 = returnArray[6][2].responseJSON;
        var taoyuan_2009 = returnArray[7][2].responseJSON;
        var taoyuan_2005 = returnArray[8][2].responseJSON;
        var taichung_2014 = returnArray[9][2].responseJSON;
        var taichung_2010 = returnArray[10][2].responseJSON;
        var taichung_2005 = returnArray[11][2].responseJSON;
        var tainan_2014 = returnArray[12][2].responseJSON;
        var tainan_2010 = returnArray[13][2].responseJSON;
        var tainan_2005 = returnArray[14][2].responseJSON;

        var kaohsiung_2014 = returnArray[15][2].responseJSON;
        var kaohsiung_2010 = returnArray[16][2].responseJSON;
        var kaohsiung_2005 = returnArray[17][2].responseJSON;

        // console.log(kaohsiung_2014)
        // console.log(taichung_2005)

        /*========================================= 
        findDifferent
        ========================================= */
        var different;
        function findDifferent(array1,array2){
            var villageArray1 = [];
            var villageArray2 = [];
            var otherArray = [];
            for(var item in array1) {
                villageArray1.push(array1[item].village);
            }
            for(var item in array2) {
                villageArray2.push(array2[item].village);
            }
            different = villageArray2.filter(function(v){ 
                return !(villageArray1.indexOf(v) > -1) 
                }).concat(villageArray1.filter(function(v){ 
                    return !(villageArray2.indexOf(v) > -1
                )}))
            // console.log(different)
        }

        function findDifferentKaohsiung(array1,array2){
            var villageArray1 = [];
            var villageArray2 = [];
            var otherArray = [];
            for(var item in array1) {
                villageArray1.push(array1[item].district);
            }
            for(var item in array2) {
                villageArray2.push(array2[item].district);
            }
            different = villageArray2.filter(function(v){ 
                return !(villageArray1.indexOf(v) > -1) 
                }).concat(villageArray1.filter(function(v){ 
                    return !(villageArray2.indexOf(v) > -1
                )}))
            console.log(different)
        }

        // //=========================================
        findDifferent(taipei_2006,taipei_2010);//init
        descriptionChange(taipei_2006,'郝龍斌：','謝長廷：','blueWin',true);//init
        lengedChange('郝龍斌','謝長廷','len_blue_green');//init

        $('.yearMap3').click(function(){
            sizeLevel=0;
            sizeRule();
            $('.mapBox').css({'top':'0','left':'0'});
            $('.description').removeClass('active');
            $('.mapBlock').attr('data-legendG','close');
            if(cityDataModule === 'taipei'){
                $('.taipei2014').addClass('show');
                $('.taipei2014').siblings().removeClass('show');
                findDifferent(taipei_2006,taipei_2010);
                descriptionChange(taipei_2014,'柯文哲：','連勝文：', 'grayWin' ,false);
                lengedChange('連勝文','柯文哲','len_blue_gray');
            }else if(cityDataModule === 'newtaipei'){
                $('.newtaipei2014').addClass('show');
                $('.newtaipei2014').siblings().removeClass('show');
                findDifferent(newtaipei_2005,newtaipei_2010);
                descriptionChange(newtaipei_2014,'朱立倫：','游錫堃：','blueWin' ,false);
                lengedChange('朱立倫','游錫堃','len_blue_green');
            }else if(cityDataModule === 'taoyuan'){
                $('.taoyuan2014').addClass('show');
                $('.taoyuan2014').siblings().removeClass('show');
                findDifferent(taoyuan_2009,taoyuan_2014);
                descriptionChange(taoyuan_2014,'鄭文燦：','吳志揚：', 'greenWin' ,false);
                lengedChange('吳志揚','鄭文燦','len_blue_green');
            }else if(cityDataModule === 'taichung'){
                $('.taichung2014').addClass('show');
                $('.taichung2014').siblings().removeClass('show');
                findDifferent(taichung_2005,taichung_2010);
                descriptionChange(taichung_2014,'林佳龍：','胡志強：', 'greenWin' ,false);
                lengedChange('胡志強','林佳龍','len_blue_green');
            }else if(cityDataModule === 'tainan'){
                $('.tainan2014').addClass('show');
                $('.tainan2014').siblings().removeClass('show');
                findDifferent(tainan_2005,tainan_2010);
                descriptionChange(tainan_2014,'賴清德：','黃秀霜：', 'greenWin' ,false);
                lengedChange('黃秀霜','賴清德','len_blue_green');
            }else if(cityDataModule === 'kaohsiung'){
                $('.kaohsiung2014').addClass('show');
                $('.kaohsiung2014').siblings().removeClass('show');
                findDifferentKaohsiung(kaohsiung_2005,kaohsiung_2014);
                descriptionKaohsiung(kaohsiung_2014);
                $('.mapBlock').removeClass('kaohsiung2010status');
                lengedChange('楊秋興','陳菊','len_blue_green');
            }
        });
        $('.yearMap2').click(function(){
            sizeLevel=0;
            sizeRule();
            $('.mapBox').css({'top':'0','left':'0'});
            $('.description').removeClass('active');
            if(cityDataModule === 'taipei'){
                $('.taipei2010').addClass('show');
                $('.taipei2010').siblings().removeClass('show');
                findDifferent(taipei_2006,taipei_2010);
                descriptionChange(taipei_2010,'郝龍斌：','蘇貞昌：', 'blueWin' ,false);
                lengedChange('郝龍斌','蘇貞昌','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }else if(cityDataModule === 'newtaipei'){
                $('.newtaipei2010').addClass('show');
                $('.newtaipei2010').siblings().removeClass('show');
                findDifferent(newtaipei_2005,newtaipei_2010);
                descriptionChange(newtaipei_2010,'朱立倫：','蔡英文：','blueWin',false);
                lengedChange('朱立倫','蔡英文','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }else if(cityDataModule === 'taoyuan'){
                $('.taoyuan2009').addClass('show');
                $('.taoyuan2009').siblings().removeClass('show');
                findDifferent(taoyuan_2009,taoyuan_2014);
                descriptionChange(taoyuan_2009,'吳志揚：','鄭文燦：','blueWin',true);
                lengedChange('吳志揚','鄭文燦','len_blue_green');
                $('.mapBlock').attr('data-legendG','open');
            }else if(cityDataModule === 'taichung'){
                $('.taichung2010').addClass('show');
                $('.taichung2010').siblings().removeClass('show');
                findDifferent(taichung_2005,taichung_2010);
                descriptionChange(taichung_2010,'胡志強：','蘇嘉全：', 'blueWin' ,false);
                lengedChange('胡志強','蘇嘉全','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }else if(cityDataModule === 'tainan'){
                $('.tainan2010').addClass('show');
                $('.tainan2010').siblings().removeClass('show');
                findDifferent(tainan_2005,tainan_2010);
                descriptionChange(tainan_2010,'賴清德：','郭添財：', 'greenWin' ,false);
                lengedChange('郭添財','賴清德','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }else if(cityDataModule === 'kaohsiung'){
                $('.kaohsiung2010').addClass('show');
                $('.kaohsiung2010').siblings().removeClass('show');
                findDifferentKaohsiung(kaohsiung_2005,kaohsiung_2014);
                descriptionKaohsiung(kaohsiung_2010);
                $('.mapBlock').addClass('kaohsiung2010status');
                $('.mapBlock').attr('data-legendG','close');
            }
        });

        $('.yearMap1').click(function(){
            sizeLevel=0;
            sizeRule();
            $('.mapBox').css({'top':'0','left':'0'});
            $('.description').removeClass('active');
            initCityMap();
        });
        //refresh
        $('.refresh').click(function(){
            $('.mapBox').css({'top':'0','left':'0'});
            sizeLevel=0;
            sizeRule();
            $('.description').removeClass('active');
            $('.yearMap1').addClass('active');
            $('.yearMap1').siblings().removeClass('active');
            initCityMap();
            
        });
        function initCityMap(){
            if(cityDataModule === 'taipei'){
                $('.taipei2006').addClass('show');
                $('.taipei2006').siblings().removeClass('show');
                findDifferent(taipei_2006,taipei_2010);
                descriptionChange(taipei_2006,'郝龍斌：','謝長廷：', 'blueWin' ,true);
                lengedChange('郝龍斌','謝長廷','len_blue_green');
                $('.mapBlock').attr('data-legendG','open');
            }else if(cityDataModule === 'newtaipei'){
                $('.newtaipei2005').addClass('show');
                $('.newtaipei2005').siblings().removeClass('show');
                findDifferent(newtaipei_2005,newtaipei_2010);
                descriptionChange(newtaipei_2005,'周錫瑋：','羅文嘉：','blueWin',true);
                lengedChange('周錫瑋','羅文嘉','len_blue_green');
                $('.mapBlock').attr('data-legendG','open');
            }else if(cityDataModule === 'taoyuan'){
                $('.taoyuan2005').addClass('show');
                $('.taoyuan2005').siblings().removeClass('show');
                findDifferent(taoyuan_2009,taoyuan_2014);
                descriptionChange(taoyuan_2005,'朱立倫：','鄭寶清：','blueWin',true);
                lengedChange('朱立倫','鄭寶清','len_blue_green');
                $('.mapBlock').attr('data-legendG','open');
            }else if(cityDataModule === 'taichung'){
                $('.taichung2005').addClass('show');
                $('.taichung2005').siblings().removeClass('show');
                findDifferent(taichung_2005,taichung_2010);
                descriptionChangeCounty(taichung_2005,true);
                lengedSeparate('胡志強(台中市)','黃仲生(台中縣)','林佳龍(台中市)','邱太三(台中縣)','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }else if(cityDataModule === 'tainan'){
                $('.tainan2005').addClass('show');
                $('.tainan2005').siblings().removeClass('show');
                findDifferent(tainan_2005,tainan_2010);
                descriptionChangeCounty(tainan_2005,true);
                lengedSeparate('陳榮盛(台南市)','郭添財(台南縣)','許添財(台南市)','蘇煥智(台南縣)','len_blue_green');
                $('.mapBlock').attr('data-legendG','open');
            }else if(cityDataModule === 'kaohsiung'){
                $('.kaohsiung2005').addClass('show');
                $('.kaohsiung2005').siblings().removeClass('show');
                findDifferentKaohsiung(kaohsiung_2005,kaohsiung_2014);
                descriptionKaohsiung(kaohsiung_2005);
                $('.mapBlock').removeClass('kaohsiung2010status');
                lengedSeparate('黃俊英(高雄市)','林益世(高雄縣)','陳菊(高雄市)','楊秋興(高雄縣)','len_blue_green');
                $('.mapBlock').attr('data-legendG','close');
            }
        }

        function lengedChange(candidate1,candidate2,colourid){
            $('.name1').text(candidate1);
            $('.name2').text(candidate2);
            $('.legends .legendBar').attr('id',colourid);
        }
        function lengedSeparate(candidate1,candidate2,candidate3,candidate4,colourid){
            $('.name1').html('<div>'+candidate1+'</div><div>'+candidate2+'</div>');
            $('.name2').html('<div>'+candidate3+'</div><div>'+candidate4+'</div>');
            $('.legends .legendBar').attr('id',colourid);
        }

        



        /*========================================= 
        descriptionChange
        ========================================= */
        function descriptionChange(dataArray,elected,lost,winnerStyle,hidden){
            $description.html('');
            $('svg path, svg polygon').on({
                'click':function(){
                    $descriptionPin.addClass('active');
                    $description.addClass('opacity');
                    var $this = $(this);
                    appendDescription($this,$descriptionPin);
                    // $('svg path, svg polygon').attr('style','fill:#e8e8e8');
                    // $(this).attr('style','fill:#000000');
                },
                'mouseenter touchstart':function(){
                    $description.addClass('active');
                    var $this = $(this);
                    appendDescription($this,$description);
                }
            });

            $(document).mouseup(function(e){//click outside close description
                var _con = $('svg path, svg polygon'); 
                if(!_con.is(e.target) && _con.has(e.target).length === 0){
                    $descriptionPin.removeClass('active');
                    $description.removeClass('opacity');
                    // _con.attr('style','fill:#e8e8e8');
                }
            });

            function appendDescription(selector,target){
                var id = selector.attr('id');
                var str = '';
                for(var item in dataArray) {
                    var village = dataArray[item].village;
                    var candidate_elected = dataArray[item].candidate_elected;
                    var candidate_lost = dataArray[item].candidate_lost;
                    if(id.indexOf(village) != -1 && village != null) {
                        // console.log(village);
                        str = '<div class="'+winnerStyle+'"><div class="village">'
                            + id 
                            +'</div><div class="candidate_elected">'
                            +elected
                            +candidate_elected
                            +'</div><div class="candidate_lost">'
                            +lost
                            +candidate_lost
                            +'</div></div>'
                            target.html(str);
                    }
                }
                if(id.indexOf("臺中港") != -1){
                    str='<div class="sparea">臺中港</div>';
                    target.html(str);
                }
                if(id.indexOf("清泉崗") != -1){
                    str='<div class="sparea">清泉崗機場</div>';
                    target.html(str);
                }
                if(hidden === true){// hide [different] description
                    for(var item in different){
                        if(id.indexOf(different[item]) != -1){
                            var str ='<div class="'+winnerStyle+'"><div class="village">'
                                + id 
                                +'</div><div class="candidate_elected">'
                                +elected
                                +'無資料，詳見註解'
                                +'</div><div class="candidate_lost">'
                                +lost
                                +'無資料，詳見註解'
                                +'</div></div>'
                                target.html(str);
                        }
                    }
                }
            }
        }
 
        //==========2005縣市合併 台中 台南
        function descriptionChangeCounty(dataArray,hidden){
            $description.html('');
            $('svg path, svg polygon, svg g').on({
                'click':function(){
                    $descriptionPin.addClass('active');
                    $description.addClass('opacity');
                    var $this = $(this);
                    appendDescription($this,$descriptionPin);
                },
                'mouseenter touchstart':function(){
                    $description.addClass('active');
                    var $this = $(this);
                    appendDescription($this,$description);
                }
            });

            $(document).mouseup(function(e){//click outside close description
                var _con = $('svg path, svg polygon'); 
                if(!_con.is(e.target) && _con.has(e.target).length === 0){
                    $descriptionPin.removeClass('active');
                    $description.removeClass('opacity');
                }
            });

            function appendDescription(selector,target){
                var village = '';
                var id = selector.attr('id');
                var str = '';
                for(var item in dataArray) {
                    
                    village = dataArray[item].village;
                    var KMT = dataArray[item].KMT;
                    var DPP = dataArray[item].DPP;
                    var DPP_vote = dataArray[item].DPP_vote;
                    var KMT_vote = dataArray[item].KMT_vote;
                    var county = dataArray[item].county;
                    var district = dataArray[item].district;

                    if(id.indexOf(village) != -1 && village != null) {
                        // console.log(village);
                        str = '<div><div class="village">'
                            + id 
                            +'</div><div class="green_vote">'
                            +DPP+'：'
                            +DPP_vote
                            +'</div><div class="blue_vote">'
                            +KMT+'：'
                            +KMT_vote
                            +'</div></div>'
                            target.html(str);
                    }
                }
                if(id.indexOf("臺中港") != -1){
                    str='<div class="sparea">臺中港</div>';
                    target.html(str);
                }
                if(id.indexOf("清泉崗") != -1){
                    str='<div class="sparea">清泉崗機場</div>';
                    target.html(str);
                }
                if(hidden === true){// hide [different] description
                    for(var item in different){
                        if(id.indexOf(different[item]) != -1){
                            str = '<div><div class="village">'
                                + id 
                                +'</div><div class="green_vote">'
                                +DPP+'：'
                                +'無資料，詳見註解'
                                +'</div><div class="blue_vote">'
                                +KMT+'：'
                                +'無資料，詳見註解'
                                +'</div></div>'
                                target.html(str);
                        }
                    }
                }
            }

        }

        //==========高雄
        function descriptionKaohsiung(dataArray){
            $description.html('');
            $('svg path, svg polygon').on({
                'click':function(){
                    $descriptionPin.addClass('active');
                    $description.addClass('opacity');
                    var $this = $(this);
                    appendDescription($this,$descriptionPin);
                },
                'mouseenter touchstart':function(){
                    $description.addClass('active');
                    var $this = $(this);
                    appendDescription($this,$description);
                }
            });

            $(document).mouseup(function(e){//click outside close description
                var _con = $('svg path, svg polygon'); 
                if(!_con.is(e.target) && _con.has(e.target).length === 0){
                    $descriptionPin.removeClass('active');
                    $description.removeClass('opacity');
                }
            });

            function appendDescription(selector,target){
                var id = selector.attr('id');
                var str = '';
                for(var item in dataArray) {
                    var year = dataArray[item].year; 
                    var KMT = dataArray[item].KMT;
                    var DPP = dataArray[item].DPP;
                    var FREE = dataArray[item].FREE;
                    var DPP_vote = dataArray[item].DPP_vote;
                    var KMT_vote = dataArray[item].KMT_vote;
                    var FREE_vote = dataArray[item].FREE_vote;
                    var county = dataArray[item].county;
                    var district = dataArray[item].district;
                    if(id.indexOf(district) != -1 && district != null) {
                        if(year === 2010){
                            str = '<div><div class="district">'
                                + id 
                                +'</div><div class="green_vote">'
                                +DPP+'：'
                                +DPP_vote
                                +'</div><div class="blue_vote">'
                                +KMT+'：'
                                +KMT_vote
                                +'</div><div class="free_vote">'
                                +FREE+'：'
                                +FREE_vote
                                +'</div></div>'
                                target.html(str);
                        }else{
                            str = '<div><div class="village">'
                                + id 
                                +'</div><div class="green_vote">'
                                +DPP+'：'
                                +DPP_vote
                                +'</div><div class="blue_vote">'
                                +KMT+'：'
                                +KMT_vote
                                +'</div></div>'
                                target.html(str);
                        }
                    }
                }
            }

        }

        if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {//if not mobile
            $('svg path, svg polygon, svg g').on('mouseleave',function(){
                $description.removeClass('active');
            });
        }
        /*========================================= 
        map render
        ========================================= */
        mapRender('.taipei2006 svg',taipei_2006,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
        mapRender('.newtaipei2005 svg',newtaipei_2005,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
        mapRender('.taoyuan2005 svg',taoyuan_2005,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
        mapRender('.taichung2005 svg',taichung_2005,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
        mapRender('.tainan2005 svg',tainan_2005,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
        mapRenderKaoh_1('.kaohsiung2005 svg',kaohsiung_2005,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
        
        // setTimeout(function(){
            mapRender('.taipei2010 svg',taipei_2010,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
            mapRender('.taipei2014 svg',taipei_2014,'#adafb1','#95989d','#707173','#5e5f61','#b4cdff','#8faff4','#5d8ff9','#366ee4');    
        // },1);
        // setTimeout(function(){
            mapRender('.newtaipei2010 svg',newtaipei_2010,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
            mapRender('.newtaipei2014 svg',newtaipei_2014,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
        // },2);
        // setTimeout(function(){
            mapRender('.taoyuan2009 svg',taoyuan_2009,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
            mapRender('.taoyuan2014 svg',taoyuan_2014,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
        // },3);
        // setTimeout(function(){
            mapRender('.taichung2010 svg',taichung_2010,'#b4cdff','#8faff4','#5d8ff9','#366ee4','#a9e1bc','#85d3a0','#73cb92','#66bd84');
            mapRender('.taichung2014 svg',taichung_2014,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
        // },4);
        // setTimeout(function(){
            mapRender('.tainan2010 svg',tainan_2010,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
            mapRender('.tainan2014 svg',tainan_2014,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
        // },5);
        // setTimeout(function(){
            mapRenderKaoh_1('.kaohsiung2014 svg',kaohsiung_2014,'#a9e1bc','#85d3a0','#73cb92','#66bd84','#b4cdff','#8faff4','#5d8ff9','#366ee4');
            mapRenderKaoh_2('.kaohsiung2010 svg',kaohsiung_2010);
        // },6);



        //========================================= 

        function mapRender(SVG,dataArray,color1,color2,color3,color4,color5,color6,color7,color8){
            for(var item in dataArray){
                var vote_percentage = parseInt(dataArray[item].vote_percentage);
                var obj = dataArray[item];

                voteSwitch(vote_percentage,obj,color1,color2,color3,color4,color5,color6,color7,color8);
                var village = dataArray[item].village;
                var fillColor = 'fill:'+dataArray[item].colorSet;
                appenColortoMap(SVG,village,fillColor);
            }
        }

        function mapRenderKaoh_1(SVG,dataArray,color1,color2,color3,color4,color5,color6,color7,color8){
            for(var item in dataArray){
                var vote_percentage = parseInt(dataArray[item].vote_percentage);
                var obj = dataArray[item];

                voteSwitch(vote_percentage,obj,color1,color2,color3,color4,color5,color6,color7,color8);
                var district = dataArray[item].district;
                var fillColor = 'fill:'+dataArray[item].colorSet;
                appenColortoMap(SVG,district,fillColor);
            }
        }

        function mapRenderKaoh_2(SVG,dataArray){
            for(var item in dataArray){
                var most_vote = parseInt(dataArray[item].most_vote);
                var most_candidate = dataArray[item].most_candidate;
                var obj = dataArray[item];
                if(most_candidate === '陳菊'){
                    switch(true){
                        case most_vote>=0 && most_vote <25:
                            obj["colorSet"] = '#66bd84';
                            break;
                        case most_vote>=25 && most_vote <50:
                            obj["colorSet"] = '#73cb92';
                            break;
                        case most_vote>=50 && most_vote <75:
                            obj["colorSet"] = '#85d3a0';
                            break;
                        case most_vote>=75 && most_vote <100:
                            obj["colorSet"] = '#a9e1bc';
                            break;
                    }
                }else if(most_candidate === '黃昭順'){
                    switch(true){
                        case most_vote>=0 && most_vote <25:
                            obj["colorSet"] = '#366ee4';
                            break;
                        case most_vote>=25 && most_vote <50:
                            obj["colorSet"] = '#5d8ff9';
                            break;
                        case most_vote>=50 && most_vote <75:
                            obj["colorSet"] = '#8faff4';
                            break;
                        case most_vote>=75 && most_vote <100:
                            obj["colorSet"] = '#b4cdff';
                            break;
                    }
                }else if(most_candidate === '楊秋興'){
                    switch(true){
                        case most_vote>=0 && most_vote <25:
                            obj["colorSet"] = '#adafb1';
                            break;
                        case most_vote>=25 && most_vote <50:
                            obj["colorSet"] = '#95989d';
                            break;
                        case most_vote>=50 && most_vote <75:
                            obj["colorSet"] = '#707173';
                            break;
                        case most_vote>=75 && most_vote <100:
                            obj["colorSet"] = '#5e5f61';
                            break;
                    }
                }


                var district = dataArray[item].district;
                var fillColor = 'fill:'+dataArray[item].colorSet;
                appenColortoMap(SVG,district,fillColor);
            }
        }

        function voteSwitch(vote_percentage,obj,color1,color2,color3,color4,color5,color6,color7,color8){
            switch(true){
                case vote_percentage>=0 && vote_percentage <25:
                    obj["colorSet"] = color1;
                    break;
                case vote_percentage>=25 && vote_percentage <50:
                    obj["colorSet"] = color2;
                    break;
                case vote_percentage>=50 && vote_percentage <75:
                    obj["colorSet"] = color3;
                    break;
                case vote_percentage>=75 && vote_percentage <100:
                    obj["colorSet"] = color4;
                    break;
                case vote_percentage<0 && vote_percentage >-25:
                    obj["colorSet"] = color5;
                    break;
                case vote_percentage<=-25 && vote_percentage>-50:
                    obj["colorSet"] = color6;
                    break;
                case vote_percentage<=-50 && vote_percentage>-75:
                    obj["colorSet"] = color7;
                    break;
                case vote_percentage<=-75 && vote_percentage>-100:
                    obj["colorSet"] = color8;
                    break;

            }
        }

        

        function appenColortoMap(SVG,target,fillColor){
            $(SVG).find('path').filter(function(){
                var id = $(this).attr('id');
                if(id != undefined){
                    if(id.indexOf(target) != -1){
                        $(this).attr('style',fillColor)
                    }
                }
            });
        }

        //click fill color
        $('svg path, svg polygon').on({
            'click':function(){
                $('svg path, svg polygon').attr('data-click','');
                $(this).attr('data-click','addColor');
            }
        });
        $(document).mouseup(function(e){//click outside close description
            var _con = $('svg path, svg polygon'); 
            if(!_con.is(e.target) && _con.has(e.target).length === 0){
                _con.attr('data-click','');
            }
        });




        //Dropdown click
        $('#taipeiBtn').click(function(){ 
            findDifferent(taipei_2006,taipei_2010);
            descriptionChange(taipei_2006,'郝龍斌：','謝長廷：','blueWin',true); 
            lengedChange('郝龍斌','謝長廷','len_blue_green');
        });
        $('#newtaipeiBtn').click(function(){ 
            findDifferent(newtaipei_2005,newtaipei_2010);
            descriptionChange(newtaipei_2005,'周錫瑋：','羅文嘉：','blueWin',true); 
            lengedChange('周錫瑋','羅文嘉','len_blue_green');
        });
        $('#taoyuanBtn').click(function(){ 
            findDifferent(taoyuan_2009,taoyuan_2014);
            descriptionChange(taoyuan_2005,'朱立倫：','鄭寶清：','blueWin',true); 
            lengedChange('朱立倫','鄭寶清','len_blue_green');
        });
        $('#taichungBtn').click(function(){ 
            findDifferent(taichung_2005,taichung_2010);
            descriptionChangeCounty(taichung_2005,true);
            lengedSeparate('胡志強(台中市)','黃仲生(台中縣)','林佳龍(台中市)','邱太三(台中縣)','len_blue_green');
        });
        $('#tainanBtn').click(function(){ 
            findDifferent(tainan_2005,tainan_2010);
            descriptionChangeCounty(tainan_2005,true);
            lengedSeparate('陳榮盛(台南市)','郭添財(台南縣)','許添財(台南市)','蘇煥智(台南縣)','len_blue_green');
        });
        $('#kaohsiungBtn').click(function(){ 
            findDifferentKaohsiung(kaohsiung_2005,kaohsiung_2014);
            descriptionKaohsiung(kaohsiung_2005);
            lengedSeparate('黃俊英(高雄市)','林益世(高雄縣)','陳菊(高雄市)','楊秋興(高雄縣)','len_blue_green');
        });
        

    });

});
//# sourceMappingURL=http://localhost:3000/_maps/dataMap.js.map
