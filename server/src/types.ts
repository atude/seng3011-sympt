/* eslint-disable camelcase */

export type ScrapeResults = {
  results: string[];
}

export type GenError = {
  errorNo: number;
  errorName: string;
  errorMessage: string;
}

export type URLFormattedTerms = {
  startDate: string;
  endDate: string;
  location: string;
  keyTerms?: string[];
  count?: number;
  page?: number;
}

export type PageObject = {
  id: string | null;
  url?: string;
  date_of_publication?: string;
  headline?: string;
  main_text?: string;
  reports?: Report[];
}

export type Report = {
  diseases?: string[];
  syndromes?: string[];
  event_date?: string;
  locations?: Location[];
}

export type Location = {
  country: string;
  location?: string;
  geonameId?: number;
  subArea: string | null;
}

export type ApiLog = {
  timestamp: string;
  success: boolean;
  query: string;
  error: GenError | null;
}

export type ApiUser = {
  authenticated: boolean;
  email: string;
}
