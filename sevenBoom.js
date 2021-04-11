function sevenBoom(numberToStop) {

    for (let i = 1; i <= numberToStop; i++) {
        setTimeout(() => {
            if (i % 7 == 0 || i % 10 == 7)
                console.log("BOOM!");
            else
                console.log(i);
        }, i * 500);
    }
}

sevenBoom(30);