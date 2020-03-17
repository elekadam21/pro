from flask import Flask, render_template, url_for
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    return data_handler.get_all_from_table('boards')


@app.route("/get-cards")
@json_response
def get_all_cards():
    return data_handler.get_all_from_table('cards')


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_all_from_table('statuses')


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
