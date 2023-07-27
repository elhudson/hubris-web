import os

modules=['themes','components','configs']
for m in modules:
    file=""
    partials=os.listdir(f"{os.path.abspath(os.path.pardir)}/sass/modules/{m}")
    for p in partials:
        title=p.split('/')[-1].removeprefix('_').removesuffix('.scss')
        file+=f"@forward 'modules/{m}/{title}';"
        file+='\n'
    direct=open(f'{os.path.abspath(os.path.pardir)}/sass/_{m}.scss','w+')
    direct.write(file)
    direct.close()