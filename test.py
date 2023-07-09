from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    def test_display_board(self):
        with app.test_client() as client:
            res=client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1>Boggle Board</h1>', html)
    
    def test_check_word(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]
            
            response = client.get('/check-words?guess=ABC')
            self.assertEqual(response.json['result'], 'not-word')
            resp = client.get('/check-words?guess=beg')
            self.assertEqual(resp.json['result'], 'ok')


    def test_update_score(self):
        with app.test_client() as client:
            res = client.post('/update-score', json={'score': 100})

            self.assertEqual(res.status_code, 200)





