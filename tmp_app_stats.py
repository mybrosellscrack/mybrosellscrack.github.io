with open('app.js', 'r', encoding='utf-8') as f:
    for number, line in enumerate(f, start=1):
        if 470 <= number <= 560:
            print(f"{number}: {line.rstrip()}" )
