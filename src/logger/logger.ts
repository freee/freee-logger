// import { config } from 'firebase-functions'
import * as log4js from 'log4js';
import * as maskdata from 'maskdata';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Logger = {
  debug(message: any, ...args: any[]): void;

  info(message: any, ...args: any[]): void;

  warn(message: any, ...args: any[]): void;

  error(message: any, ...args: any[]): void;

  fatal(message: any, ...args: any[]): void;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const DEFAULT_MASKING_FIELDS = [
  'RAW_POST_DATA',
  'password',
  'card_number',
  'cvc',
  'my_number',
  'token',
  'secret',
  'Authorization',
  'payee_code',
  'email',
  'phone',
  'street_name',
  'contact_name',
  'first_name',
  'last_name',
  'given_name',
  'family_name',
  'display_name',
  'transfer_name',
  'expire_month',
  'expire_year',
  'wallet_keys',
  'wallet_login_key',
  'wallet_login_secrets',
  'question',
  'answer',
  'approvalcode',
  'approval_code',
  'identificationnumber',
  'identification_number',
  'application_uid',
  'application_secret',
  'credentials',
  'common_key',
  'nonce',
  'certificate',
  'passphrase',
  'crt_file',
  'crt_pass',
  'amount',
  'balance',
  'Signature',
  'AccessKey',
  'assertion',
  'accessToken',
  'refreshToken'
];

const DEFAULT_MAX_DEPTH = 5;

const nodeEnv = process.env.NODE_ENV;

/* eslint-disable @typescript-eslint/no-explicit-any */
function maskingAppender(layout: any, log4jsConfig: any) {
  return (loggingEvent: log4js.LoggingEvent) => {
    const {
      data,
      level,
      context: { maskingFields, maxDepth }
    } = loggingEvent;

    const masking = (value: any, depth: number) => {
      if (depth > maxDepth) return 'too deep';

      let maskedValue = value;
      if (value && typeof value === 'object') {
        if (!value.stack) {
          try {
            maskedValue = maskdata.maskJSONFields(value, {
              maskWith: '*',
              fields: maskingFields
            });
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        Object.keys(maskedValue).forEach((key) => {
          if (!maskedValue[key]) return;

          maskedValue[key] = masking(maskedValue[key], depth + 1);
        });
      }
      return maskedValue;
    };

    const errors: Error[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        if (data[i] instanceof Error && data[i].toString) {
          const obj: { [key: string]: any } = {};
          Object.keys(data[i]).forEach((key) => {
            if (typeof data[i][key] === 'object') {
              data[i][key] = masking(data[i][key], 0);
              obj[key] = data[i][key];
            }
          });
          if (data[i].stack) errors.push(data[i]);
          data[i] = `"${data[i].toString().replace(/\n/g, '\\n')}"`;
          if (Object.keys(obj).length) {
            try {
              data[i] += ` ${JSON.stringify(obj)}`;
            } catch (e) {} // eslint-disable-line no-empty
          }
        } else if (typeof data[i] === 'object') {
          data[i] = masking(data[i], 0);
          try {
            data[i] = JSON.stringify(data[i]);
          } catch (e) {} // eslint-disable-line no-empty
        } else if (typeof data[i] === 'string' && data[i].includes('\n')) {
          data[i] = data[i].replace(/\n/g, '\\n');
        }
      }
    }
    /* eslint-disable no-console */
    if (['WARN', 'ERROR', 'FATAL'].includes(level.levelStr)) {
      console.error(layout(loggingEvent, log4jsConfig.timezoneOffset));
    } else {
      console.info(layout(loggingEvent, log4jsConfig.timezoneOffset));
    }
    errors.forEach((err) => {
      const error = new Error(err.message);
      error.stack = err.stack;
      console.error(error);
    });
    /* eslint-enable no-console */
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// @see https://github.com/log4js-node/log4js-node/blob/master/docs/appenders.md#advanced-configuration
const maskingAppenderModule = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  configure: (
    log4jsConfig: any,
    layouts: any,
    findAppender: any, // eslint-disable-line @typescript-eslint/no-unused-vars
    levels: any // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const layout =
      nodeEnv === 'development'
        ? layouts.colouredLayout
        : (loggingEvent: log4js.LoggingEvent) =>
            `${loggingEvent.categoryName} - ${layouts.messagePassThroughLayout(
              loggingEvent
            )}`;
    return maskingAppender(layout, log4jsConfig);
  }
};

log4js.configure({
  appenders: {
    masking: { type: maskingAppenderModule }
  },
  categories: {
    default: { appenders: ['masking'], level: 'ALL' }
  }
});

class MaskingLogger {
  logger: log4js.Logger;
  maskingFields: string[];

  constructor(category: string, maskingFields: string[], maxDepth: number) {
    this.logger = log4js.getLogger(category);
    this.maskingFields = maskingFields;
    this.logger.addContext('maskingFields', maskingFields);
    this.logger.addContext('maxDepth', maxDepth);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  debug(message: any, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  info(message: any, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  warn(message: any, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  error(message: any, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  fatal(message: any, ...args: any[]) {
    this.logger.fatal(message, ...args);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const getLogger = (
  category: string,
  maskingFields?: string[],
  maxDepth?: number
): Logger => {
  return new MaskingLogger(
    category,
    maskingFields || DEFAULT_MASKING_FIELDS,
    maxDepth || DEFAULT_MAX_DEPTH
  );
};
