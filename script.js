(function() {
    var currentPlayer = "player1";
    var currentHighlightedPlayer = $(".highlighted-player");
    var gamePieces = $(".piece");
    currentHighlightedPlayer.text("Player 1's Turn");
    currentHighlightedPlayer.addClass("player-one");
    gamePieces.addClass(currentPlayer);
    gamePieces.addClass("invisible");

    var pieceDropping = false;

    for (var i = 0; i < gamePieces.length; i++) {
        (function(pieceIndex) {
            gamePieces.eq(pieceIndex).on("click", function(e) {
                if (!pieceDropping) {
                    var columns = $(e.target.parentNode.parentNode)
                        .siblings()
                        .children();
                    var col = columns.eq(pieceIndex);
                    var slotsInCol = col.children();
                    var container = col.parent();
                    var totalSlots = container.children().children();

                    for (var i = slotsInCol.length - 1; i >= 0; i--) {
                        if (
                            !slotsInCol.eq(i).hasClass("player1") &&
                            !slotsInCol.eq(i).hasClass("player2")
                        ) {
                            // put piece drop animation here instead of instantly adding class
                            // need to make piece go to position of lowest empty slot
                            // after piece falls into slot, add class to slot and move piece back
                            // instantly to starting position

                            var originalPieceYPosition = $(this).offset().top;
                            var slotYPosition = slotsInCol.eq(i).offset().top;
                            var dropDistance =
                                slotYPosition - originalPieceYPosition + 10;

                            $(this).css({
                                opacity: 1
                            });

                            pieceDropping = true;
                            $(this).animate(
                                {
                                    top: "+=" + dropDistance
                                },
                                500,
                                function() {
                                    pieceDropping = false;
                                    slotsInCol.eq(i).addClass(currentPlayer);

                                    $(this).css({
                                        top: originalPieceYPosition,
                                        opacity: ""
                                    });
                                    if (checkForVictory(slotsInCol)) {
                                        // if i get here there has been a column victory..
                                        // time to do the victory dance!
                                        blink();
                                        currentHighlightedPlayer.text(
                                            "Player " +
                                                currentPlayer[6] +
                                                " wins!"
                                        );
                                        confirmPlayAgain();
                                    } else if (checkForVictory(slotsInRow)) {
                                        blink();
                                        currentHighlightedPlayer.text(
                                            "Player " +
                                                currentPlayer[6] +
                                                " wins!"
                                        );

                                        confirmPlayAgain();
                                    } else if (
                                        checkDiagonalVictory(totalSlots)
                                    ) {
                                        currentHighlightedPlayer.text(
                                            "Player " +
                                                currentPlayer[6] +
                                                " wins!"
                                        );

                                        blink();
                                        confirmPlayAgain();
                                    } else {
                                        switchPlayer();
                                    }
                                }
                            );
                            break;
                        }
                    }

                    var slotsInRow = $(".row" + i);
                    if (i === -1) {
                        return;
                    }
                }
            });
        })(i);

        gamePieces.eq(i).hover(
            function() {
                if (!pieceDropping) {
                    $(this).removeClass("invisible");
                }
            },
            function() {
                $(this).addClass("invisible");
            }
        );
    }

    var victoryBlink = [];

    function checkForVictory(slots) {
        // in here we will check to see if there are 4 in a row...
        var count = 0;

        // we want to loop through the slots, and see if there are 4 sequentially
        // the same...
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                // do something...
                // this means we found a slot with current player.
                victoryBlink.push(slots.eq(i));

                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                // do something else...
                // this means there is no current player, so reset count
                count = 0;
                victoryBlink = [];
            }
        }
    }

    function checkDiagonalVictory(slots) {
        //loop through all slots in all columns
        for (var i = 0; i < slots.length; i++) {
            if (
                slots.eq(i).hasClass(currentPlayer) &&
                !slots.eq(i).is(":last-child")
            ) {
                victoryBlink.push(slots.eq(i));
                if (
                    slots.eq(i + 7).hasClass(currentPlayer) &&
                    !slots.eq(i + 7).is(":last-child")
                ) {
                    victoryBlink.push(slots.eq(i + 7));
                    if (
                        slots.eq(i + 14).hasClass(currentPlayer) &&
                        !slots.eq(i + 14).is(":last-child")
                    ) {
                        victoryBlink.push(slots.eq(i + 14));
                        if (slots.eq(i + 21).hasClass(currentPlayer)) {
                            victoryBlink.push(slots.eq(i + 21));
                            return true;
                        }
                    }
                }
            }
            victoryBlink = [];
            if (
                slots.eq(i).hasClass(currentPlayer) &&
                !slots.eq(i).is(":first-child")
            ) {
                victoryBlink.push(slots.eq(i));
                if (
                    slots.eq(i + 5).hasClass(currentPlayer) &&
                    !slots.eq(i + 5).is(":first-child")
                ) {
                    victoryBlink.push(slots.eq(i + 5));
                    if (
                        slots.eq(i + 10).hasClass(currentPlayer) &&
                        !slots.eq(i + 10).is(":first-child")
                    ) {
                        victoryBlink.push(slots.eq(i + 10));
                        if (slots.eq(i + 15).hasClass(currentPlayer)) {
                            victoryBlink.push(slots.eq(i + 15));
                            return true;
                        }
                    }
                }
            }
            victoryBlink = [];
        }
    }

    function confirmPlayAgain() {
        setTimeout(function() {
            if (confirm("Player " + currentPlayer[6] + " wins! Play again?")) {
                window.location.reload();
            } else {
                pieceDropping = true;
            }
        }, 3000);
    }

    function switchPlayer() {
        gamePieces.removeClass(currentPlayer);
        currentPlayer === "player1"
            ? (currentPlayer = "player2")
            : (currentPlayer = "player1");
        gamePieces.addClass(currentPlayer);

        if (currentHighlightedPlayer.hasClass("player-one")) {
            currentHighlightedPlayer.removeClass("player-one");
            currentHighlightedPlayer.text("Player 2's Turn");
            currentHighlightedPlayer.addClass("player-two");
        } else {
            currentHighlightedPlayer.removeClass("player-two");
            currentHighlightedPlayer.text("Player 1's Turn");
            currentHighlightedPlayer.addClass("player-one");
        }
    }
    function blink() {
        for (let i = 0; i < victoryBlink.length; i++) {
            setInterval(function() {
                victoryBlink[i]
                    .children()
                    .fadeOut(100)
                    .fadeIn(100);
            }, 200);
        }
    }
})();
