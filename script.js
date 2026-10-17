
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  const allowed = ["PLTR", "INTC"];

  if (!allowed.includes(symbol)) {
    return NextResponse.json(
      { error: "Simbol tidak diizinkan" },
      { status: 400 }
    );
  }

  const token = process.env.FINNHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "API key belum dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Data harga tidak tersedia" },
        { status: 502 }
      );
    }

    const q = await response.json();

    if (!q.pc || !q.c) {
      return NextResponse.json(
        { error: "Harga belum tersedia" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      current: q.c,
      previousClose: q.pc,
      changePercent: ((q.c - q.pc) / q.pc) * 100,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data saham" },
      { status: 500 }
    );
  }
}
