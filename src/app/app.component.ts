import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { PoDividerModule, PoModule, PoTableColumn, PoTableModule, PoButtonModule, PoMenuItem, PoMenuModule, PoModalModule, PoPageModule, PoToolbarModule, PoTableAction,} from '@po-ui/ng-components';
import { ServerTotvsService } from './services/server-totvs.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoModalModule,
    PoTableModule,
    PoMenuModule,
    PoModule,
    PoDividerModule,
    PoButtonModule,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
  ],templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private srvTotvs = inject(ServerTotvsService);
  private formBuilder = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  readonly menus: Array<PoMenuItem> = [
    {
      label: 'Empréstimo',
      icon: 'bi bi-people',
      link: '/list',
      shortLabel: 'Emprestimo',
    },
    {
      label: 'Monitor Notas',
      icon: 'bi bi-display',
      link: '/monitor',
      shortLabel: 'Monitor',
    },
    {
      label: 'Relatório Movto',
      icon: 'bi bi-printer',
      link: '/relmovto',
      shortLabel: 'RelMovto',
    },
    {
      label: 'Danfe (FT0518)',
      icon: 'bi bi-printer',
      shortLabel: 'FT0518',
      action: () => this.AbrirProgramaTotvs('ftp/ft0518.w'),
    },
  ];

  //Variaveis 
  loadTela: boolean = false
  tituloTela!:string
  //lista: any;
  tipoAcao:string=''

  //---Grid
  opcoes!: PoTableAction[]
  colunas!: PoTableColumn[]
  lista!: any[]

  tecnicoInfo!: string;
  tecnicoInfoOut!: string;
  estabInfo!: string;
  processoInfo!: string;
  processoSituacao!: string;
  dashboard: boolean = false;
  abrirMenu: boolean = false;
  abrirSeletor: boolean = false;

  private sub!: Subscription;
  
  private onClick() {
    alert('Clicked in menu item');
  }

  AbrirProgramaTotvs(programa: string) {
    let params: any = { program: programa, params: '' };
    this.srvTotvs.AbrirProgramaTotvs(params).subscribe({
      next: (response: any) => {},
      error: (e) => {},
    });
  }


  ngOnInit(): void {
    
    //Colunas do grid
    this.colunas = this.srvTotvs.obterColunas()

    this.sub = this.srvTotvs.LerParametros().subscribe({
      next: (response: any) => {
       
        this.estabInfo = response.estabInfo ;
        this.tecnicoInfo = response.tecInfo ?? this.tecnicoInfo;
        this.tecnicoInfoOut = response.tecInfoOut ?? this.tecnicoInfoOut;
        this.processoInfo = response.processoInfo ?? this.processoInfo;
        this.processoSituacao =
          response.processoSituacao ?? this.processoSituacao;
        this.tituloTela = response.tituloTela ?? this.tituloTela;
        this.dashboard = response.dashboard ?? this.dashboard;
        this.abrirMenu = response.abrirMenu ?? true;

       
        this.cdRef.detectChanges();
      },
    });

    
    //Aplicar changes na tela
    this.cdRef.detectChanges()

  }

  

}
