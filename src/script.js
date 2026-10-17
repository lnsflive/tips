let tipPercent = 0;
let billAmount = 0;

$( document ).ready(function() {
    $(".billInput").on("input", function() {
        billAmount = $(this).val();
        checkResult();
    });

    $(".custom").on("input", function() {
        tipPercent = $(this).val() * 0.01;
        checkResult();
    });
});

function calculateAmounts(bill, percent) {
    const billCents = Math.round(Number(bill) * 100);
    const tipCents = Math.round(billCents * Number(percent));

    return {
        tip: tipCents / 100,
        total: (billCents + tipCents) / 100
    };
}

function changePercent(percent) {
    tipPercent = percent;
    $(".custom").val("");
    checkResult();
}

function reset() {
    $(".billInput").val("");
    $(".custom").val("");
    $(".result").html("$0.00");
    $(".totalResult").html("$0.00");
    tipPercent = 0;
    billAmount = 0;
}

function checkResult() {
    const amounts = calculateAmounts(billAmount, tipPercent);

    $(".result").html("$" + amounts.tip.toFixed(2));
    $(".totalResult").html("$" + amounts.total.toFixed(2));
}

if (typeof module !== "undefined") {
    module.exports = { calculateAmounts };
}
