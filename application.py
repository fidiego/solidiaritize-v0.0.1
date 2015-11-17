import os, sys
from flask import Flask
from flask import render_template
from flask_frozen import Freezer

app = Flask(__name__)
freezer = Freezer(app)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/error/')
def error():
    return render_template('404.html')

@app.route('/about/')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        os.system('rm -r build')
        freezer.freeze()
    else:
        app.run()
