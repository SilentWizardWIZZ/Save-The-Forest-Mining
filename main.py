from flask import Flask, render_template, send_from_directory
import os

# Create Flask app with static files in the root directory
app = Flask(__name__, 
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/styles.css')
def serve_css():
    return send_from_directory('.', 'styles.css')

@app.route('/game.js')
def serve_js():
    return send_from_directory('.', 'game.js')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)