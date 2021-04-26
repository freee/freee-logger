# 会計freee logger

出力をマスキングするためのloggerです。

## できること

- 下記のメソッドを提供します。
  - debug
  - info
  - warn
  - error
  - fatal
- 下記キーワードがloggerの引数に含まれる時はマスキングします。
  - RAW_POST_DATA
  - password
  - card_number
  - cvc
  - my_number
  - token
  - secret
  - Authorization
  - payee_code
  - email
  - phone
  - street_name
  - contact_name
  - first_name
  - last_name
  - given_name
  - family_name
  - display_name
  - transfer_name
  - expire_month
  - expire_year
  - wallet_keys
  - wallet_login_key
  - wallet_login_secrets
  - question
  - answer
  - approvalcode
  - approval_code
  - identificationnumber
  - identification_number
  - application_uid
  - application_secret
  - credentials
  - common_key
  - nonce
  - certificate
  - passphrase
  - crt_file
  - crt_pass
  - amount
  - balance
  - Signature
  - AccessKey
  - assertion
  - accessToken
  - refreshToken

## できないこと
- コンソール以外へのログ出力

## このloggerについて

本 loggerは、β版のステータスとなっており、制限およびバグがある可能性があります。また、このステータスの記載が更新されるまでは、インターフェイスに変更が入る可能性がありますので、ご利用の際はご留意ください。


本 logger を利用する前に下記をご確認ください。

- node上で動作すること


### インストール

該当のプロジェクトディレクトリで以下のコマンドを実行してください。

`npm install freee-logger`

### 開発

- リリースファイル作成時
  - lib/index.d.ts, lib/index.js, lib/index.js.mapが更新されます。

```

npm run build

```

- ローカルでの修正、動作確認時

```
npm run build

```


- eslintチェック

```
npm run lint

```

- eslint fix
  - 自動修正可能なファイルは修正されます。

```
npm run lint_fix

```


### サンプル


- デフォルトログ出力

```
const logger = getLogger('logger');
const maskingData = {
  password: 'pass',
  test_1: { accessToken: 'test' },
  test2_1: { test2_2: { card_number: 'card_number' } },
  test3_1: {
    common_key: 'common_key',
    test3_2: {
      payee_code: 'payee_code',
      test3_3: {
        street_name: 'street_name',
        test3_4: {
          AccessKey: 'AccessKey', // eslint-disable-line @typescript-eslint/naming-convention
          test3_5: {
            first_name: 'first_name',
            test3_6: {
              last_name: 'last_name',
              test3_7: {
                expire_year: 'expire_year'
              }
            }
          }
        }
      }
    }
  },
  'test.test': 'test.test'
};
logger.debug(maskingData);


# キーワードがマスキングされて出力されます。
[2021-04-26T15:36:33.098] [DEBUG] logger - {"password":"****","test_1":{"accessToken":"****"},"test2_1":{"test2_2":{"card_number":"***********"}},"test3_1":{"common_key":"**********","test3_2":{"payee_code":"**********","test3_3":{"street_name":"***********","test3_4":{"AccessKey":"*********","test3_5":{"first_name":"too deep","test3_6":"too deep"}}}}},"test.test":"test.test"}

```

- マスキングキーワードを変更して、ログ出力
  - 下記ではキーワードを```test2_1```, ```test.test```のみに変更しています。

```
const maskingFields = ['test2_1', 'test.test'];
const logger = getLogger('masking', maskingFields);
const maskingData = {
  password: 'pass',
  test_1: { accessToken: 'test' },
  test2_1: { test2_2: { card_number: 'card_number' } },
  test3_1: {
    common_key: 'common_key',
    test3_2: {
      payee_code: 'payee_code',
      test3_3: {
        street_name: 'street_name',
        test3_4: {
          AccessKey: 'AccessKey', // eslint-disable-line @typescript-eslint/naming-convention
          test3_5: {
            first_name: 'first_name',
            test3_6: {
              last_name: 'last_name',
              test3_7: {
                expire_year: 'expire_year'
              }
            }
          }
        }
      }
    }
  },
  'test.test': 'test.test'
};
logger.debug(maskingData);


# 指定したキーワードがマスキングされて出力されます。
[2021-04-26T15:31:19.035] [DEBUG] masking - {"password":"pass","test_1":{"accessToken":"test"},"test2_1":"***************","test3_1":{"common_key":"common_key","test3_2":{"payee_code":"payee_code","test3_3":{"street_name":"street_name","test3_4":{"AccessKey":"AccessKey","test3_5":{"first_name":"too deep","test3_6":"too deep"}}}}},"test.test":"*********"}


```


- マスキングの深さ(デフォルト5)を変更
  - getLoggerの第３引数に深さを指定できます。
  - 第３引数のマスキングキーワードをデフォルトのままにする場合はundefinedを指定します。

```
const maxDepth = 6;
const logger = getLogger('masking', undefined, maxDepth);
const maskingData = {
  password: 'pass',
  test_1: { accessToken: 'test' },
  test2_1: { test2_2: { card_number: 'card_number' } },
  test3_1: {
    common_key: 'common_key',
    test3_2: {
      payee_code: 'payee_code',
      test3_3: {
        street_name: 'street_name',
        test3_4: {
          AccessKey: 'AccessKey', // eslint-disable-line @typescript-eslint/naming-convention
          test3_5: {
            first_name: 'first_name',
            test3_6: {
              last_name: 'last_name',
              test3_7: {
                expire_year: 'expire_year'
              }
            }
          }
        }
      }
    }
  },
  'test.test': 'test.test'
};
logger.debug(maskingData);


# 指定した改装までマスキングされ、以降は切り落とされます。
[2021-04-26T15:28:42.563] [DEBUG] masking - {"password":"****","test_1":{"accessToken":"****"},"test2_1":{"test2_2":{"card_number":"***********"}},"test3_1":{"common_key":"**********","test3_2":{"payee_code":"**********","test3_3":{"street_name":"***********","test3_4":{"AccessKey":"*********","test3_5":{"first_name":"**********","test3_6":{"last_name":"too deep","test3_7":"too deep"}}}}}},"test.test":"test.test"}

```


## ライセンス

ライセンスについては下記をご参照ください。

[MIT License](./LICENSE)
