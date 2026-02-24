export interface InstrumentType {
  id: string;
  name: string;
  category: string;
  role?: { id: string; name: string } | null;
}

export interface Instrument {
  id?: string;
  instrumentTypeId: string;
  level: string | null;
  order: number;
  instrumentType: InstrumentType;
}

export interface GroupedInstruments {
  [category: string]: InstrumentType[];
}
