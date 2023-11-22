import { Component } from '@angular/core';
import { AmadeusService } from '../../services/amadeus.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent {
  from: string = '';
  fromLocation: any[] = [];
  origin: any;
  fromLocationTemplate: boolean = true;
  toLocationTemplate: boolean = false;
  // --------------
  to: any = '';
  destination: any;
  toLocation: any[] = [];
  departureDateTemplate: boolean = false;
  loading: boolean = false;

  constructor(private amadeusService: AmadeusService) {}

  ngOnInit(): void {}

  // ----- FROM WHERE ----------------

  handleFromLocation() {
    if (this.from.length > 3) {
      this.amadeusService.searchCityAndAirport(this.from).subscribe(
        (response) => {
          this.fromLocation = response.data || [];
        },
        (error) => {
          console.error('Error searching city and airport:', error);
        }
      );
    }
  }

  handleOrigin(location: any) {
    this.origin = location;
    this.fromLocationTemplate = false;
    this.toLocationTemplate = true;
    this.fromLocation = [];
  }

  // ------- TO WHERE ----------

  handleToLocation() {
    if (this.to.length > 3) {
      this.amadeusService.searchCityAndAirport(this.to).subscribe(
        (response) => {
          this.toLocation = response.data || [];
        },
        (error) => {
          console.error('Error searching city and airport:', error);
        }
      );
    }
  }

  handleDestination(location: any) {
    this.destination = location;
    this.toLocationTemplate = false;
    this.toLocation = [];
    this.departureDateTemplate = true;
  }

  // ------ DEPARTURE DATE ---------------------------

  date: any = '';
  flights: any;
  flightTemplate: boolean = false;
  currentDate: string = new Date().toISOString().split('T')[0];

  onFindFlight() {
    if (this.date === '') {
      alert('Please choose a date');
    } else {
      this.loading = true;
      this.amadeusService
        .searchFlights(
          this.origin.iataCode,
          this.destination.iataCode,
          this.date
        )
        .subscribe(
          (data) => {
            this.flights = data.data; // Assuming data is an object with a property 'data' which is an array

            this.loading = false;
            this.departureDateTemplate = false;
            this.flightTemplate = true;
          },
          (error) => {
            this.loading = false;
            alert(error);
          }
        );
    }
  }

  // -------- FLIGHT OFFERS ------------
  loadingBooking: { [key: string]: boolean } = {};
  booked: boolean = false;
  first: string = '';
  last: string = '';

  onBookFlight(flight: any) {
    if (this.first === '' && this.last === '') {
      alert('Enter your first and last name');
      return;
    }

    const name = {
      first: this.first,
      last: this.last,
    };

    const dataForBookingFlight = { flight: flight, name: name };
    this.loadingBooking[flight.id] = true;
    this.amadeusService.confirmFlightPrice(flight).subscribe(
      (dataObject) => {
        console.log('Success:', dataObject.data.flightOffers);

        this.amadeusService.bookFlight(dataForBookingFlight, name).subscribe(
          (data) => {
            console.log('Success:', data);
            this.loadingBooking[flight.id] = false;
            this.booked = true;
            this.flightTemplate = false;
            this.flights = [];
          },
          (error) => {
            console.error('Error:', error);
            alert(error);
          }
        );
      },
      (error) => {
        this.loadingBooking[flight.id] = false;
        console.error('Error:', error);
        alert(error);
      }
    );
  }
}
