with open('app.js', 'r', encoding='utf-8') as f:
    for number, line in enumerate(f, start=1):
        if 720 <= number <= 820:
            print(f"{number}: {line.rstrip()}" )
