let tip_percent = 0.0;
let tip_input = 0.00;
let tip_amount = 0.00;
let total_amount = 0.0;

$( document ).ready(function() {
    
    $(".billInput").on('change',function(){
        tip_input = $(this).val();
        //console.log('input: ' + tip_input);
        checkResult();
    });
    $(".custom").on('change',function(){
        tip_percent = $(this).val() * 0.01;
        //console.log('percent: ' + tip_percent);
        checkResult();
    });
});

function changePercent(myPercent){
    tip_percent = myPercent;
    //console.log('percent: ' + tip_percent);
    checkResult();
}

function reset(){
    $(".billInput").val("");
    $(".custom").val("");
    $(".result").html("$0.00");
    $(".totalResult").html("$0.00");
    tip_percent = 0.0;
    tip_input = 0.00;
    tip_amount = 0.00;
    total_amount = 0.0;
}

function checkResult(){
    tip_amount = tip_input * tip_percent;
    total_amount = Number(tip_input) + Number(tip_amount);
    tip_amount = (tip_amount.toFixed(2));
    total_amount = total_amount.toFixed(2);
    //console.log('amount: ' + tip_amount);
    //console.log('amount: ' + total_amount);
    $(".result").html("$" + tip_amount);
    $(".totalResult").html("$" + total_amount);

}