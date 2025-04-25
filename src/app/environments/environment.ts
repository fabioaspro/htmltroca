// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  totvs_url: 'https://hawebdev.dieboldnixdorf.com.br:8543/api/integracao/troca/v1/apiesaatroca', //desenv
  totvs_header:{
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa("super:prodiebold11"),
    'CompanyId': 1
  },
  
  totvs_spool: 'http://10.151.120.56/SPOOL/',
  versao: 1.0
};

