import FingerprintJS from '@fingerprintjs/fingerprintjs';

class FingerprintService {
    private _cached?: string;
  
    async get(): Promise<string> {
      if (this._cached) return this._cached;
      const fpAgent = await FingerprintJS.load();
      const result = await fpAgent.get();
      this._cached = result.visitorId as string;
      return this._cached;
    }
  }
  
  
  export const fingerprintService = new FingerprintService();
  