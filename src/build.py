import pathlib
d = pathlib.Path(__file__).parent
s = (d/'shell.html').read_text()
for tag, f in [('STYLE','style.css'),('CONTENT','content.js'),('ENGINE','engine.js'),('APP','app.js')]:
    s = s.replace('/*%s*/' % tag, (d/f).read_text().replace('</script>','<\\/script>'))
(d/'dist').mkdir(exist_ok=True)
(d/'dist'/'index.html').write_text(s)
print('dist/index.html', len(s)//1024, 'kB')
