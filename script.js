import { layout_cadeiras } from './layout_cadeiras.js';

document.addEventListener("DOMContentLoaded", function(e) {

    // Criando um array com os assentos disponíveis
    let assentosDisponiveis = [];
    let fileiraAtual = 'A';
    let fileiras = layout_cadeiras.fileiras;
    let maxFileiras = fileiras.length;
    let setor = 0;
    
    for(let fileira = 0; fileira < maxFileiras; fileira++){ // Para cada fileira            

        let numCadeira = 0;
        let divisoes = fileiras[fileira];
        
        for(let d = 0; d < divisoes.length; d++){           
            
            for(let cadeira = 0; cadeira < divisoes[d]; cadeira++){
                numCadeira++;
                assentosDisponiveis.push({  
                    id: fileiraAtual + numCadeira,
                    status: 'livre',                    
                    fileira: fileira,
                    setor: setor
                });
            }

            if(setor < divisoes.length-1){
                setor++;
            }
            else{
                setor = 0;
            }
            
        }      
        
        fileiraAtual = proxFileira(fileiraAtual);
        
    }

    exibirAssentos(assentosDisponiveis);    
});

function exibirAssentos(assentosDisponiveis) {
    
    let table = document.getElementById('table_assentos');
    let tr, td;    
    let fileiraAtual = -1;
    let setorAtual = 0;
    let cadeirasDistribuidasSetor = 0;
    let maxColunas = getMaxColunas(layout_cadeiras.fileiras);
    tr = document.createElement('tr');
    
    for (let i = 0; i < assentosDisponiveis.length; i++) {  
        
        let assento = assentosDisponiveis[i];
        
        if(setorAtual !== assento.setor){
            
            if(cadeirasDistribuidasSetor < maxColunas[setorAtual]){
                let diferenca = maxColunas[setorAtual] - cadeirasDistribuidasSetor;
                for(let c = 0; c < diferenca; c++){
                    td = document.createElement('td');
                    td.className = 'assento corredor';
                    tr.appendChild(td);
                    cadeirasDistribuidasSetor++;                    
                }
            }
            
            td = document.createElement('td');
            td.className = 'assento corredor';
            tr.appendChild(td);
            setorAtual = assento.setor;
            cadeirasDistribuidasSetor = 0;
        }
        
        if(fileiraAtual !== assento.fileira){
            tr = document.createElement('tr');
            table.appendChild(tr);
            fileiraAtual = assento.fileira;
        }

        td = document.createElement('td');
        td.id = 'assento-' + assento.id;
        td.className = 'assento ' + assento.status;
        td.innerText = assento.id;
        td.addEventListener('click', function() {
          selecionarAssento(assento);
        });

        tr.appendChild(td);
        cadeirasDistribuidasSetor++;
        
    }
}

function getMaxColunas(fileiras){
    let maxColunas = [];
    for(let c = 0; c < fileiras[0].length; c++){  // colunas
        let max = 0;
        for(let l = 0; l < fileiras.length; l++){ // linhas
            if(fileiras[l][c] > max){
                max = fileiras[l][c];
            }
        }
        maxColunas.push(max);
    }
    return maxColunas;
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



