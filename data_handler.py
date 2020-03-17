from psycopg2._psycopg import cursor

import persistence
from psycopg2.extras import RealDictCursor
# def get_card_status(status_id):
#     """
#     Find the first status matching the given id
#     :param status_id:
#     :return: str
#     """
#     statuses = persistence.get_statuses()
#     return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')
#
#
# def get_boards():
#     """
#     Gather all boards
#     :return:
#     """
#     return persistence.get_boards(force=True)
#
#
# def get_cards_for_board(board_id):
#     persistence.clear_cache()
#     all_cards = persistence.get_cards()
#     matching_cards = []
#     for card in all_cards:
#         if card['board_id'] == str(board_id):
#             card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
#             matching_cards.append(card)
#     return matching_cards
#
#
# @persistence.connection_handler
# def get_boards(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM boards'''
#     cursor.execute(query)
#     return cursor.fetchall()
#
#
# @persistence.connection_handler
# def get_statuses(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM statuses'''
#     cursor.execute(query)
#     return cursor.fetchall()
#
#
# @persistence.connection_handler
# def get_cards(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM cards'''
#     cursor.execute(query)
#     return cursor.fetchall()


# felső három együtt
@persistence.connection_handler
def get_all_from_table(cursor: RealDictCursor, table) -> list:
    query = '''
    SELECT *
    FROM {}'''.format(table)
    cursor.execute(query)
    return cursor.fetchall()
