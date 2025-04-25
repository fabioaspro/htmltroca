import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { PoModule, PoTableColumn, PoTableModule, PoButtonModule, PoMenuItem, PoMenuModule, PoModalModule, PoPageModule, PoToolbarModule, PoTableAction, PoModalAction, PoDialogService, PoNotificationService, PoFieldModule, PoDividerModule, PoTableLiterals, PoTableComponent, PoModalComponent,} from '@po-ui/ng-components';
import { ServerTotvsService } from '../services/server-totvs.service';
import { ExcelService } from '../services/excel-service.service';
import { escape } from 'querystring';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PoModalModule,
    PoTableModule,
    PoModule,
    PoFieldModule,
    PoDividerModule,
    PoButtonModule,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
  
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  @ViewChild('grid2', { static: true }) grid2: PoTableComponent | undefined;
  @ViewChild('telaTroca', { static: true }) telaTroca:  | PoModalComponent  | undefined;


  private srvTotvs = inject(ServerTotvsService);
  private srvDialog = inject(PoDialogService);
  private srvNotification = inject(PoNotificationService);
  private router = inject(Router)
  private formB = inject(FormBuilder);

  //Variaveis 
  labelLoadTela:string = ''
  loadTecnico:string=''
  loadTela: boolean = false
  loadExcel:boolean = false
  tituloTela!:string
  mudaCampos!:number | null
  pesquisa!:string
  nomeBotao: any;
  lBotao:boolean = false
  objSelecionado:any
  temTroca:boolean=false

  //lista: any;
  tipoAcao:string=''
  qtEmprestimos:number=0
  qtTotal:number=0
  alturaGrid:number=window.innerHeight - 355
  
  //---Grid
  colunas!: PoTableColumn[]
  lista!: any[]
  listaDados!:any[]
  listaEstabelecimentos!:any[]
  listaTecnicos!:any[]
   customLiterals: PoTableLiterals = {
    noData: 'Infome os filtros para Buscar os Dados'
  };
  
    codEstabel!: string
    codTecnicoOri!: string
    codTecnicoDest!:string

    public formTroca = this.formB.group({
      "qt-troca": [0, Validators.required],
      
    });


    readonly acaoAlterarOrdem: PoModalAction = {
      label: 'Salvar',
      action: () => {
        this.alterarOrdem()
      },
     
      disabled: !this.formTroca.valid,
    };
  
    readonly acaoCancelarOrdem: PoModalAction = {
      label: 'Cancelar',
      action: () => {
        this.telaTroca?.close();
      },
    };

  ngOnInit(): void {

    this.srvTotvs.EmitirParametros({ tituloTela: 'EMPRÉSTIMOS - MOVIMENTAÇÃO'});

    this.loadTela=true
    this.colunas = this.srvTotvs.obterColunas()
    
    //Carregar combo de estabelecimentos
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        this.listaEstabelecimentos = (response as any[]).sort(this.srvTotvs.ordenarCampos(['label']))
        this.loadTela=false
      },
      error: (e) => {this.loadTela=false},
    });

    
  }

  onEstabChange(obj: string) {
    
    //Limpar listas

    if (obj === undefined) return;

    //Popular o Combo do Emitente
   
    this.listaDados = [];
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`;

    //Chamar servico
    this.srvTotvs.ObterEmitentesDoEstabelecimento(obj).subscribe({
      next: (response: any) => {
        this.listaTecnicos = response;
        this.loadTecnico = 'Selecione o técnico';
      },
      //error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
    });
  }

  onSelecionar(){
    this.loadTela=true
    let param:any={codEstabel:this.codEstabel, codTecnico:this.codTecnicoOri}
    
    //Chamar servico
    this.srvTotvs.ObterSaldoTerceiro(param).subscribe({
      next: (response: any) => {
        if (response === null){
          this.listaDados=[]
          this.srvDialog.alert({
            title: 'ATENÇÃO ! VERIFIQUE O MONITOR DE NOTAS FISCAIS !',
            message: 'PARA REALIZAR UM NOVO EMPRÉSTIMO UTILIZANDO ESTE TÉCNICO, AGUARDE A CONCLUSÃO DO PROCESSO ANTERIOR ! ',
            ok: () => (true)
          });
        }
        else
        {
          this.listaDados = response.items.sort(this.srvTotvs.ordenarCampos(['nro-docto', 'it-codigo']))
          this.listaDados.forEach(o=> this.qtTotal += o['qt-nota'])
        }
        this.loadTela=false
      },
      error: (e) => { this.loadTela=false},
    });

  }

  onExecutar(){
    if (this.codEstabel === undefined) return
    if (this.codTecnicoOri === undefined) return

    if (this.codTecnicoDest === undefined){
      this.srvNotification.error('Selecione o técnico de destino !')
      return
    } 

    if (!this.temTroca) {
      this.srvNotification.error('Selecione ao menos um item para a troca !')
      return
    }

    if (this.codTecnicoOri === this.codTecnicoDest){
      this.srvNotification.error('Técnicos de Origem e Destino devem ser diferentes !')
      return
    }

    //Obter o nome do tecnico
    let nomeTecnico = this.listaTecnicos.filter(item=> item.value === this.codTecnicoDest)[0].label

    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: `<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> DESEJA REALIZAR O EMPRÉSTIMO AO TÉCNICO <b>${nomeTecnico}</b> ?</span></div>`,
      
      literals: { cancel: 'Não', confirm: 'Sim' },
      confirm: () => {
        this.loadTela = true;
        let params: any = { cabec:{"cod-estabel": this.codEstabel, "cod-tec-ori":this.codTecnicoOri, "cod-tec-dest": this.codTecnicoDest}, items: this.listaDados.filter(o=>o['qt-troca']!==null)};
         this.srvTotvs.ExecutarEmprestimo(params).subscribe({
          next: (response: any) => {
            this.loadTela = false
            this.srvNotification.success('Execução do empréstimo realizada com sucesso ! Processo RPW: ' + response.rpw)
            this.temTroca = false
            this.onSelecionar()
          },
          error: (e) => {
            this.loadTela = false;
          },
        }); 
      },
      cancel: () => {},
    });

  }

  onSolicitarQuantidade(obj:any){
    this.objSelecionado = obj
    this.telaTroca?.open()
  }

  onCancelarQuantidade(obj:any){
    this.objSelecionado = obj
    this.formTroca.controls['qt-troca'].setValue(0)
    this.alterarOrdem()
  }

  alterarOrdem(){
   // console.log(Number(this.formTroca.controls['qt-troca'].value) )
  //  console.log()
    if (Number(this.formTroca.controls['qt-troca'].value) > this.objSelecionado['qt-nota']){
      this.srvNotification.error('Empréstimo deve ser menor que quantidade da nota fiscal !')
      return
    }
    this.temTroca=false
    let registro = {...this.objSelecionado, "qt-troca": Number(this.formTroca.controls['qt-troca'].value)}
    this.grid2?.updateItem(this.objSelecionado, registro)
    this.listaDados = (this.grid2?.items as any[])

    //Entrada com quantidade 0
    if (Number(this.formTroca.controls['qt-troca'].value) === 0){
      let trocaNota = this.listaDados.filter(o => o['nro-docto'] === this.objSelecionado['nro-docto'] && o['qt-troca'] > 0).length > 0

      if(!trocaNota){
            this.listaDados.forEach(o => {
              if (o["nro-docto"] === this.objSelecionado["nro-docto"]){
              o["qt-troca"] = null
              }
          })
        }
    }

    //Verificar se existe troca para mostrar o selecao de emitente de destino
    if (Number(this.formTroca.controls['qt-troca'].value) > 0){
      this.listaDados.forEach(o => {
        if (o["nro-docto"] === this.objSelecionado["nro-docto"] && o["qt-troca"] === null)
          o["qt-troca"] = 0
        
      })
    }

    //Verifica se existe alguma troca
    this.temTroca = false
    this.qtEmprestimos = 0
    this.listaDados.forEach(o => {
      if (o['qt-troca'] > 0){
        this.temTroca = true
        this.qtEmprestimos += o['qt-troca']
      }
    })

    this.telaTroca?.close()
  }
  //ElementRef.document.getElementsByClassName('po-table-row') cellChecked.setAttribute("ng-reflect-disabled","true"); cellChecked.setAttribute("ng-reflect-checkbox-value","false");
}

  
    

  