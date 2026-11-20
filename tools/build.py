import os,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src=lambda f: open(os.path.join(R,'src',f)).read()
tpl=src('index.tpl.html'); css=src('style.css')+'\n'+src('theme.css'); fonts=open(os.path.join(R,'vendor','barlow.css')).read(); js='\n'.join(src(f) for f in ['data.js','icons.js','sponsors.js','world.js','game.js','plus.js','story.js','teach.js','gfx.js','shell.js'])
html=tpl.replace('/*FONTS*/',fonts).replace('/*CSS*/',css).replace('/*JS*/',js)
open(os.path.join(R,'index.html'),'w').write(html)
os.makedirs(os.path.join(R,'dist'),exist_ok=True)
inl=html
for f in ['vendor/three/three.min.js','vendor/three/GLTFLoader.js','vendor/three/SkeletonUtils.js','moneybot-assets.js']:
    inl=inl.replace('<script src="%s"></script>'%f,'<script>'+open(os.path.join(R,f)).read().replace('</script>','<\\/script>')+'</script>')
open(os.path.join(R,'dist','artifact.html'),'w').write(inl)
print('built', len(html)//1024,'KB index,', len(inl)//1024,'KB artifact')
