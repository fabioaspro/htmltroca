import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl} from '@angular/forms';
import { PoModule, PoTableColumn, PoTableModule, PoButtonModule, PoMenuItem, PoMenuModule, PoModalModule, PoPageModule, PoToolbarModule, PoTableAction, PoModalAction, PoDialogService, PoNotificationService, PoFieldModule, PoDividerModule, PoTableLiterals, PoTableComponent, PoModalComponent,} from '@po-ui/ng-components';
import { ServerTotvsService } from '../services/server-totvs.service';
import { ExcelService } from '../services/excel-service.service';
import { escape } from 'querystring';
import { environment } from '../environments/environment'


@Component({
  selector: 'app-relmovto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
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
  templateUrl: './relmovto.component.html',
  styleUrl: './relmovto.component.css'
})
export class RelmovtoComponent {

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

  dtIni: string = <any>new Date();
  dtFim: string = <any>new Date();
  tecIni:string='0'
  tecFim:string='999999'
  tecDestIni:string='0'
  tecDestFim:string='999999'
  itCodigoIni:string=''
  itCodigoFim:string='ZZZZZZZZZZZZZZZZ'
  estabIni:string=''
  estabFim:string='ZZZ'


  alturaGrid:number=window.innerHeight - 250
  
  //---Grid
  colunas!: PoTableColumn[]
  lista!: any[]
  listaDados!:any[]
  loadTela:boolean=false


  ngOnInit(): void {

    //Colunas grids
    this.colunas = this.srvTotvs.obterColunasRelatorio();

    this.srvTotvs.EmitirParametros({ tituloTela: 'EMPRÉSTIMOS - RELATÓRIO MOVIMENTAÇÕES'});
  }

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

}
