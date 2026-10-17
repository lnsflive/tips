let tipPercent = 0;
let billAmount = 0;

$( document ).ready(function() {
    $(".billInput").on("input", function() {
        billAmount = $(this).val();
        checkResult();
    });

    $(".custom").on("input", function() {
        tipPercent = $(this).val() * 0.01;
        updateSelection();
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
    updateSelection(percent);
    checkResult();
}

function reset() {
    $(".billInput").val("");
    $(".custom").val("");
    tipPercent = 0;
    billAmount = 0;
    updateSelection();
    checkResult();
}

function updateSelection(percent) {
    document.querySelectorAll(".tip-button").forEach(button => {
        button.setAttribute("aria-pressed", String(Number(button.dataset.percent) === percent));
    });
}

function checkResult() {
    const inputs = [...document.querySelectorAll("input")];
    const invalid = inputs.some(input => !input.validity.valid);
    inputs.forEach(input => input.setAttribute("aria-invalid", String(!input.validity.valid)));
    $(".input-error").html(invalid ? "Enter a nonnegative number with up to two decimal places." : "");
    if (invalid) {
        $(".result").html("—");
        $(".totalResult").html("—");
        $(".billResult").html("—");
        return;
    }
    const amounts = calculateAmounts(billAmount, tipPercent);

    $(".billResult").html("$" + (Math.round(Number(billAmount) * 100) / 100).toFixed(2));
    $(".tip-rate").html("(" + Number((tipPercent * 100).toFixed(2)) + "%)");
    $(".result").html("$" + amounts.tip.toFixed(2));
    $(".totalResult").html("$" + amounts.total.toFixed(2));
}

if (typeof module !== "undefined") {
    module.exports = { calculateAmounts };
}
