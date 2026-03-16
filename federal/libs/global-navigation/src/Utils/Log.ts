import { getMetadata, getMiloConfig } from "../test-exports";

export type LanaSeverity = 'd' | 'debug' | 'i' | 'info' | 'w' | 'warn' | 'e' | 'error' | 'c' | 'critical';

export type LanaOptions = {
  clientId?: string;
  endpoint?: string;
  endpointStage?: string;
  errorType?: 'e' | 'i';
  sampleRate?: number;
  tags?: string;
  implicitSampleRate?: number;
  useProd?: boolean;
  isProdDomain?: boolean;
  severity?: LanaSeverity;
};

export type LanaLogOptions = LanaOptions & {
  severity?: LanaSeverity;
};

export type Lana = {
  log: (msg: string, options?: LanaLogOptions)
    => Promise<unknown> | XMLHttpRequest
  debug: boolean;
  options: LanaOptions;
  localhost?: boolean;
};

const LANA_CLIENT_ID = 'feds-milo';

export const lanaLog = (message: string, tags = 'default', errorType: 'e' | 'i' = 'e'): void => {
  const { locale } = getMiloConfig();
  const url = getMetadata('gnav-source') ?? `${locale.contentRoot?? ''}/gnav`; 
  
  if (!window.lana)
    console.warn('lana logging unavailable in the gnav');

  window?.lana?.log(`${message} | gnav-source: ${url} | href: ${window.location.href}`, {
    clientId: LANA_CLIENT_ID,
    sampleRate: 1,
    tags,
    errorType,
  });
};


