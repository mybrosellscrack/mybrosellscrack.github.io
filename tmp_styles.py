with open('styles.css', 'r', encoding='utf-8') as f:
    for number, line in enumerate(f, start=1):
        if 60 <= number <= 220:
            print(f"{number}: {line.rstrip()}" )
