// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
<<<<<<< HEAD
  totvs_url: 'https://hawebdev.dieboldnixdorf.com.br:8543/api/integracao/troca/v1/apiesaatroca', //desenv
=======
  //totvs_url: 'https://hawebdev.dieboldnixdorf.com.br:8543/api/integracao/troca/v1/apiesaatroca', //desenv
  totvs_url:       'https://hawebdev.dieboldnixdorf.com.br:8543/api/integracao/troca/v1/apiesaatroca', //projetos
  totvs_url_geral: 'https://hawebdev.dieboldnixdorf.com.br:8543/api/integracao/utils/v1/apiDnGeral',
>>>>>>> 62d2cd3 (Backup13032026)
  totvs_header:{
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa("super:prodiebold11"),
    'CompanyId': 1
  },
  
  totvs_spool: 'http://10.151.120.56/SPOOL/',
<<<<<<< HEAD
  versao: 1.0
=======
 versao:'1.00.000'
>>>>>>> 62d2cd3 (Backup13032026)
};

