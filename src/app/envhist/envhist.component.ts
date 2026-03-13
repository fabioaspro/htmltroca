
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl} from '@angular/forms';
import { ServerTotvsService } from '../services/server-totvs.service';
import { ExcelService } from '../services/excel-service.service';
import { escape } from 'querystring';
import { environment } from '../environments/environment'
import { PoButtonModule, PoChartModule, PoDividerModule, PoFieldModule, PoMenuModule, PoModalAction, PoModalComponent, PoModalModule, PoModule, PoNotificationService, PoPageModule, PoProgressModule, PoTableColumn, PoTableModule, PoToolbarModule } from '@po-ui/ng-components';


@Component({
  selector: 'app-envhist',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PoModule,
    PoPageModule,
    PoButtonModule,
    PoFieldModule,
    PoModalModule,
    PoTableModule,
    PoDividerModule,
    PoToolbarModule,
    PoMenuModule,
    PoProgressModule,
    PoChartModule,
  ],
  templateUrl: './envhist.component.html',
  styleUrl: './envhist.component.css'
})
export class EnvhistComponent {

  @ViewChild('formSelecao', { static: true }) formSelecao!: UntypedFormControl;
  @ViewChild('telaSelecao', { static: true }) telaSelecao:  | PoModalComponent  | undefined;

  private srvTotvs = inject(ServerTotvsService)
  private srvExcel = inject(ExcelService)
  private srvNotification = inject(PoNotificationService);
  private router = inject(Router)


  readonly acaoSelecionar: PoModalAction = {
    label: 'Salvar',
    action: () => {
      this.telaSelecao?.close();
    },
  };

  readonly acaoCancelarSelecao: PoModalAction = {
    label: 'Cancelar',
    action: () => {
      this.telaSelecao?.close();
    },
  };

  //---Progress
  percEnvioHist     = 0
  totalRegistros    = 50
  registrosEnviados = 0
  HistQtdReg        = 0
  status: string    = ''

  //---Variáveis de Grupo
  codGrupo: string = ''

  buttonDisabled: any
  dtCorte: string | Date = <any>new Date();
  
  alturaStepperSel:number=window.innerHeight - 570

  loadTela:boolean=false
  labelLoadTela: string = ''
  lDisabled:boolean=true
  versao:string = ''
  ngOnInit(): void {

    this.versao = environment.versao
    this.loadTela = true
    this.labelLoadTela = "Carregando Parâmetros"
    this.srvTotvs.EmitirParametros({ tituloTela: this.versao + ' - EMPRÉSTIMOS - ENVIO DE DADOS PARA HISTÓRICO'})

    this.srvTotvs.ObterCadastroHist({tabela: 'codGrupo', codigo: 'paramTROCA', item: 'HistCodGrupo'}).subscribe({
        next: (response: any) => {
          this.codGrupo = response.desc
          
          if (response.peri) {
            this.dtCorte = this.converterStringParaData(response.peri);

            if (this.dtCorte) {
              this.lDisabled = true;
            }
          } else {
            this.lDisabled = false;
          }

          this.HistQtdReg = response.qtdreg
          this.status     = response.status

          if(this.codGrupo === "YES"){
            //Executa a tela
            
            if (!(this.dtCorte instanceof Date) || isNaN(this.dtCorte.getTime())) {
              if (this.status === "enviar"){ this.lDisabled = false}
              else {this.lDisabled = true}
            }

              if (this.status === "enviar"){ this.lDisabled = false}
              else {this.lDisabled = true}

           }
          else{
            
            //Não tem acesso a tela
            this.srvNotification.error('Usuário sem acesso a essa funcionalidade')
            this.router.navigate(['list']) //Volta a lista inicial

          }

        },
        error: (e) => {
          
          this.router.navigate(['list']) //Volta a lista inicial
  
        },
        complete: ()=> {this.loadTela = false}
    })

  }

  //---Atualiza dados de Envio para Histórico
  ngOnAttEnvHist(){

    this.srvTotvs.onAttEnvHist({tabela: 'pr-troca', dataini: '', datafim: '17/01/2025'}).subscribe({
        next: (response: any) => {
          this.registrosEnviados = this.totalRegistros - response.qtdEnv
          this.percEnvioHist = Math.floor((this.registrosEnviados / this.totalRegistros) * 100);

        },
        error: (e) => {
          this.loadTela = false
        },
      
    })

  }

//--- Converte String para Data  
converterStringParaData(dataStr: string): Date {
  const dia = parseInt(dataStr.substring(0, 2), 10);
  const mes = parseInt(dataStr.substring(2, 4), 10) - 1; // mês começa do zero
  const ano = parseInt(dataStr.substring(4, 8), 10);
  return new Date(ano, mes, dia);
}

  atualizarDadosEnviados(): void {

    this.percEnvioHist = 0
    this.loadTela = true

    // Aqui você pode chamar o serviço que atualiza os dados enviados
    let paramsTela: any = { paramsTela: this.formSelecao.value }
    this.srvTotvs.onAtualizaDadosEnviados(paramsTela).subscribe({
      next:(response:any)=>{
        this.loadTela=false
        this.srvNotification.success('Agendamento realizado com sucesso ! Processo RPW: ' + response.rpw)
      },
      complete: ()=> {this.loadTela=false}
    })
    this.percEnvioHist = 90
    this.loadTela      = false
  }


  SelecionarRPW(){
    this.loadTela=true
    let paramsTela: any = { paramsTela: this.formSelecao.value }
    //this.srvTotvs.GerarDadosRelatorioRPW(paramsTela).subscribe({
    //  next:(response:any)=>{
    //    this.loadTela=false
    //    this.srvNotification.success('Agendamento realizado com sucesso ! Processo RPW: ' + response.rpw)
    //  },
    //  complete: ()=> {this.loadTela=false}
    //})
    this.loadTela=false

  }


  //--Não usa
  /*
  Detalhe(obj:any){

    this.srvTotvs.SetarUsuario(obj["cod-estabel"], obj["cod-emit-ori"], obj["nr-process"])
    this.router.navigate(['dashboard'])

  }

  Selecionar(){
    this.loadTela=true
    let paramsTela: any = { paramsTela: this.formSelecao.value }

    this.srvTotvs.ObterDadosRelatorio(paramsTela).subscribe({
      next:(response:any)=>{
        if (response === null){
          this.lista=[]
          this.srvNotification.warning("Não existe dados para o range de seleção !")
          return
        }
        this.lista = response.items;
        this.loadTela=false
    },
      complete: ()=> {this.loadTela=false}
    })

  }


  GerarExcel(){

    this.srvExcel.exportarParaExcel('LISTA DE EMPRÉSTIMOS',
                                    'Relatório Detalhado de Empréstimos',
                                    this.colunas,
                                    this.lista,
                                    'Emprestimos',
                                    'Dados')

  }
  */

}
