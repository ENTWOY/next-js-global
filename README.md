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
