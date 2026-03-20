import sys
try:
    import PyPDF2
except ImportError:
    print('PyPDF2 not installed')
    sys.exit(2)
reader = PyPDF2.PdfReader('Concept.pdf')
text = []
for page in reader.pages:
    content = page.extract_text()
    if content:
        text.append(content.strip())
print('\n---\n'.join(text))
