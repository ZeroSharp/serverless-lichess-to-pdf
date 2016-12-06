import sys
import re

if len(sys.argv) < 2:
  print 'Usage: python {} webfont-file.svg'.format(sys.argv[0])
  sys.exit()

with open(sys.argv[1], 'r') as r:
  lines = r.read().split('\n')
  glyphs = [x for x in lines if '<glyph' in x]
  # for every glyph element in the file
  for i in range(0, len(glyphs)):
    filename = re.search(r'glyph-name="([^"]+)"', glyphs[i])
    filename = filename.group(1) if filename else str(i + 1).rjust(3, '0')
    with open(filename + ".svg", 'w') as w:
      w.write('<?xml version="1.0" standalone="no"?>\n')
      w.write('<svg width="1500px" height="1500px" version="1.1" xmlns="http://www.w3.org/2000/svg">\n')
      # replace 'glyph' with 'path' and flip vertically
      w.write(glyphs[i].replace('<glyph', '<path transform="scale(1, -1) translate(0, -1500)"') + '\n')
      w.write('</svg>')