with open('index.html', 'rb') as f:
    lines = f.readlines()
for idx, line in enumerate(lines[:60], start=1):
    print(f"{idx}: {line.rstrip()}" )
