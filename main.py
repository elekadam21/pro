from flask import Flask, render_template, url_for, request, jsonify

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


@app.route('/create-new-board', methods=['GET', 'POST'])
@json_response
def create_new_board():
    data = request.get_json()
    data_handler.create_new_board()
    top_board = data_handler.get_last_board()
    data_handler.create_status(top_board[0]['id'])
    return top_board

  
@app.route("/create-card", methods=["GET", "POST"])
@json_response
def create_card():
    data = request.get_json()
    data_handler.create_card(data["board_id"], data["status_id"])
    return data_handler.get_all_from_table('cards')


@app.route("/rename", methods=['GET', 'POST'])
@json_response
def rename():
    data = request.get_json()
    response = data_handler.rename_board(data["title"], data["id"])
    return response


def main():
    app.run(debug=True, port=5000)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
