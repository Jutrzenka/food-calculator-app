type TypeData = 'element' | 'array' | 'status';

type InfoArrayData = {
  elements: number; // Ilość elementów
  pages: number; // Ilość stron
};

interface ElementData {
  type: 'string' | 'number' | 'boolean' | 'object'; // Typ zwróconego elementu
  value: any; // Element
}

interface ArrayData {
  info: InfoArrayData; // Informacje o tablicy
  value: any[]; // Zwrócona tablica
}

interface ErrorData {
  code: string; // Kod błędu
  message: string; // Wiadomość do błędu
}

export interface JsonCommunicationType {
  success: boolean; // Czy udało się przeprowadzić zapytanie
  typeData: TypeData; // Typ zwróconych danych
  data: ArrayData | ElementData | ErrorData | null; //Dane
}
