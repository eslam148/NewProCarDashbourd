import { Icon, icon } from 'leaflet';

// Fix for Leaflet icon issue
export const fixLeafletIcons = (): void => {
  // Fix default icon paths
  delete (Icon.Default.prototype as any)._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png'
  });
};
