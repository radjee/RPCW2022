exports.home = home

// File List HTML Page Template  -----------------------------------------
function home(files, d){
    let pagHTML = `
    <!DOCTYPE html>

    <head>
        <title>File List</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/style.css" />
    </head>
    
    <body>
        <header class="w3-container w3-teal">
            <h1></h1>
        </header>
        <div class="w3-card-4 w3-margin">
            <header class="w3-container w3-teal">
                <h3>File Submit Form</h3>
            </header>
            <form class="w3-container w3-margin w3-container" method="POST" action="/files/upload" enctype="multipart/form-data">
                <div class="w3-row w3-margin-bottom">
                    <div class="w3-col s3">
                        <label class="w3-text-teal">Descrição</label>
                        <input class="w3-input" type="text" name="descricao" placeholder="Insira a descrição do ficheiro...">
                    </div>
                </div>
                <div class="w3-row w3-margin-bottom">
                    <div class="w3-col-s3">
                        <label class="w3-text-teal">Submissão Ficheiro</label>
                    </div>
                    <div class="w3-col s9 w3-border">
                        <input class="w3-input" type="file" name="myFile">
                    </div>
                </div>
                <div class="w3-row w3-margin-top">
                    <input class="w3-btn w3-teal" type="submit" value="Adicionar">
                </div>
                <div class="w3-row w3-margin-bottom"></div>
            </form>
        </div>
        <div class="w3-card-4 w3-margin">
            <header class="w3-container w3-teal" style="text-align:center">
                <h3>Lista de Ficheiros</h3>
            </header>
            <table class="w3-container w3-margin w3-table">
                <tbody>
                    <tr>
                        <th class="w3-text-teal">Date</th>
                        <th class="w3-text-teal">Nome Ficheiro </th>
                        <th class="w3-text-teal">Descrição</th>
                        <th class="w3-text-teal">Size</th>
                        <th class="w3-text-teal">Type</th>
                        <th> </th>
                    </tr>
    `

    files.forEach(element => {
        if (element.show == 'true')
            pagHTML += `
                <tr>
                    <td>${element.date}</td>
                    <td>${element.name}</td>
                    <td>${element.description}</td>
                    <td>${element.size}</td>
                    <td>${element.mimetype}</td>
                    <td>
                        <form action="/files/delete/${element.id}" method="POST">
                            <input class="w3-btn w3-teal" type="submit" value="DELETE"/>
                        </form>
                    </td>
                </tr>
            `
    });

    pagHTML += `
                </tbody>
            </table>
        </div>
    </body>
    
    </html>
    `
    return pagHTML
}