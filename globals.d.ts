declare module '@fingerprintjs/fingerprintjs' {
  export interface FingerprintResult {
    visitorId: string;
  }

  export interface FingerprintAgent {
    get(): Promise<FingerprintResult>;
  }

  const FingerprintJS: {
    load(): Promise<FingerprintAgent>;
  };

  export default FingerprintJS;
}
