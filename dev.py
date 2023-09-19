from TwigWeb import backend
from TwigWeb.backend.response import Response

app = backend.Server("", debug=False, open_root = False)

app.add_static_folder("./")

@app.route("")
def root(headers):
    index = open("./index.html", "rb")
    index_content = index.read()
    index.close()
    return Response(index_content)

app.run()