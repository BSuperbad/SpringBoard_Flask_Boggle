class BoggleGame {

    constructor(secs = 60) {
        this.secs = secs;
        this.score = 0;
        this.timesPlayed = 0;
        this.highestScore = 0;

        this.updateScoreElements();


        this.showTimer();
        this.addEventHandlers();

        this.timer = setInterval(this.tick.bind(this), 1000)
    }

    tick() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            this.disableGuesses();
            this.sendScoretoServer();
        }
    }

    disableGuesses() {
        $('.guess').prop('disabled', true);
        $('input[name="guess"]').prop('disabled', true)
    }

    showTimer() {
        $('.timer').text('Timer: ' + this.secs);
    }

    addEventHandlers() {
        const $form = $('.guess-form');
        $form.submit(this.stopSubmit.bind(this));
    }

    async stopSubmit(evt) {
        evt.preventDefault();

        const guess = $('input[name="guess"]').val();
        if (!guess) return;
        const response = await axios.get('/check-words', {
            params: {
                guess
            }
        });

        const result = response.data.result;
        if (result === "ok") {
            this.showMessage("Word on board!", "ok");
            const wordScore = guess.length;
            this.score += wordScore;
            $('.score').text('Current Score: ' + this.score);
        } else if (result === "not-on-board") {
            this.showMessage("Word not on board", "err");
        } else if (result === "not-word", "err") {
            this.showMessage("Invalid word");
        }
        $('input[name="guess"]').val("");
    }

    showMessage(message, type) {
        const $msg = $('.msg');
        $msg.text(message).removeClass().addClass(`msg ${type}`);
    }



    async postScore() {
        const resp = await axios.post("/post-score", {
            score: this.score
        });
        if (resp.data.highestScore) {
            this.showMessage(`New record: ${this.score}`, "ok");
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
        this.updateScoreElements();
    }

    updateScoreElements() {
        const timesPlayed = $('#times-played');
        const highestScore = $('#highest-score');
        timesPlayed.text(this.timesPlayed);
        highestScore.text(this.highestScore);
    }

}