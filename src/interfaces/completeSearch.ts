// export interface StructuredFormatting {
//   main_text: string;
//   secondary_text: string;
// }
export interface StructuredFormatting {
  title: string;
  height?: number;
  main_text: string;
  secondaryText: string;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface Prediction {
  description: string;
  matched_substrings: any[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: any[];
  has_children: boolean;
  display_type: string;
  score: number;
  plus_code: PlusCode;
}

export interface AutoCompleteResponse {
  predictions: Prediction[];
  executed_time: number;
  executed_time_all: number;
  status: string;
}


export interface Location {
  lat: number;
  lng: number;
}

export interface Geometry {
  location: Location;
}
export interface Result {
  place_id: string;
  formatted_address: string;
  geometry: Geometry;
  name: string;
}
export interface PlaceDetailResponse {
  result: Result;
  status: string;
}
