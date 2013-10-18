from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers

from tests import TESTS

GOOD_ACTIONS = ("12", "10", "01", "02", "20", "21")


def process_data(answer, user_result):
    min_length, indata = answer
    start, end = indata.split("-")
    stacks = [[], list(start), []]
    if not isinstance(user_result, str):
        return False, ("", "Your result is not a string.")
    actions = user_result.split(",")
    user_actions = []
    for act in actions:
        if act not in GOOD_ACTIONS:
            return False, (",".join(user_actions), "Wrong action " + str(act))
        from_s = int(act[0])
        to_s = int(act[1])
        if not stacks[from_s]:
            return False, (",".join(user_actions), "Tried to pop from empty stack")
        if to_s == 0 and stacks[to_s]:
            return False, (",".join(user_actions), "Tried to push in the full buffer")
        stacks[to_s].append(stacks[from_s].pop())
        user_actions.append(act)
    res_word = ''.join(stacks[2])
    if len(actions) > min_length:
        return False, (",".join(user_actions), "Too long solution.")
    if res_word == end:
        return True, (",".join(user_actions), "All right!")
    else:
        return False, (",".join(user_actions), "Wrong word in the result.")


api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        checker=process_data).on_ready)
