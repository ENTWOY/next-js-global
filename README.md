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
