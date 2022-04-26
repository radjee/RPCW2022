var adicionar = '<button class="w3-button w3-round w3-teal w3-hover-white" id="adicionarPara">Adicionar</button>'

function reloadList() {
    $("#metodo").empty()
    $("#metodo").append(adicionar)
    $("#listaPara").empty()
    $.get("http://localhost:4000/para", dados => {
        dados.forEach(p => {
            var item = `<div class="li-item row">
                <h2 id="paragrafo">${p.para}</h2>
                <div class="column">
                    <p>
                        <b>Criado a:</b> ${p.data}
                    </p>
                `
                
            if (p.editado != undefined) {
                    item +=  `<p>
                        <b>Editado a:</b> ${p.editado}
                    </p>`
            }

            item += `
                    <p><small><b>Id</b>: ${p._id}</small></p>
                </div>
                <div class="column">
                    <button class="w3-right w3-button w3-round w3-teal w3-hover-white" id="editarPara" onclick="editar('${p._id}','${p.para}')">Editar</button>
                    <button class="w3-right w3-button w3-round w3-red w3-hover-white" id="apagarPara" value="${p._id}">Apagar</button>
                </div>
            </div>
            `

            $("#listaPara").append(item)
        })
    })
    var d = new Date().toISOString().substring(0, 20)
    $("#data").empty()
    $("#data").append(d)
}

function editar(id, para) {
    event.preventDefault()
    $('#paraText').val(para);
    $("#metodo").empty()
    $("#metodo").append(`<button class="w3-button w3-round w3-teal w3-hover-white" id="atualizarPara" value=${id}>Atualizar</button>`)
}

$(function() {
    reloadList()

    $("body").on('click', '#adicionarPara', () => {
        event.preventDefault()
        if ($("#paraText").val() != "") {
            $.ajax({
                url: 'http://localhost:4000/para',
                data: $("#myParaForm").serialize(),
                type: 'POST',
                success: function(data) {
                    $("#paraText").val("")
                    reloadList()
                }
            });
        } else {
            alert("Não pode ir vazio!")
        }
    })
    
    $("body").on('click', '#apagarPara', () => {
        event.preventDefault()
        $.ajax({
            url: 'http://localhost:4000/para',
            data: {_id: $("#apagarPara").val()},
            type: 'DELETE',
            success: function(response) {
                reloadList()
            }
        });
    })

    $("body").on('click', '#atualizarPara', () => {
        event.preventDefault()
        $.ajax({
            url: 'http://localhost:4000/para',
            data: { _id: $("#atualizarPara").val(), para: $('#paraText').val()},
            type: 'PUT',
            success: function(response) {
                $("#paraText").val("");
                reloadList();
            }
        });
    })

    $("body").on('click', '#reset', () => {
        event.preventDefault()
        $('#paraText').val("");
        $("#metodo").empty();
        $("#metodo").append(adicionar);
    })
    
})