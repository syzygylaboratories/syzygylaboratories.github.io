document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("[data-widget]").forEach(el => {
        const type = el.dataset.widget;

        switch (type) {
            case "digital":
                window.initDigitalWidget?.(el);
                break;

            case "physical":
                window.initPhysicalWidget?.(el);
                break;

            case "consultancy":
                window.initConsultancyWidget?.(el);
                break;
        }
    });

});