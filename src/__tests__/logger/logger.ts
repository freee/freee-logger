import { getLogger } from '../../logger/logger';

describe('Logger', () => {
  const mockedConsoleInfo = jest
    .spyOn(console, 'info')
    .mockImplementation((log) => log);

  const mockedConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation((log) => log);

  afterEach(() => {
    mockedConsoleInfo.mockClear();
    mockedConsoleError.mockClear();
  });

  afterAll(() => {
    mockedConsoleInfo.mockRestore();
    mockedConsoleError.mockRestore();
  });

  it('debug', () => {
    const logger = getLogger('debug');
    const loggingValue = 'debug output';
    logger.debug(loggingValue);

    expect(mockedConsoleInfo).toBeCalled();
    expect(mockedConsoleInfo.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });

  it('info', () => {
    const logger = getLogger('info');
    const loggingValue = 'info output';
    logger.info(loggingValue);

    expect(mockedConsoleInfo).toBeCalled();
    expect(mockedConsoleInfo.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });

  it('warn', () => {
    const logger = getLogger('warn');
    const loggingValue = 'warn output';
    logger.warn(loggingValue);

    expect(mockedConsoleError).toBeCalled();
    expect(mockedConsoleError.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });

  it('error', () => {
    const logger = getLogger('error');
    const loggingValue = 'error output';
    logger.error(loggingValue);

    expect(mockedConsoleError).toBeCalled();
    expect(mockedConsoleError.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });

  it('fatal', () => {
    const logger = getLogger('fatal');
    const loggingValue = 'fatal output';
    logger.fatal(loggingValue);

    expect(mockedConsoleError).toBeCalled();
    expect(mockedConsoleError.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });

  it('masking', () => {
    const logger = getLogger('masking');
    const maskingData = {
      password: 'pass',
      test_1: { accessToken: 'test' },
      test2_1: { test2_2: { card_number: 'card_number' } },
      test3_1: {
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
    const loggingValue =
      '{"password":"pass","test_1":{"accessToken":"test"},"test2_1":{"test2_2":{"card_number":"card_number"}},"test3_1":{"test3_2":{"payee_code":"payee_code","test3_3":{"street_name":"street_name","test3_4":{"AccessKey":"AccessKey","test3_5":{"first_name":"too deep","test3_6":"too deep"}}}}},"test.test":"test.test"}';
    logger.debug(maskingData);

    expect(mockedConsoleInfo).toBeCalled();
    expect(mockedConsoleInfo.mock.results[0].value).toEqual(
      expect.stringContaining(loggingValue)
    );
  });
});
