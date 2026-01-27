export interface ClientData {
  fingerprint: string;
  ip: string;
  user_agent: string;
  ip_data: IpData;
}

export interface IpData {
  City: City;
  Postal: Postal;
  Continent: Continent;
  Subdivisions: Subdivisions;
  RepresentedCountry: RepresentedCountry;
  Country: Country;
  RegisteredCountry: RegisteredCountry;
  Location: Location;
  Traits: Traits;
}

export interface Subdivisions {
  Names: Names;
  IsoCode: string;
  GeoNameID: number;
}

export interface City {
  Names: Names;
  GeoNameID: number;
}

export interface Postal {
  Code: string;
}

export interface Continent {
  Names: Names;
  Code: string;
  GeoNameID: number;
}

export interface Names {
  de: string;
  en: string;
  es: string;
  fr: string;
  ja: string;
  'pt-BR': string;
  ru: string;
  'zh-CN': string;
}

export interface RepresentedCountry {
  Names: Names;
  IsoCode: string;
  Type: string;
  GeoNameID: number;
  IsInEuropeanUnion: boolean;
}

export interface Country {
  Names: Names;
  IsoCode: string;
  GeoNameID: number;
  IsInEuropeanUnion: boolean;
}

export interface RegisteredCountry {
  Names: Names;
  IsoCode: string;
  GeoNameID: number;
  IsInEuropeanUnion: boolean;
}

export interface Location {
  TimeZone: string;
  Latitude: number;
  Longitude: number;
  MetroCode: number;
  AccuracyRadius: number;
}

export interface Traits {
  IsAnonymousProxy: boolean;
  IsAnycast: boolean;
  IsSatelliteProvider: boolean;
}
