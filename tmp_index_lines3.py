with open('index.html', 'r', encoding='utf-8') as f:
    for number, line in enumerate(f, start=1):
        if number >= 200:
            print(f"{number}: {line.rstrip()}" )
