import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalAction, PoNotificationService, PoTableAction, PoTableColumn, PoLoadingModule, PoFieldModule, PoIconModule, PoButtonModule, PoTableModule, PoDialogService, PoTooltipModule } from '@po-ui/ng-components';
import { Usuario } from '../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { ServerTotvsService } from '../services/server-totvs.service';

@Component({
    selector: 'app-monitor-processos',
    templateUrl: './monitor-processos.component.html',
    styleUrls: ['./monitor-processos.component.css'],
    standalone: true,
    imports: [NgIf, PoLoadingModule, PoFieldModule, FormsModule, PoIconModule, PoButtonModule, PoTableModule, NgClass, PoTooltipModule]
})
export class MonitorProcessosComponent {

private srvTotvs = inject(ServerTotvsService)
private srvNotification = inject(PoNotificationService);
private router = inject(Router)
private route = inject(ActivatedRoute)
private srvDialog = inject(PoDialogService);
  



//ListasCombo
listaEstabelecimentos!: any[];
listaTecnicos!: any[];
codEstabel: string = '';
codUsuario: string = '';
nrProcess:string=''
usuarioLogado: boolean = false;
loadTecnico: string = '';
placeHolderEstabelecimento: string = '';
loadTela: boolean = false;
redirectTo!:string
mostrarLabel:boolean=false
colunas!:PoTableColumn[]
lista!:any[]
labelContador:string[]=[]
alturaGrid:number=window.innerHeight - 255


//--- Actions
readonly acoes: PoTableAction[] = [
  {
    label: 'Entradas e Saídas',
    icon: 'bi bi-archive',
    action: this.NotasFiscais.bind(this),
  },
  {
    label: 'Reparos',
    icon: 'bi bi-tools',
    action: this.Reparos.bind(this),
  },
  {
    label: 'Embalagem',
    icon: 'bi bi-box2',
    action: this.Embalagem.bind(this),
  }

  ];

  

ngOnInit(): void {

  this.mostrarLabel=false
  

  this.colunas = this.srvTotvs.obterColunasMonitor()
  this.srvTotvs.EmitirParametros({ tituloTela: 'EMPRÉSTIMOS - MONITOR ACOMPANHAMENTO DE PROCESSOS', estabInfo:undefined});

  let monitor = this.srvTotvs.ObterMonitor()
  if (monitor !== undefined)
  {
    this.listaEstabelecimentos = monitor.listaEstab
    this.codEstabel = monitor.estabSelecionado
    //this.lista = monitor.listaGrid
    this.onListar()
  }
  else{
    
    //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...';
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        this.listaEstabelecimentos = (response as any[]).sort(
          this.srvTotvs.ordenarCampos(['label']));
        
        this.placeHolderEstabelecimento = 'Selecione um estabelecimento';
      },
      error: (e) => {
        //this.srvNotification.error('Ocorreu um erro na requisição');
        return;
      },
    });
  }
}


public onListar(){
  this.srvTotvs.EmitirParametros({ tituloTela: 'EMPRÉSTIMOS - MONITOR ACOMPANHAMENTO DE PROCESSOS', estabInfo:undefined});
 
  this.loadTela=true;
  let params:any={codEstabel: this.codEstabel}
  this.srvTotvs.ObterProcessosEstab(params).subscribe({
    next: (response:any)=>{
      
      this.lista =[]
      this.lista = (response.items as any[]).sort(this.srvTotvs.ordenarCampos(['nr-process']));
      this.labelContador[0] = this.lista.filter(o=> o['sit-nota'] === 'E').length.toString()
      this.labelContador[1] = this.lista.filter(o=> o['sit-nota'] === 'S').length.toString()
      this.srvTotvs.SetarMonitor({listaEstab: this.listaEstabelecimentos, listaGrid: this.lista, estabSelecionado: this.codEstabel})
      this.loadTela = false
    },
    error: (e)=> {this.loadTela = false}
    })

}

Etiqueta(obj:any){

}

NotasFiscais(obj:any){
  let estab = this.listaEstabelecimentos.find((o) => o.value === this.codEstabel);
  
  this.srvTotvs.EmitirParametros({tituloTela: 'EMPRÉSTIMOS - DASHBOARD DE NOTAS FISCAIS',
                                  estabInfo: estab.label, 
                                  tecInfo: `${obj['cod-emit-ori']} ${obj['nome-abrev-ori']}`,
                                  tecInfoOut: `${obj['cod-emit-dest']} ${obj['nome-abrev-dest']}`, 
                                  processoInfo:obj['nr-process']})
  this.AbrirTela(obj, 'dashboard')
}

ResumoFinal(obj:any){
  if(obj.situacao.toUpperCase() === "L")
    this.AbrirTela(obj, 'resumofinal')
   else
   this.srvNotification.error("Situação do processo não permite chamar esta tela !")
}


Embalagem(obj:any){
  if(obj.situacao.toUpperCase() === "B")
   this.AbrirTela(obj, 'embalagem')
  else
  this.srvNotification.error("Situação do processo não permite chamar esta tela !")
}

Reparos(obj:any){
  if(obj.situacao.toUpperCase() === "R")
    this.AbrirTela(obj, 'reparos')
   else
   this.srvNotification.error("Situação do processo não permite chamar esta tela !")
}

AbrirTela(obj:any, cTela:string){
  this.loadTela=true
  //Setar Estabelecimento e Usuario utilizado no calculo
  this.srvTotvs.SetarUsuario(obj["cod-estabel"], obj["cod-emit-ori"], obj["nr-process"])
   //Parametros da Nota
   let paramsTec: any = {codEstabel: obj["cod-estabel"], codTecnico: obj["cod-emit-ori"]};
  //Chamar Método
 this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
    next: (response: any) => {
      //Atualizar Informacoes Tela
      let estab = this.listaEstabelecimentos.find((o) => o.value === this.codEstabel);
     // this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: `${obj['cod-emitente']} ${obj['nome-abrev']}`, processoInfo:response.nrProcesso, processoSituacao: response.situacaoProcesso})
      this.router.navigate([cTela])
    },
  });
}

onReprocessarNotas(obj:any) {
  
  this.srvDialog.confirm({
    title: 'REPROCESSAR NOTAS',
    message:
       "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> CONFIRMA REPROCESSAMENTO ?</span></div><p>O reprocessamento só deve ser usado com a certeza da parada do processamento normal.</p>",
      

    confirm: () => {
      this.loadTela = true;
      let params: any = {
        paramsTela: {
          codEstab: obj['cod-estabel'],
          codEmitente: obj['cod-emitente'],
          nrProcess: obj['nr-process']
        },
      };

      this.srvTotvs.ReprocessarCalculo(params).subscribe({
        next: (response: any) => {
          console.log(response)
          this.srvNotification.success('Execução do cálculo realizada com sucesso ! Processo RPW: ' + response.rpw)
          this.onListar()
          this.loadTela = false;
        },
        error: (e) => {
         // this.srvNotification.error('Ocorreu um erro na requisição')
          this.loadTela = false;
        },
      });
    },
    cancel: () => this.srvNotification.error('Cancelada pelo usuário'),
  });
}

onReprocessarErros() {
  if(this.codEstabel === '') return
  
  this.srvDialog.confirm({
    title: 'REPROCESSAR PROCESSOS COM ERRO',
    message:
       "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> CONFIRMA REPROCESSAMENTO DE ERROS ?</span></div><p>O reprocessamento recriará novos pedidos de execução para os processos.</p>",
      

    confirm: () => {
      this.loadTela = true;
      let params: any = {
        paramsTela: {
          codEstab: this.codEstabel,
        },
      };

      this.srvTotvs.ReprocessarErros(params).subscribe({
        next: (response: any) => {
          console.log(response)
          this.srvNotification.success('Reprocessamento executado com sucesso !')
          this.onListar()
          this.loadTela = false;
        },
        error: (e) => {
         // this.srvNotification.error('Ocorreu um erro na requisição')
          this.loadTela = false;
        },
      });
    },
    cancel: () => this.srvNotification.error('Cancelada pelo usuário'),
  });
}


}
