def atores_generator(actor_tuples):

    content = '''
    <!DOCTYPE html>
    <html>
    
        <title>Index</title>
    
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/w3">
        <link rel="stylesheet" href="/style">

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
                <p><b>Index</b></p>
            </div>

            <!-- HTMLS -->
            <div style="margin:auto; width: 50%;">
                <div>
                    <div class="stuff">
                        
    '''

    for item in actor_tuples:
        content += f'<a class="poster" href="/atores/a{item[0]}">{item[1]}</a>\n'

    content +='''
                    </div>
                </div>
            </div>
        </body>
    </html>
    '''

    with open(f"./htmls/atores.html", "w", encoding="UTF-8") as f:
        f.truncate()
        f.write(content)
