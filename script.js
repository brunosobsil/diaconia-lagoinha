import  * as firebase from './firebase.js';
//import rxjs from './rxjs.js';
import { paths } from './paths.js';

document.addEventListener("DOMContentLoaded", async function(e) {

    firebaseInit();
    const layout = await getLayoutCadeiras();
    let assentos = await getAssentos(layout);    
    exibirAssentos(assentos, layout);    
    subscribeOcupados();

});

async function getAssentos(layout){    

    // Criando um array com os assentos disponíveis
    let assentos = [];
    let fileiraAtual = 'A';    
    let fileiras = layout.fileiras;
    let maxFileiras = fileiras.length;
    let setor = 0;
    
    for(let fileira = 0; fileira < maxFileiras; fileira++){ // Para cada fileira            

        let numCadeira = 0;
        let divisoes = fileiras[fileira];
        
        for(let d = 0; d < divisoes.length; d++){           
            
            for(let cadeira = 0; cadeira < divisoes[d]; cadeira++){
                numCadeira++;
                assentos.push({  
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

    return assentos; 
    
}

function exibirAssentos(assentosDisponiveis, layout_cadeiras) {
    
    let table = document.getElementById('table_assentos');
    let tr, td;    
    let fileiraAtual = -1;
    let setorAtual = 0;
    let cadeirasDistribuidasSetor = 0;
    let maxColunas = getMaxColunas(layout_cadeiras.fileiras);
    tr = document.createElement('tr');
    
    for (let i = 0; i < assentosDisponiveis.length; i++) {  
        
        let assento = assentosDisponiveis[i];        
        
        // Troca de setores
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
        
        // Ttroca de fileiras
        if(fileiraAtual !== assento.fileira){
            tr = document.createElement('tr');
            table.appendChild(tr);
            fileiraAtual = assento.fileira;
        }
        
        // Alinha a direita caso necessário
        if(layout_cadeiras.alinhamentoSetores[setorAtual] === 'right' && cadeirasDistribuidasSetor === 0){
            let diferenca = maxColunas[setorAtual] - layout_cadeiras.fileiras[fileiraAtual][setorAtual];
            for(let c = 0; c < diferenca; c++){
                td = document.createElement('td');
                td.className = 'assento corredor';
                tr.appendChild(td);
                cadeirasDistribuidasSetor++;                    
            }
        }

        td = document.createElement('td');
        td.id = 'assento-' + assento.id;
        td.className = 'assento ' + assento.status;
        td.innerText = assento.id;
        td.addEventListener('click', function(e) {
          selecionarAssento(assento.id, e);
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

function selecionarAssento(assento, e) {    
   
    let td = e.target;
    if(td.classList.contains('ocupado')){
        removeOcupado(assento, e.target.key);
    }else{
        putOcupado(assento);
    }
        
}
  
function proxFileira(atual){
    return String.fromCharCode(atual.charCodeAt() + 1);
}

async function getLayoutCadeiras(){
    const db = firebase.getDatabase();
    const ref = firebase.ref(db, paths.layout_cadeiras);
    const layout = await (await firebase.get(ref).then((snap) => snap.val()));
    return layout;
}

async function getOcupados(){
    const db = firebase.getDatabase();
    const ref = firebase.ref(db, paths.ocupados);
    const ocupados = await (await firebase.get(ref).then((snap) => snap.val()));
    return ocupados;
}

function firebaseInit(){
    firebase.getAuth();
}

async function putOcupado(assento){
    const db = firebase.getDatabase();
    const ref = firebase.ref(db, paths.ocupados);
    const newref = await firebase.push(ref, assento);
    let td = document.getElementById('assento-'+assento);
    td.key = newref.key;
}

async function removeOcupado(assento, key){
    const db = firebase.getDatabase();
    const ref = firebase.ref(db, paths.ocupados + '/' + key);    
    firebase.remove(ref);
    let td = document.getElementById('assento-'+assento);
    td.key = null;    
}

function atualizaStatus(assento, status, key){
    let td = document.getElementById('assento-' + assento);
    td.className = 'assento ' + status;
    td.key = key;
}

function subscribeOcupados(){
    const db = firebase.getDatabase();
    const ref = firebase.ref(db, paths.ocupados);
    
    firebase.onChildAdded(ref, (data) => {
        atualizaStatus(data.val(), 'ocupado', data.key);        
    });
    firebase.onChildRemoved(ref, (data) => {
        atualizaStatus(data.val(), 'livre', null);        
    });
}