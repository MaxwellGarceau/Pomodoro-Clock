// Global Variables
$(document).ready(function() {

    var pomTimeDisplayIncDec = 0;
    var brkTimeDisplayIncDec = 0;
    // Time in Deciseconds  
    var pomTime = 14999;
    var brkTime = 2999;
    var brkTimeDisplay = Math.ceil(brkTime / 10 / 60) + ":" + Math.ceil(brkTime / 10 % 60);
    var pauseResume = 0;
    var pomTimeDisplay = Math.ceil(pomTime / 10 / 60) + ":" + Math.ceil(pomTime / 10 % 60);
    var pomSoundTrigger = 1;
    var pomSound = document.getElementById("pom-sound");
    var breakSound = document.getElementById("break-sound");

    // Fixes visual offsets caused by pom timer digits changing
    function pomClockDisplayFixes() {
        if (Math.ceil(pomTime / 10 % 60) === 60) {
            pomTimeDisplay = Math.ceil(pomTime / 10 / 60) + ":00";
        }
        if (Math.floor(pomTime / 10 / 60) < 10) {
            pomTimeDisplay = "&nbsp;" + Math.floor(pomTime / 10 / 60) + ":" + Math.floor(pomTime / 10 % 60);
            if (Math.ceil(pomTime / 10 % 60) === 60) {
                pomTimeDisplay = "&nbsp;" + Math.ceil(pomTime / 10 / 60) + ":00";
            }
        }
        $("#clock").html(pomTimeDisplay);
    }

    // Fixes visual offsets caused by break timer digits changing
    function brkClockDisplayFixes() {
        if (Math.ceil(brkTime / 10 % 60) === 60) {
            brkTimeDisplay = Math.ceil(brkTime / 10 / 60) + ":00";
        }
        if (Math.floor(brkTime / 10 / 60) < 10) {
            brkTimeDisplay = "&nbsp;" + Math.floor(brkTime / 10 / 60) + ":" + Math.floor(brkTime / 10 % 60);
            if (Math.ceil(brkTime / 10 % 60) === 60) {
                brkTimeDisplay = "&nbsp;" + Math.ceil(brkTime / 10 / 60) + ":00";
            }
        }
        $("#pom-break").html(brkTimeDisplay);
    }

    function startUp() {
        $("#click-to-start").on("click", function() {
            $("#reset").on('click', function() {
                reset();
            });
            $("#pauseResume").on('click', function() {
                stopStart();
            });
            $("#click-here-text").html("&nbsp;");
            pauseResume = 1;
            setTimeout(function() {
                decrement();
            }, 900);
            $("#click-to-start").off("click");
        });
    }

    startUp();
    pomClockDisplayFixes();
    brkClockDisplayFixes();

    // Pom Clock and Break Timer adjust time buttons
    $("#clock-length-down").click(function() {
        pomTimeDisplayIncDec = 0;
        clockDisplay();
    });
    $("#clock-length-up").click(function() {
        pomTimeDisplayIncDec = 1;
        clockDisplay();
    });
    // Adjust Break Length    
    $("#break-length-down").click(function() {
        brkTimeDisplayIncDec = 0;
        breakDisplay();
    });
    $("#break-length-up").click(function() {
        brkTimeDisplayIncDec = 1;
        breakDisplay();
    });

    // Pom Clock Display  
    function clockDisplay() {
        if (pomTime <= 0) {
            return;
        }
        if (pomTimeDisplayIncDec === 0) {
            pomTime -= 600;
            if (pomTime <= 0) {
                pomTimeDisplay = 0 + ":" + 0 + 0;
                pomTime = -1;
                $("#clock").html(pomTimeDisplay);
                return;
            }
        } else {
            pomTime += 600;
        }

        pomTimeDisplay = Math.floor(pomTime / 10 / 60) + ":" + Math.floor(pomTime / 10 % 60);
        pomClockDisplayFixes();
    }

    function breakDisplay() {
        if (brkTimeDisplayIncDec === 0) {
            brkTime -= 600;
            if (brkTime <= 0) {
                brkTimeDisplay = 0 + ":" + 0 + 0;
                brkTime = -1;
                $("#pom-break").html(brkTimeDisplay);
                return;
            }
        } else {
            brkTime += 600;
        }

        brkTimeDisplay = Math.floor(brkTime / 10 / 60) + ":" + Math.floor(brkTime / 10 % 60);
        brkClockDisplayFixes();
    }

    // Pause and reset audio
    function audioPauseReset() {
        pomSound.pause();
        pomSound.currentTime = 0;
        breakSound.pause();
        breakSound.currentTime = 0;
    }

    //Pause-Resume  
    function stopStart() {
        if (pauseResume === 1) {
            pauseResume = 0;
            audioPauseReset();
            $("#pauseResume").html("Resume");
        } else {
            pauseResume = 1;
            decrement();
            $("#pauseResume").html("Pause");
        }
    }

    // Reset 
    function reset() {
        $("#reset").off('click');
        audioPauseReset();
        pomSoundTrigger = 1;
        $("#pauseResume").html("Pause");
        $("#pauseResume").off('click');
        pauseResume = 0;
        setTimeout(function() {
            // Break Time      
            brkTime = 2999;
            brkTimeDisplay = Math.ceil(brkTime / 10 / 60) + ":" + Math.ceil(brkTime / 10 % 60);
            // Break Time Display Fixes  
            brkClockDisplayFixes();
            // Pom Time      
            pomTime = 14999;
            pomTimeDisplay = Math.ceil(pomTime / 10 / 60) + ":" + Math.ceil(pomTime / 10 % 60);
            // Pom Time Display Fixes    
            pomClockDisplayFixes();
            // Enables clock to be turned on
            $("#click-here-text").html("Click Here To Start");
            startUp();
        }, 101);
    }

    // Clock Timer Function
    function decrement() {
        if (pauseResume === 1 && pomTime > 0) {
            setTimeout(function() {
                var seconds = Math.floor(pomTime / 10 % 60);
                var minutes = Math.floor(pomTime / 10 / 60);

                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                if (minutes < 10) {
                    minutes = "&nbsp;" + minutes;
                }

                document.getElementById("clock").innerHTML = minutes + ":" + seconds;
                pomTime--;
                decrement();
            }, 100);
        }
        //exit function when Pom is done
        if (pomTime <= 0) {
            pomTimeDisplay = 0 + ":" + 0 + 0;
            pomTime = -1;
            $("#clock").html(pomTimeDisplay);
            if (pomSoundTrigger === 1) {
                pomSoundTrigger = 0;
                pomSound.play();
            }
            brkDecrement();
            return;
        }
    }

    // Break Timer
    function brkDecrement() {
        if (pauseResume === 1 && brkTime > 0) {
            setTimeout(function() {
                var seconds = Math.floor(brkTime / 10 % 60);
                var minutes = Math.floor(brkTime / 10 / 60);

                if (seconds < 10) {
                    seconds = "0" + seconds;
                }

                if (minutes < 10) {
                    minutes = "&nbsp;" + minutes;
                }

                document.getElementById("pom-break").innerHTML = minutes + ":" + seconds;
                brkTime--;
                brkDecrement();
            }, 100);
        }

        //exit function when break is done
        if (brkTime <= 0) {
            brkTimeDisplay = 0 + ":" + 0 + 0;
            $("#pom-break").html(brkTimeDisplay);
            breakSound.play();
            return;
        }
    }
});