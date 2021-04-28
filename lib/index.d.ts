declare module 'freee-logger' {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export type Logger = {
    debug(message: any, ...args: any[]): void;

    info(message: any, ...args: any[]): void;

    warn(message: any, ...args: any[]): void;

    error(message: any, ...args: any[]): void;

    fatal(message: any, ...args: any[]): void;
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  export function getLogger(
    category: string,
    maskingFields?: string[],
    maxDepth?: number
  ): Logger;
}
