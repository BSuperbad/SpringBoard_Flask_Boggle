from boggle import Boggle
from flask import Flask, request, render_template, jsonify, session

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'

boggle_game = Boggle()



@app.route('/')
def display_board():
    """Shows Boggle board"""
    board = boggle_game.make_board()
    # Store the board in session
    session['board'] = board
    return render_template('board.html', board=board)

@app.route('/check-words')
def check_word():
    """Takes the form value and checks if it's a valid word in the dictionary"""
    board = session['board']
    word = request.args.get('guess')
    response = boggle_game.check_valid_word(board, word)

    return jsonify(result=response)

@app.route('/update-score', methods=['POST'])
def update_score():
    """Updates the score and times played on the server"""
    score = request.json['score']
    highscore = session.get('highscore', 0)
    times_played = session.get('times_played', 0)

    session['times_played'] = times_played +1
    session['highscore'] = max(score, highscore)
  
    return jsonify(highestScore =score > highscore)




