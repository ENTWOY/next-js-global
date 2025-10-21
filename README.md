```
// useEffect(() => {
  //   const socket = io(SOCKET_SERVER_URL, {
  //     transports: ["websocket"],
  //     withCredentials: true,
  //   });
  //   socketRef.current = socket;

  //   // Escucha de cuando se acepta un ticket
  //   socket.on("commercialNoteNewPendingShipment", (data: any) => {
  //     toast.success("Ticket aceptado exitosamente", {
  //       position: "top-center",
  //     });

  //     // Actulizar el estado de shipments original

  //     setShipments((prevShipments) => {
  //       if (prevShipments.length > 0) {
  //         const updatedShipments = [...prevShipments];
  //         updatedShipments[0] = {
  //           ...updatedShipments[0],
  //           commercialNotes: [data, ...updatedShipments[0].commercialNotes],
  //         };
  //         return updatedShipments;
  //       }
  //       return prevShipments;
  //     });
  //   });

  //   // Escucha de cuando se empaqueta un ticket
  //   socket.on("commercialTicketPackage", (data: any) => {
  //     toast.success("Ticket empaquetado exitosamente", {
  //       position: "top-center",
  //     });

  //     // Actualizar el estado de shipments original
  //     setFilteredShipments((prevShipments) => {
  //       const updatedShipments = prevShipments.map((shipment, index) => {
  //         if (index !== activeShipmentIndex) return shipment;
  //         return {
  //           ...shipment,
  //           commercialNotes: shipment.commercialNotes.map((note) =>
  //             note.id === data.id
  //               ? {
  //                   ...note,
  //                   CommercialTicket: {
  //                     ...note.CommercialTicket,
  //                     shippingStatus: data.CommercialTicket.shippingStatus,
  //                   },
  //                 }
  //               : note
  //           ),
  //         };
  //       });
  //       return updatedShipments;
  //     });

  //     // Actualizar estado de shipments para que filterShipments se actualice
  //     setTimeout(() => {
  //       setFilteredShipments((prevShipments) => {
  //         const updatedShipments = prevShipments.map((shipment, index) => {
  //           if (index !== activeShipmentIndex) return shipment;
  //           return {
  //             ...shipment,
  //             commercialNotes: shipment.commercialNotes.filter(
  //               (note) => note.id !== data.id
  //             ),
  //           };
  //         });
  //         return updatedShipments;
  //       });
  //     }, 2000);
  //   });

  //   // Socket de escucha cuando se cancelar un ticket y commercialNote
  //   socket.on("commercialTicketCancel", (data: any) => {
  //     toast.error("Ticket cancelado", {
  //       position: "top-center",
  //     });

  //     // Actualizar el estado shipments
  //     setShipments((prevShipments) =>
  //       prevShipments.map((shipment) => ({
  //         ...shipment,
  //         commercialNotes: shipment.commercialNotes.map((item) => {
  //           if (item.CommercialTicket.id === data.CommercialTicket.id) {
  //             return {
  //               ...item,
  //               CommercialTicket: {
  //                 ...item.CommercialTicket,
  //                 status: "C", // Actualiza el estado a "C"
  //                 // Puedes actualizar otros campos si es necesario
  //               },
  //             };
  //           }
  //           return item;
  //         }),
  //       }))
  //     );
  //   });

  //   return () => {
  //     socket.off("commercialNoteNewPendingShipment");
  //     socket.off("commercialTicketPackage");
  //     socket.off("commercialTicketCancel");
  //     socket.disconnect();
  //   };
  // }, []);
```

```
const filteredWarehouses = useMemo(() => {
    if (!warehouse || !filters.establishmentId) return [];
    return warehouse.filter((wh) => wh.establishmentId === filters.establishmentId);
  }, [warehouse, filters.establishmentId]);

const filteredWarehouses = useMemo(() => {
    if (!warehouse || !establishmentId) return [];
    return warehouse.filter((wh) => wh.establishmentId === establishmentId);
  }, [warehouse, establishmentId]);
```

```
"use client";
import { useEffect, useState } from "react";

export default function PersonsList() {
  const [persons, setPersons] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new-person") {
        setPersons((prev) => [...prev, data.payload]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>Lista de Personas</h1>
      <ul>
        {persons.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

```
git fetch origin
git checkout -b upgrade/nextjs15-migration origin/upgrade/nextjs15-migration

or

git checkout upgrade/nextjs15-migration
git pull origin upgrade/nextjs15-migration

git fetch origin
git merge origin/dev
```

<pre><code>
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API;
const hostname = baseUrl ? new URL(baseUrl).hostname : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  experimental: {
    optimizePackageImports: ['@svgr/webpack'],
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  images: {
    domains: hostname ? [hostname] : [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.icon-icons.com",
      },
      {
        protocol: "https",
        hostname: "ih1.redbubble.net",
      },
    ],
  },
};

module.exports = nextConfig;
</code></pre>

<pre style="font-size: 12px;"><code>
/** @type {import('next').NextConfig} */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API;
const hostname = baseUrl ? new URL(baseUrl).hostname : '';

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@svgr/webpack'],
  },
  images: {
    domains: hostname ? [hostname] : [],
    remotePatterns: [
      { protocol: "https", hostname: "api.lorem.space" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "a0.muscache.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "cdn.icon-icons.com" },
      { protocol: "https", hostname: "ih1.redbubble.net" },
    ],
  },
};

module.exports = nextConfig;
</code></pre>

```
// Opción - Acceso directo
accessorKey: 'serieDocument'

// Opción - Acceso anidado con template string
{
  id: 'serieDocument',
  accessorKey: 'serieDocument',
  header: 'Ticket de NV/NCC',
  cell: ({ row }) => {
    const ticket = row.original?.CommercialTicket;
    return ticket ? `${ticket.serieDocument || ''} - ${ticket.numberDocument || ''}`.trim() : '';
  },
}

// Opción - Acceso simple
accessorKey: 'warehouseId'

// Opción - Operación reduce
accessorFn: (row) => {
  const totalPrice = row.ProductSetItem.reduce((acc, item) => {
    return acc + parseFloat(item.price);
  }, 0);
  return totalPrice;
}

// Renderizado de imágenes
cell: ({ row }) => {
  const { files } = row.original;
  return (
    <Image
      src={`${API_BASE_URL}/${files[0]?.data[0]?.filePath||""}`}
      alt={files[0]?.name || "Promotional image"}
      width={80}
      height={80}
    />
  );
}
```

# SEO(SSR): 

# ISSUE(UPGRADE TO NEXT.JS 15)
![image](https://github.com/user-attachments/assets/a726fed8-e19c-42b9-a17c-85d0f9d9a090)

```
export const metadata = {
  title: 'Next.js App Router + React Server Components Demo',
  description: 'Demo of React Server Components in Next.js.',
  openGraph: {
    title: 'Next.js App Router + React Server Components Demo',
    description: 'Demo of React Server Components in Next.js.',
    images: ['https://next-rsc-notes.vercel.app/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```
