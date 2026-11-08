// One icon vocabulary for option 2, all from Phosphor (light weight in the UI).
import {
  Airplane, Barcode, Basket, BatteryCharging, Boat, ChartLineUp, ClipboardText, Clock, FileText, Globe, Handshake,
  ListChecks, MapPin, Package, Path, Plant, SealCheck, ShieldCheck, ShoppingCart, Signature, SolarPanel, Stack,
  Storefront, Target, Truck, Users, Warehouse, Crosshair, Scan,
} from '@phosphor-icons/react';

export const serviceIcons = {
  'amazon-fba-logistics': Package,
  'warehousing-and-3pl': Warehouse,
  'road-freight-and-transport': Truck,
  'international-freight': Globe,
  'customs-clearance': FileText,
  'dangerous-goods': BatteryCharging,
};

export const stepIcons = [ClipboardText, Barcode, ListChecks, Package, Truck, Signature];

export const detailIcons = {
  'Approved carrier': SealCheck, 'Built for volume': ChartLineUp, 'Inbound compliance': ShieldCheck,
  'Two Australian bases': MapPin, 'Warehouse hours': Clock, 'From receiving to distribution': Path,
  'Owned fleet': Truck, 'Additional capacity': Users, 'Shipment visibility': Crosshair,
  'China trade connections': Globe, 'Air and sea options': Airplane, 'Connected after arrival': Path,
  'Documentation first': FileText, 'Coordinated clearance': SealCheck, 'Next-stage planning': Path,
  'Product assessment': Scan, 'Handling requirements': ShieldCheck, 'Confirm before collection': Handshake,
};

export const sectorIcons = { Retail: Storefront, 'E-commerce': ShoppingCart, 'Solar & renewable technology': SolarPanel, FMCG: Basket, 'International imports': Boat };

export const valueIcons = [Target, Plant, Stack];

export const stageIcons = [Barcode, Stack, Truck, Signature];
