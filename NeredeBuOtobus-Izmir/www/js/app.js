
var App = {
    startApplication: function () {

        //check if the internet is offline
        ConnectionStatus.check();



        // load the first screen here
        bb.pushScreen('home.html', 'homeScr');


    },

    alert: function (message, title) {
        blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function () { }, { title: title });
    },
    getValues: function () {
        var durakNo = localStorage.getItem("lastDurakNo");// $("#txtDurakNo").val();
        if (!durakNo) {
            var message = "Lütfen bir durak numarası giriniz";
            var title = "Durak No";
            App.alert(message, title);
            //blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function () { }, { title: "Durak No" });
            return null;
        }

        var hatNo = localStorage.getItem("lastHatNo"); //$("#txtHatNo").val(); 

        var dataObject = { durakNo: durakNo, hatNo: hatNo };
        this.values = dataObject;
        return dataObject;
    },
    values: null,
    url:'',
    getBusInfo: function () {

        var dataObject = App.getValues();
        if (!dataObject) {
            return null;
        }

        var busInfoScrExist = false;
        $.each(bb.screens, function (index, item) {
            if (item.id == "busInfoScr") {
                busInfoScrExist = true;
            }
        });

        if (busInfoScrExist == false) {
            bb.pushScreen('busInfo.html', 'busInfoScr');
        }
        //show loading - ekran yüklendikten sonra çalıştırılması lazım
        Spinner.on();

        //Connection.doAjaxReq(dataObject);

        App.url = "";
        var durakNo = dataObject.durakNo;
        if (durakNo) {
            App.url = "http://kentkart.com/services/resim.php?region=006&stopid=" + durakNo;
        }
        else {
            //  console.log(data);
            if ($.isEmptyObject(data) || data.Row < 1) {
                var message = "Otobüs bulunamadı..";
                var title = "Sonuç";
                App.alert(message, title);
            }
        }
        
        var date = new Date();
        var hour = date.getHours()
        if (hour < 10) hour = "0" + hour;

        var min = date.getMinutes();
        if (min < 10) min = "0" + min;

        var sec = date.getSeconds();
        if (sec < 10) sec = "0" + sec;


        var now = hour + ":" + min + ":" + sec;
        $("#lblLastUpdateTime").html("Son güncellenme: " + now);

    },

    showBusInfo: function (data) {

        var url = App.url;
        $("#durakImg").attr("data-bb-img", url);
        $("#durakImg").attr("src", url);


        var date = new Date();
        var hour = date.getHours()
        if (hour < 10) hour = "0" + hour;

        var min = date.getMinutes();
        if (min < 10) min = "0" + min;

        var sec = date.getSeconds();
        if (sec < 10) sec = "0" + sec;


        var now = hour + ":" + min + ":" + sec;
        $("#lblLastUpdateTime").html("Son güncellenme: " + now);

        Spinner.off();

        Timer.start();
    },

};