import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAddressService {
  private API_KEY = environment.googleApiKey;
  private http = inject(HttpClient);

  async geocodeAddress(address: string): Promise<{ formattedAddress: string; location: { lat: number; lng: number }; city?: string }> {
    //console.log("🔎 Validando dirección con Google:", address);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        console.error('❌ Dirección no encontrada en Google');
        return { formattedAddress: address, location: { lat: 0, lng: 0 } };
      }

      const firstResult = data.results[0];
      const location = firstResult.geometry.location;

      let city = '';
      firstResult.address_components.forEach((component: any) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
      });

      //console.log("✅ Dirección validada por Google:", firstResult.formatted_address);

      return {
        formattedAddress: firstResult.formatted_address,
        location,
        city,
      };
    } catch (error) {
      console.error("❌ Error al conectar con Google:", error);
      return { formattedAddress: address, location: { lat: 0, lng: 0 } };
    }
  }
}
