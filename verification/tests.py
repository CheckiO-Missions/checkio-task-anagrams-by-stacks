"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "explanation" -- your right explanation
    "answer" -- not necessary key, it's using for additional info in animation.
"""


TESTS = {
    "Basics": [
        {
            "input": "rice-cire",
            "explanation": "10,12,12,12,02",
            "answer": 5
        },
        {
            "input": "tort-trot",
            "explanation": "12,12,12,12",
            "answer": 4
        },
        {
            "input": "hello-holle",
            "explanation": "12,12,12,12,10,21,21,21,21,02,12,12,12,12",
            "answer": 14
        },
        {
            "input": "anagram-mragana",
            "explanation": "12,10,12,02,12,12,12,12",
            "answer": 8
        },
        {
            "input": "mirror-mirorr",
            "explanation": "12,12,10,12,12,02,10,21,21,21,21,21,02,12,12,12,10,21,21,21,02,12,12,12,12",
            "answer": 25
        },
        {
            "input": "arrrrrgh-ghrrrrra",
            "explanation": "10,12,02,12,12,12,12,12,12",
            "answer": 9
        },
        {
            "input": "checkio-iocheck",
            "explanation": "10,12,02,10,12,02,10,12,01,21,20,12,12,12,02",
            "answer": 15
        },
        {
            "input": "windows-downsiw",
            "explanation": "12,10,12,02,10,21,21,01,20,12,12,12,12,02,12,12",
            "answer": 16
        },
        {
            "input": "tests-setts",
            "explanation": "12,10,12,12,01,21,20,12,12,12,02",
            "answer": 11
        },
        {
            "input": "solution-tionulos",
            "explanation": "10,12,12,02,10,21,21,01,20,12,12,02,12,12,12,12,12",
            "answer": 17
        },
        {
            "input": "superman-namperus",
            "explanation": "12,12,12,10,12,02,10,21,21,02,12,12,12,12",
            "answer": 14
        },
        {
            "input": "library-rarybil",
            "explanation": "10,12,12,12,02,12,12,12",
            "answer": 8
        }
    ],
    "Extra": [
        {
            "input": "arb-bra",
            "explanation": "12,12,12",
            "answer": 3
        },
        {
            "input": "qwerty-ytreqw",
            "explanation": "12,12,12,12,10,12,02",
            "answer": 7
        },
        {
            "input": "rest-ters",
            "explanation": "12,10,12,12,02",
            "answer": 5
        },
        {
            "input": "stack-ckast",
            "explanation": "10,12,02,12,10,12,02",
            "answer": 7
        },
        {
            "input": "list-silt",
            "explanation": "10,12,12,12,02",
            "answer": 5
        },
        {
            "input": "offroad-roadffo",
            "explanation": "10,12,12,02,10,21,21,01,20,12,12,02,12,12,12,12",
            "answer": 16
        },
        {
            "input": "youmean-nameyuo",
            "explanation": "12,12,10,12,02,12,12,10,21,21,02,12,12",
            "answer": 13
        },
        {
            "input": "roadmap-padroam",
            "explanation": "12,12,10,12,12,12,02,10,21,21,01,20,12,12,02,12",
            "answer": 16
        }
    ]
}


for cat in TESTS.keys():
    for t in TESTS[cat]:
        t["answer"] = t["answer"], t["input"]