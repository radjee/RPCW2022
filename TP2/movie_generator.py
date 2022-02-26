
def m_generator(index, title, year, cast, genres):

    content = '''
    <!DOCTYPE html>
    <html>'''

    content += f"<title>{title}</title>"

    content += '''
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../../w3.css">
        <link rel="stylesheet" href="../../style.css">

        <style>
            body {
                font-family: "Times New Roman", Georgia, Serif;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: "Playfair Display";
                letter-spacing: 5px;
            }
        </style>

        <body>
            <!-- Top of Page -->
            <a name="top"></a>

            <!-- Navbar -->
            <div class="w3-top">
                <div class="w3-bar w3-white w3-padding w3-card" style="letter-spacing:4px;">
                    <a href="#top" class="w3-bar-item w3-button">Home</a>
                </div>
            </div>

            <br/>
            <br/>
            <br/>
            <br/>

            <!-- Page Content -->
            <!-- Title -->
            <div class="container">
    '''
    content += f"\t\t\t\t<p><b>{title}</b> <u>{year}</u></p>"

    content += '''
            </div>

            <!-- Cast -->
            <div style="margin:auto; width: 50%;">
                <div>
                    Cast:
                    <div class="stuff">
    '''
    for actor in cast:
        content += f'\t\t\t\t\t\t<a class="info" href="/atores/a{actor[1]}">{actor[0]}</a>'
    content += '''
                    </div>
                </div>

                <div>
                    Genres:
                    <div class="stuff">
    '''

    for genre in genres:
        content += f'\t\t\t\t\t\t<p class="info">{genre}</p>'

    content += '''
                    </div>
                </div>
            </div>
        </body>
    </html>
    '''

    with open(f"./htmls/filmes/f{index}.html", "w", encoding="UTF-8") as f:
        f.truncate()
        f.write(content)
