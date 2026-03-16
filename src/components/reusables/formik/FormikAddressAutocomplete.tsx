/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useRef, useEffect, useState, memo } from 'react';
import { useField, useFormikContext } from 'formik';
import logger from '@/utils/logger';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

interface FormikAddressAutocompleteProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const FormikAddressAutocomplete = ({
  name,
  label = 'Address',
  required = false,
  placeholder = 'Start typing address...',
  className,
}: FormikAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  // Fix click inside modal
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.style.pointerEvents = '';
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current) return;

    if (autocomplete) return;

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    try {
      const auto = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: ['us', 'in', 'ca'] },
      });

      const listener = auto.addListener('place_changed', () => {
        const place = auto.getPlace();

        if (!place) return;
        if (!place.address_components) return;
        if (!place.formatted_address) return;

        const components = extractAddressComponents(place);
        const fullAddress = place.formatted_address;

        // Set all the form values
        setFieldValue(name, fullAddress);
        setFieldValue('street', components.street);
        setFieldValue('city', components.city);
        setFieldValue('state', components.state);
        setFieldValue('state_code', components.state_code);
        setFieldValue('zip', components.zip);
        setFieldValue('country', components.country);
        setFieldValue(
          'country_code',
          components.country_code ? countries.alpha2ToAlpha3(components.country_code) : ''
        );
        setFieldValue('lat', components.lat);
        setFieldValue('lng', components.lng);
      });

      setAutocomplete(auto);

      // Cleanup function
      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      logger.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [name, setFieldValue]); // Added proper dependencies

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldValue(name, value);
  };

  return (
    <div className="relative">
      <Label htmlFor={name} className="mb-2 text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Input
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        className={cn('text-foreground pr-10', className)}
        value={field.value || ''}
        onChange={handleInputChange}
        autoComplete="off"
        required={required}
      />
    </div>
  );
};

function extractAddressComponents(
  result: google.maps.GeocoderResult | google.maps.places.PlaceResult
) {
  const components = result.address_components ?? [];

  const getLong = (types: string[]) =>
    components.find((c) => types.some((t) => c.types.includes(t)))?.long_name || '';

  const getShort = (types: string[]) =>
    components.find((c) => types.some((t) => c.types.includes(t)))?.short_name || '';

  const location = result.geometry?.location;

  return {
    street: getLong(['route']) || getLong(['street_number']),
    city:
      getLong(['locality']) || getLong(['administrative_area_level_2']) || getLong(['sublocality']),
    state: getLong(['administrative_area_level_1']),
    state_code: getShort(['administrative_area_level_1']),
    country: getLong(['country']),
    country_code: getShort(['country']),
    zip: getLong(['postal_code']),
    lat: typeof location?.lat === 'function' ? location.lat() : null,
    lng: typeof location?.lng === 'function' ? location.lng() : null,
  };
}

export default memo(FormikAddressAutocomplete);
