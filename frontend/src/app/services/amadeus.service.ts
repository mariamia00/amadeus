// amadeus.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AmadeusService {
  apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}
  searchCityAndAirport(parameter: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/city-and-airport-search/${parameter}`
    );
  }

  searchFlights(
    originCode: string,
    destinationCode: string,
    dateOfDeparture: string
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/flight-search`, {
      params: {
        originCode,
        destinationCode,
        dateOfDeparture,
      },
    });
  }

  confirmFlightPrice(flight: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/flight-confirmation`, {
      flight,
    });
  }

  bookFlight(flight: any, name: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/flight-booking`, {
      flight,
      name,
    });
  }
  
}
