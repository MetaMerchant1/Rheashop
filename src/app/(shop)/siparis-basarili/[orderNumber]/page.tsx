import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderNumber } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Siparişiniz Alındı!
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu.
      </p>

      <div className="mt-8 rounded-xl bg-stone-50 p-6">
        <p className="text-sm text-stone-500">Sipariş Numaranız</p>
        <p className="mt-1 text-2xl font-bold text-amber-700">{orderNumber}</p>
      </div>

      <p className="mt-6 text-stone-600">
        Siparişinizin durumunu &quot;Hesabım &gt; Siparişlerim&quot; sayfasından takip
        edebilirsiniz. Siparişiniz hazırlandığında size e-posta ile bilgi
        vereceğiz.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/hesabim/siparislerim">
          <Button variant="outline">Siparişlerimi Görüntüle</Button>
        </Link>
        <Link href="/urunler">
          <Button>Alışverişe Devam Et</Button>
        </Link>
      </div>
    </div>
  );
}
