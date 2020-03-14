/* eslint-disable camelcase */

export type ScrapeResults = {
  results?: string[];
  error?: {
    errorNo: number;
    errorName: string;
    errorMessage: string;
  };
}

export type PageObject = {
  id: string | null
  url?: string,
  date_of_publication?: string,
  headline?: string,
  main_text?: string,
  reports?: Report,
}

export type Report = {
  diseases?: string[],
  syndromes?: string[],
  event_date?: string,
  locations?: Location[]
}

export type Location = {
  country: string,
  location: string
}
