import pathlib
d = pathlib.Path(__file__).parent
s = (d/'shell.html').read_text()
app = (d/'app.js').read_text().replace('/*KAART*/', (d/'kaart.js').read_text())
for tag, f in [('STYLE','style.css'),('CONTENT','content.js'),('ENGINE','engine.js')]:
    s = s.replace('/*%s*/' % tag, (d/f).read_text().replace('</script>','<\\/script>'))
s = s.replace('/*APP*/', app.replace('</script>','<\\/script>'))
(d.parent/'index.html').write_text(s)
print('index.html', len(s)//1024, 'kB')
