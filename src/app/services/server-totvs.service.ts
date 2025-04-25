import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, of, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../environments/environment'
import { IMonitor } from './imonitor';
import { Usuario } from '../interfaces/usuario';
import { Monitor } from '../interfaces/monitor';

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)

@Injectable({
  providedIn: 'root'
})
export class ServerTotvsService {
  private reg!:any;
  _url = environment.totvs_url;
  usuarioSelecionado: WritableSignal<Usuario> = signal({
    codUsuario: '',
    codEstabelecimento: '',
    nrProcesso: '',
  });

  constructor(private http: HttpClient ) { }

  public UsuarioLogado!: Usuario;
  public monitorLogado!: IMonitor | undefined;

  //---------------------- Variaveis Globais
  public ObterVariaveisGlobais(params?: any){
    return this.http.get(`${this._url}/ObterVariaveisGlobais`, {params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public ObterUsuario(): Observable<Usuario> {
    return of(this.UsuarioLogado).pipe(take(1));
  }

  public SetarUsuario(estab: string, usuario: string, processo: string) {
    this.UsuarioLogado = {
      codEstabelecimento: estab,
      codUsuario: usuario,
      nrProcesso: processo,
    };
  }

  public SetarMonitor(monitor?: Monitor) {
    this.monitorLogado = monitor ?? undefined;
  }

  //Chama tela do TOTVS
  public AbrirTelaTOTVS(params?:any){
    return this.http.get('/totvs-menu/rest/exec', { params, headers: headersTotvs }).pipe(take(1));
  }

  obterColunasItensNota():Array<PoTableColumn>{
    return[
    { property: 'seq', label: 'Seq' },
    { property: 'it-codigo', label: 'Item' },
    { property: 'desc-item', label: 'Descrição' },
    { property: 'qtde', label: 'Qtde' },
    { property: 'cod-depos', label: 'Depos' },
    { property: 'cod-localiz', label: 'Localiz' },
  ];
  }
  
  //------------ Colunas Grid Prioridade
  obterColunas(): Array<PoTableColumn> {
    return [
      { property: 'situacao', label:'Situação', type:'template'},
      { property: 'nro-docto',    label: "Documento", },
      { property: 'nat-operacao',     label: "Nat.Oper"},
      { property: 'it-codigo',    label: "Item"},
      { property: 'desc-item',      label: "Descrição", width:'200px'},
      { property: 'qt-troca',    label: "QtEmp", type: 'cellTemplate', format: "1.0", width:'100px'},
      { property: 'qt-nota', label: 'QtNota', type:'number', format:'1.0', width:'100px'},
      { property: 'opcao', label: 'Ação', type: 'cellTemplate' },
     
    
    ];
  }

  obterColunasMonitor(): Array<PoTableColumn> {
    return [
      {
        property: 'sit-nota',
        label: 'Situação',
        type: 'label',
        labels: [
          {
            value: 'E',
            color: 'color-09',
            label: 'Entradas',
            textColor: 'white',
          },
          {
            value: 'S',
            color: 'color-10',
            label: 'Saídas',
            textColor: 'white',
          },
          {
            value: 'X',
            color: 'color-01',
            label: 'Encerradas',
            textColor: 'white',
          }
        ],
      },
      { property: 'nr-process', label: 'Transação' },
      { property: 'cod-emit-ori', label: 'Téc.Origem' },
      { property: 'nome-abrev-ori', label: 'Nome' },
      { property: 'cod-emit-dest', label: 'Téc.Destino' },
      { property: 'nome-abrev-dest', label: 'Nome' },
      { property: 'num-ped-exec', label: 'Ped.Execução' },
      { property: 'opcoes', label: 'Ações Disponíveis', type: 'cellTemplate' },
    ];
  }

  obterColunasRelatorio(): Array<PoTableColumn> {
    return [
      { property: 'data', label: 'Data', type: 'date', format: 'dd/MM/yyyy'},
      { property: 'cod-estabel', label: 'Est' },
      { property: 'nr-process', label: 'Transação' },
      { property: 'cod-emit-ori', label: 'Téc.Origem' },
      { property: 'nome-abrev-ori', label: 'Nome' },
      { property: 'nfe', label: 'NFE' },
      { property: 'nfs', label: 'NFS' },
      { property: 'cod-emit-dest', label: 'Téc.Destino' },
      { property: 'nome-abrev-dest', label: 'Nome' },
      { property: 'it-codigo', label: 'Item' },
      { property: 'desc-item', label: 'Descrição', width:'180px' },
      { property: 'quantidade', label: 'Qtde' },
      

    ]}

  
  obterColunasEntradas(): Array<PoTableColumn> {
    return [
      {
        property: 'idi-sit',
        label: 'Sefaz',
        type: 'label',
        labels: [
          {
            value: 1,
            color: 'color-08',
            label: 'NFe não autorizada',
            textColor: 'white',
          },
          {
            value: 2,
            color: 'color-08',
            label: 'Em Processamento',
            textColor: 'white',
          },
          {
            value: 3,
            color: 'color-10',
            label: 'Autorizada',
            textColor: 'white',
          },
          {
            value: 4,
            color: 'color-07',
            label: 'Uso denegado',
            textColor: 'white',
          },
          {
            value: 5,
            color: 'color-07',
            label: 'Docto Rejeitado',
            textColor: 'white',
          },
          {
            value: 6,
            color: 'color-07',
            label: 'Docto Cancelado',
            textColor: 'white',
          },
          {
            value: 7,
            color: 'color-07',
            label: 'Docto Inutilizado',
            textColor: 'white',
          },
          {
            value: 8,
            color: 'color-08',
            label: 'Em processamento no Aplicativo de Transmissão',
            textColor: 'white',
          },
          {
            value: 9,
            color: 'color-08',
            label: 'Em processamento na SEFAZ',
            textColor: 'white',
          },
          {
            value: 10,
            color: 'color-08',
            label: 'Em processamento no SCAN',
            textColor: 'white',
          },
          {
            value: 11,
            color: 'color-10',
            label: 'NF-e Gerada',
            textColor: 'white',
          },
          {
            value: 12,
            color: 'color-08',
            label: 'NF-e em Processo de Cancelamento',
            textColor: 'white',
          },
          {
            value: 13,
            color: 'color-08',
            label: 'NF-e em Processo de Inutilizacao',
            textColor: 'white',
          },
          {
            value: 14,
            color: 'color-08',
            label: 'NF-e Pendente de Retorno',
            textColor: 'white',
          },
          {
            value: 15,
            color: 'color-07',
            label: 'DPEC recebido pelo SCE',
            textColor: 'white',
          },
          {
            value: 98,
            color: 'color-08',
            label: 'Aguard.Proc reapi0190',
            textColor: 'white',
          },
          {
            value: 99,
            color: 'color-08',
            label: 'Aguard.Proc.re1005rp',
            textColor: 'white',
          },
          {
            value: 100,
            color: 'color-10',
            label: 'Nota Atualizada Estoque',
            textColor: 'white',
          },
          {
            value: 101,
            color: 'color-07',
            label: 'Situação desconhecida',
            textColor: 'white',
          },
          {
            value: 102,
            color: 'color-07',
            label: 'ERRO verificar pendências',
            textColor: 'white',
          },
          {
            value: 103,
            color: 'color-08',
            label: 'Aguardando Reprocessamento',
            textColor: 'white',
          },
        ],
      },
      { property: 'cod-emitente', label: 'Emitente' },
      { property: 'serie-docto', label: 'Serie' },
      { property: 'nro-docto', label: 'Docto' },
      { property: 'nat-operacao', label: 'Nat.Oper' },
    ];
  }

  obterColunasSaidas(): Array<PoTableColumn> {
    return [
      {
        property: 'idi-sit',
        label: 'Sefaz',
        type: 'label',
        labels: [
          {
            value: 1,
            color: 'color-08',
            label: 'NFe não autorizada',
            textColor: 'white',
          },
          {
            value: 2,
            color: 'color-08',
            label: 'Em Processamento',
            textColor: 'white',
          },
          {
            value: 3,
            color: 'color-09',
            label: 'Autorizada',
            textColor: 'white',
          },
          {
            value: 4,
            color: 'color-07',
            label: 'Uso denegado',
            textColor: 'white',
          },
          {
            value: 5,
            color: 'color-07',
            label: 'Docto Rejeitado',
            textColor: 'white',
          },
          {
            value: 6,
            color: 'color-07',
            label: 'Docto Cancelado',
            textColor: 'white',
          },
          {
            value: 7,
            color: 'color-07',
            label: 'Docto Inutilizado',
            textColor: 'white',
          },
          {
            value: 8,
            color: 'color-08',
            label: 'Em processamento no Aplicativo de Transmissão',
            textColor: 'white',
          },
          {
            value: 9,
            color: 'color-08',
            label: 'Em processamento na SEFAZ',
            textColor: 'white',
          },
          {
            value: 10,
            color: 'color-08',
            label: 'Em processamento no SCAN',
            textColor: 'white',
          },
          {
            value: 11,
            color: 'color-10',
            label: 'NF-e Gerada',
            textColor: 'white',
          },
          {
            value: 12,
            color: 'color-08',
            label: 'NF-e em Processo de Cancelamento',
            textColor: 'white',
          },
          {
            value: 13,
            color: 'color-08',
            label: 'NF-e em Processo de Inutilizacao',
            textColor: 'white',
          },
          {
            value: 14,
            color: 'color-08',
            label: 'NF-e Pendente de Retorno',
            textColor: 'white',
          },
          {
            value: 15,
            color: 'color-07',
            label: 'DPEC recebido pelo SCE',
            textColor: 'white',
          },
          {
            value: 99,
            color: 'color-08',
            label: 'Aguardando NFE',
            textColor: 'white',
          },
          {
            value: 100,
            color: 'color-10',
            label: 'Nota Atualizada Estoque',
            textColor: 'white',
          },
          {
            value: 102,
            color: 'color-07',
            label: 'ERRO verificar pendências',
            textColor: 'white',
          },
          {
            value: 103,
            color: 'color-08',
            label: 'Aguardando Reprocessamento',
            textColor: 'white',
          },
        ],
      },
      { property: 'cod-estabel', label: 'Estab' },
      { property: 'serie', label: 'Série' },
      { property: 'nr-nota-fis', label: 'Nr Nota' },
      { property: 'nome-ab-cli', label: 'Emitente' },
      { property: 'nat-operacao', label: 'Nat.Oper' },
    ];
  }

  obterColunasErrosProcessamento(): Array<PoTableColumn> {
    return [
      { property: 'nomeArquivo', label: 'Arquivo', type: 'columnTemplate' },
      { property: 'mensagem', label: 'Mensagem' },
      {
        property: 'dataHora',
        label: 'Data',
        type: 'date',
        format: 'dd/MM/yyyy hh:mm:ss',
      },
    ];
  }

  public ObterUsuarioAmbiente() {
    return this.usuarioSelecionado;
  }


  public ObterMonitor(monitor?: IMonitor) {
    return this.monitorLogado!;
  }

  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return this.http.get<any>(`${this._url}/ObterEstab`, {params: params, headers:headersTotvs})
                 .pipe(
                  ///tap(data => {console.log("Retorno API TOTVS => ", data)}),
                  map(item => { return item.items.map((item:any) =>  { return { label:item.codEstab + ' ' + item.nome, value: item.codEstab, codFilial: item.codFilial } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  public ObterEmitentesDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterTecEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTec + ' ' + item.nomeAbrev, value: item.codTec  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  public ObterSaldoTerceiro(params?: any){
    return this.http.get(`${this._url}/ObterSaldoTerceiro`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public ExecutarEmprestimo(params?: any){
    return this.http.post(`${this._url}/ExecutarEmprestimo`, params, { headers:headersTotvs})
                   .pipe(take(1));
  }

  public ObterDadosRelatorio(params?: any){
    return this.http.post(`${this._url}/ObterDadosRelatorio`, params, { headers:headersTotvs})
                   .pipe(take(1));
  }

   //Parametros do Estabelecimento
   public ObterProcessosEstab(params?: any) {
    return this.http
      .get(`${this._url}/ObterProcessosEstab`, {
        params: params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  //---------------------- Processo
  public ObterNrProcesso(params?: any) {
    return this.http
      .get(`${this._url}/ObterNrProcesso`, { params, headers: headersTotvs })
      .pipe(take(1));
  }

  public ForcarEfetivacaoSaida(params?: any) {
    return this.http
      .get(`${this._url}/ForcarEfetivacaoSaida`, {
        params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  public ObterNotas(params?: any) {
    return this.http
      .post(`${this._url}/ObterNotas`, params, { headers: headersTotvs })
      .pipe(take(1));
  }

  public ReprocessarCalculo(params?: any) {
    return this.http
      .post(`${this._url}/ReprocessarCalculo`, params, {
        headers: headersTotvs,
      })
      .pipe(take(1));
  }
  public ObterItensNota(params?: any) {
    return this.http
      .get(`${this._url}/ObterItensNota`, {
        params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  public ReprocessarErros(params?: any) {
    return this.http
      .post(`${this._url}/ReprocessarErros`, params, { headers: headersTotvs })
      .pipe(take(1));
  }

  //--- Variavel
  private emissorEvento$ = new Subject<any>();

  //--- Emissor
  public EmitirParametros(valor: any) {
    this.emissorEvento$.next(valor);
  }

  //--- Observador
  public LerParametros() {
    return this.emissorEvento$.asObservable();
  }

  public ReenviarNotasSefaz(params?: any) {
    return this.http
      .get(`${this._url}/ReenviarNotasSefaz`, {
        params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  public ObterCadastro(params?: any){
    return this.http.get(`${this._url}/ObterCadastro`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Programas DDK
  public AbrirProgramaTotvs(params?: any) {
    return this.http
      .get('/totvs-menu/rest/exec', { params, headers: headersTotvs })
      .pipe(take(1));
  }

  
  //Ordenacao campos num array
  public ordenarCampos = (fields: any[]) =>
    (a: { [x: string]: number }, b: { [x: string]: number }) =>
      fields
        .map((o) => {
          let dir = 1;
          if (o[0] === '-') {
            dir = -1;
            o = o.substring(1);
          }
          return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
        })
        .reduce((p, n) => (p ? p : n), 0);

}
