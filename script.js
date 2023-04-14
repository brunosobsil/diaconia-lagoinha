document.addEventListener("DOMContentLoaded", function(e) {

    // Criando um array com os assentos disponíveis
    let assentosDisponiveis = [];

    let fileiraAtual = 'A';
    let setorAtual = 1;

    let maxSetores = 3;
    let maxCadeirasFileira = 15;
    let maxCadeirasSetor = 5;
    let totalCadeiras = 180;            
    let cadeirasDistribuidasSetor = 0;
    let cadeirasDistribuidasFileira = 0;

    for(let i = 1; i <= totalCadeiras; i++){              
        
        cadeirasDistribuidasSetor++;
        cadeirasDistribuidasFileira++;
        assentosDisponiveis.push({id: fileiraAtual + cadeirasDistribuidasFileira, status: 'livre', setor: setorAtual});

        if(cadeirasDistribuidasSetor >= maxCadeirasSetor){
        
            if(setorAtual !== maxSetores)
                setorAtual++;                  
            else
                setorAtual = 1;

            cadeirasDistribuidasSetor = 0;                              
        }

        if(cadeirasDistribuidasFileira >= maxCadeirasFileira){
            fileiraAtual = proxFileira(fileiraAtual);
            cadeirasDistribuidasFileira = 0;
            setorAtual = 1;                
        }

    }
    
    exibirAssentos(assentosDisponiveis);    
});

function exibirAssentos(assentosDisponiveis) {

    let maxCadeirasFileira = 15;
    let cadeirasDistribuidasFileira = 1;
    let maxSetores = 3;
    let table = document.getElementById('table_assentos');
    let tr, td;
    let setorAtual = 1;
    tr = document.createElement('tr');
    table.appendChild(tr);            
    
    for (let i = 0; i < assentosDisponiveis.length; i++) {        

        if(cadeirasDistribuidasFileira > maxCadeirasFileira){
            tr = document.createElement('tr');            
            table.appendChild(tr);
            cadeirasDistribuidasFileira = 1;
        }

        let assento = assentosDisponiveis[i];

        if(setorAtual !== assento.setor){
            if(setorAtual !== maxSetores){
                td = document.createElement('td');        
                tr.appendChild(td);
            }
            setorAtual = assento.setor;
        }

        td = document.createElement('td');
        td.id = 'assento-' + assento.id;
        td.className = 'assento ' + assento.status;
        td.innerText = assento.id;
        td.addEventListener('click', function() {
          selecionarAssento(assento);
        });
        tr.appendChild(td);

        cadeirasDistribuidasFileira++;        
    }
  }

function selecionarAssento(assento) {
    
    if (assento.status === 'livre') {
        assento.status = 'selecionado';
        const assentoDiv = document.getElementById('assento-' + assento.id);
        assentoDiv.className = 'assento ' + assento.status;
    } else if (assento.status === 'selecionado') {
        assento.status = 'livre';
        const assentoDiv = document.getElementById('assento-' + assento.id);
        assentoDiv.className = 'assento ' + assento.status;
    } else {
        alert('Esse assento já está ocupado!');
    }
}
  
function proxFileira(atual){
    return String.fromCharCode(atual.charCodeAt() + 1);
}



