"""Build script for Manvi's Magical October Birthday site.

Generates two outputs from the shared source files:
  * manvi-birthday.html  -> single self-contained file (everything inlined)
  * index.html           -> linked project (separate styles.css / app.js)

Run:  python3 build.py
"""
import pathlib

WORK = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path('/scratch/output')
OUT.mkdir(parents=True, exist_ok=True)

css = (WORK / 'styles.css').read_text(encoding='utf-8')
js = (WORK / 'app.js').read_text(encoding='utf-8')
body = (WORK / 'markup.html').read_text(encoding='utf-8')

FAVICON = ("data:image/svg+xml,"
           "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>"
           "<circle cx='16' cy='16' r='11' fill='%234a403b'/>"
           "<circle cx='48' cy='16' r='11' fill='%234a403b'/>"
           "<circle cx='32' cy='34' r='26' fill='%23fdfbf6'/>"
           "<ellipse cx='22' cy='32' rx='8' ry='9' fill='%234a403b'/>"
           "<ellipse cx='42' cy='32' rx='8' ry='9' fill='%234a403b'/>"
           "<circle cx='32' cy='40' r='3.4' fill='%233a3330'/></svg>")

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#fdf7ee">
<meta name="color-scheme" content="light">
<title>Happy Birthday, Manvi &#127874;&#127810;</title>
<meta name="description" content="A little magical October birthday adventure, made just for Manvi.">
<meta property="og:type" content="website">
<meta property="og:title" content="Happy Birthday, Manvi &#127874;&#127810;">
<meta property="og:description" content="A little magical October birthday adventure, made just for you.">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Happy Birthday, Manvi &#127874;&#127810;">
<meta name="twitter:description" content="A little magical October birthday adventure, made just for you.">
<link rel="icon" href="%%FAVICON%%">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Caveat:wght@500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
%%STYLES%%
</head>
<body>
<div id="app">
%%BODY%%
</div>
%%SCRIPTS%%
</body>
</html>
"""


def page(styles_block, scripts_block):
    return (SHELL
            .replace('%%FAVICON%%', FAVICON)
            .replace('%%STYLES%%', styles_block)
            .replace('%%BODY%%', body)
            .replace('%%SCRIPTS%%', scripts_block))


# Single self-contained file (inlined CSS + JS)
single = page('<style>\n' + css + '\n</style>',
              '<script>\n' + js + '\n</script>')
(OUT / 'manvi-birthday.html').write_text(single, encoding='utf-8')

# Linked project (separate styles.css / app.js)
linked = page('<link rel="stylesheet" href="styles.css">',
              '<script src="app.js"></script>')
(OUT / 'index.html').write_text(linked, encoding='utf-8')

print('written manvi-birthday.html', len(single), 'bytes')
print('written index.html        ', len(linked), 'bytes')
