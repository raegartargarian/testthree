import {
  Building,
  Calendar,
  Building2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link1Icon } from "@radix-ui/react-icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// Helper to recursively find all objects with @type

const findTypeObjects = (obj: any) => {
  let results: any = [];
  if (obj && typeof obj === "object") {
    if (obj["@type"]) {
      results.push(obj);
    }
    Object.values(obj).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          results = results.concat(findTypeObjects(item));
        });
      } else if (typeof value === "object" && value !== null) {
        results = results.concat(findTypeObjects(value));
      }
    });
  }
  return results;
};

const GeoCoordinatesView = ({ data }: any) => {
  const position: [number, number] = [data.latitude, data.longitude];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">Location</span>
      </div>
      <div className="text-sm text-gray-600">
        Latitude: {data.latitude}, Longitude: {data.longitude}
      </div>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-48 rounded-lg"
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Location at {data.latitude}, {data.longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

const PlaceView = ({ data }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Building className="w-5 h-5" />
      <span className="font-medium">{data.name}</span>
    </div>
    {data.address && (
      <div className="text-sm text-gray-600">
        {data.address.addressLocality}, {data.address.addressRegion},{" "}
        {data.address.addressCountry}
      </div>
    )}
    {data.description && (
      <p className="text-sm text-gray-600">{data.description}</p>
    )}
  </div>
);

const CertificationView = ({ data }: any) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5" />
        <span className="font-medium">{data.name}</span>
      </div>
      <div className="text-sm text-gray-600">
        {data.description}
        {data.validFrom && (
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="w-4 h-4" />
            <span>
              Valid from: {new Date(data.validFrom).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const OrganizationView = ({ data }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Building2Icon className="w-5 h-5" />
      <span className="font-medium">{data.name}</span>
    </div>
    {data.identifier && (
      <div className="text-sm text-gray-600">
        {data.identifier.propertyID}: {data.identifier.value}
      </div>
    )}
  </div>
);
const LinkView = ({ data }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Link1Icon className="w-5 h-5" />
      <span className="font-medium">{data.name}</span>
    </div>
    {data.url && (
      <div className="text-sm text-light-success-dark underline">
        <a href={data.url} target="_blank" rel="noreferrer">
          {data.url}
        </a>
      </div>
    )}
  </div>
);

export const SchemaRenderer = ({ json }: any) => {
  const typeObjects = findTypeObjects(json);

  return (
    <Card className="u-card">
      <CardHeader>
        <CardTitle>Certificate Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {typeObjects.map((obj: any, index: number) => {
          switch (obj["@type"]) {
            case "GeoCoordinates":
              return <GeoCoordinatesView key={index} data={obj} />;
            case "Place":
              return <PlaceView key={index} data={obj} />;
            case "Certification":
              return <CertificationView key={index} data={obj} />;
            case "Organization":
              return <OrganizationView key={index} data={obj} />;
            case "Link":
              return <LinkView key={index} data={obj} />;
            default:
              return null;
          }
        })}
      </CardContent>
    </Card>
  );
};
