import pathlib
d = pathlib.Path(__file__).parent
s = (d/'shell.html').read_text()
app = (d/'app.js').read_text().replace('/*KAART*/', (d/'kaart.js').read_text() + '\n' + (d/'rondleiding.js').read_text()).replace('/*DUEL*/', (d/'duel.js').read_text())
for tag, f in [('STYLE','style.css'),('CONTENT','content.js'),('ENGINE','engine.js')]:
    txt = (d/f).read_text() + ('\n' + (d/'duelsommen.js').read_text() if f == 'engine.js' else '')
    s = s.replace('/*%s*/' % tag, txt.replace('</script>','<\\/script>'))
s = s.replace('/*APP*/', app.replace('</script>','<\\/script>'))
(d.parent/'index.html').write_text(s)
print('index.html', len(s)//1024, 'kB')
