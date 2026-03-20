from itertools import islice
with open('index.html', 'r', encoding='utf-8') as f:
    for number, line in enumerate(f, start=1):
        if 90 <= number <= 240:
            print(f"{number}: {line.rstrip()}" )
